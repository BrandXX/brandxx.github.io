import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, parseFragment, serialize } from 'parse5';
import { documents, themeDocuments } from './theme-documents.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const staging = path.join(root, '.staging');
const dist = path.join(staging, 'source');
const original = path.join(staging, 'original');
const themed = path.join(staging, 'themed');
const run = new Date().toISOString().replaceAll(':', '-');
const archive = path.join(staging, 'archive', run);
const protectedPaths = [
  'src/data/publicResume.ts', 'src/layouts/ResumeLayout.astro', 'src/styles/resume.css',
  'src/pages/resume.astro', 'src/pages/resume-research.astro', 'src/pages/resume-print.astro',
  'src/components/ResumeIdentity.astro', 'src/components/ResumeExperience.astro',
  'src/components/ResumeProjects.astro', 'src/components/ResumeSkills.astro',
  'public/resume.css', 'public/resume-navigation.css', 'public/resume-icons.svg',
  'public/resume.html', 'public/cover-letter.html', 'public/cover_letter.html',
  'public/defiantly_not_regex', 'public/pdfs', 'cover-letter.html', 'resume.html',
  '.github/workflows/deploy.yml', 'public/CNAME',
];

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory()
    ? (await files(path.join(directory, entry.name))).map(file => path.join(entry.name, file))
    : [entry.name]))).flat().sort();
}
async function hashes(directory) {
  return Object.fromEntries(await Promise.all((await files(directory)).map(async file => [file,
    createHash('sha256').update(await readFile(path.join(directory, file))).digest('hex')])));
}
function walk(node, predicate) {
  return [node, ...(node.childNodes || []).flatMap(child => walk(child, predicate))].filter(predicate);
}
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const first = (node, predicate) => walk(node, predicate)[0];
function append(parent, ...nodes) {
  for (const node of nodes) { node.parentNode = parent; parent.childNodes.push(node); }
}
function replace(node, ...nodes) {
  const parent = node.parentNode;
  nodes.forEach(item => { item.parentNode = parent; });
  parent.childNodes.splice(parent.childNodes.indexOf(node), 1, ...nodes);
}
const fragment = html => parseFragment(html).childNodes;

// Snapshots are outside both served roots; subsequent builds never replace an archive.
await mkdir(path.join(archive, 'source'), { recursive: true });
for (const file of protectedPaths) {
  const destination = path.join(archive, 'source', file);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(root, file), destination, { recursive: true });
}
const sourceHashes = await hashes(path.join(archive, 'source'));
execFileSync('npm', ['run', 'build:source', '--', '--outDir', '.staging/source'], { cwd: root, stdio: 'inherit' });
const buildHashes = await hashes(dist);
await cp(dist, path.join(archive, 'site'), { recursive: true });
for (const destination of [original, themed]) {
  await rm(destination, { recursive: true, force: true });
  await cp(dist, destination, { recursive: true });
}

await themeDocuments(themed);

// Neither local preview is a publishing artifact; production dist is separate.
for (const directory of [original, themed]) {
  for (const file of (await files(directory)).filter(file => file.endsWith('.html'))) {
    const page = parse(await readFile(path.join(directory, file), 'utf8'));
    const head = first(page, node => node.tagName === 'head');
    for (const node of walk(head, node => node.tagName === 'meta' && attr(node, 'name') === 'robots')) replace(node);
    append(head, ...fragment('<meta name="robots" content="noindex, nofollow, noarchive">'));
    await writeFile(path.join(directory, file), serialize(page));
  }
  await writeFile(path.join(directory, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  for (const file of ['CNAME', 'sitemap-index.xml', 'sitemap-0.xml']) await rm(path.join(directory, file), { force: true });
}
assert.deepEqual(await hashes(dist), buildHashes, 'Preview generation changed the normal build');
for (const [file, hash] of Object.entries(sourceHashes)) {
  assert.equal(createHash('sha256').update(await readFile(path.join(root, file))).digest('hex'), hash, `Source changed: ${file}`);
}
const manifest = { run, sourceBuildDirectory: path.relative(root, dist), protectedSourceHashes: sourceHashes, originalBuildHashes: buildHashes, documents };
await writeFile(path.join(archive, 'manifest.json'), JSON.stringify(manifest, null, 2));
await writeFile(path.join(staging, 'latest.json'), JSON.stringify({ archive, ...manifest }, null, 2));
console.log(`\nLocal-only previews prepared. ${Object.keys(sourceHashes).length} source files verified unchanged.\nOriginal sources and build retained in ${archive}`);
