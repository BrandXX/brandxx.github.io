import assert from 'node:assert/strict';
import { cp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, parseFragment, serialize } from 'parse5';

const root = fileURLToPath(new URL('../', import.meta.url));
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory()
    ? (await files(path.join(directory, entry.name))).map(file => path.join(entry.name, file))
    : [entry.name]))).flat().sort();
}

function walk(node, predicate) {
  return [node, ...(node.childNodes || []).flatMap(child => walk(child, predicate))].filter(predicate);
}
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);
const first = (node, predicate) => walk(node, predicate)[0];
function setAttr(node, name, value) {
  node.attrs = (node.attrs || []).filter(item => item.name !== name);
  node.attrs.push({ name, value });
}
function append(parent, ...nodes) {
  for (const node of nodes) { node.parentNode = parent; parent.childNodes.push(node); }
}
function replace(node, ...nodes) {
  const parent = node.parentNode;
  nodes.forEach(item => { item.parentNode = parent; });
  parent.childNodes.splice(parent.childNodes.indexOf(node), 1, ...nodes);
}
const fragment = html => parseFragment(html).childNodes;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');

export const documents = [
  { file: 'resume/index.html', route: '/resume/', kind: 'resume', label: 'resume', pdf: 'resume' },
  { file: 'resume-print/index.html', route: '/resume-print/', kind: 'resume-print', label: 'resume', pdf: 'resume' },
  { file: 'resume-research/index.html', route: '/resume-research/', kind: 'research', label: 'research', pdf: 'applied-ai-research' },
  { file: 'cover-letter.html', route: '/cover-letter.html', kind: 'cover', label: 'cover letter', pdf: 'cover-letter' },
  { file: 'defiantly_not_regex/index.html', route: '/defiantly_not_regex/', kind: 'image' },
  ...['thesis', 'backstory', 'whitepaper'].map(name => ({
    file: `defiantly_not_regex/pages/${name}.html`, route: `/defiantly_not_regex/pages/${name}.html`, kind: 'essay',
  })),
];
const normalized = route => route === '/' ? route : route.replace(/\/$/, '');
function toolbar(doc, bottom = false) {
  const links = doc.pdf
    ? [['/resume/', 'Resume'], ['/cover-letter.html', 'Cover Letter'], ['/resume-research/', 'Research']]
    : [['/defiantly_not_regex/', 'The image'], ['/defiantly_not_regex/pages/thesis.html', 'Thesis'],
      ['/defiantly_not_regex/pages/backstory.html', 'Backstory'], ['/defiantly_not_regex/pages/whitepaper.html', 'White paper']];
  const navigation = links.map(([href, label]) => `<a href="${href}"${normalized(href) === normalized(doc.route) || (doc.kind === 'resume-print' && href === '/resume/') ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const icon = name => `<svg width="19" height="19" aria-hidden="true"><use href="/resume-icons.svg#${name}"></use></svg>`;
  const actions = doc.pdf ? `<div class="preview-document-actions">
    <button class="icon-button" type="button" data-preview-print="${doc.kind}" aria-label="Print ${doc.label}" title="Print ${doc.label}">${icon('printer')}<span class="button-tooltip">Print ${doc.label}</span></button>
    <a class="preview-download" href="/pdfs/johnathan-carroll-${doc.pdf}.pdf" download aria-label="Download ${doc.label} PDF">${icon('download')}<span>Download PDF</span></a>
  </div>` : '';
  return fragment(bottom
    ? `<div class="preview-document-end"><a href="#main">Back to top</a>${actions}</div>`
    : `<div class="preview-document-tools"><div class="site-width preview-tools-row"><a class="preview-home" href="/">Back to site</a><nav aria-label="${doc.pdf ? 'Documents' : 'Defiantly Not Regex'}">${navigation}</nav>${actions}</div></div>`);
}


export async function themeDocuments(directory) {
  const template = await readFile(path.join(directory, 'index.html'), 'utf8');
  for (const doc of documents) {
    const source = parse(await readFile(path.join(directory, doc.file), 'utf8'));
    const content = first(source, node => doc.kind === 'essay' ? hasClass(node, 'content') : node.tagName === 'main');
    assert(content, `Missing content for ${doc.file}`);
    const originalContent = serialize(content);
    const page = parse(template);
    const head = first(page, node => node.tagName === 'head');
    const body = first(page, node => node.tagName === 'body');
    const main = first(page, node => node.tagName === 'main');
    setAttr(body, 'class', `preview-document-page preview-kind-${doc.kind}${doc.kind === 'resume-print' ? ' print-document' : ''}`);
    const title = first(source, node => node.tagName === 'title');
    replace(first(head, node => node.tagName === 'title'), title);
    const description = attr(first(source, node => node.tagName === 'meta' && attr(node, 'name') === 'description'), 'content') || '';
    for (const meta of walk(head, node => node.tagName === 'meta')) {
      const name = attr(meta, 'name') || attr(meta, 'property');
      if (['description', 'og:description', 'twitter:description'].includes(name)) setAttr(meta, 'content', description);
      if (['og:title', 'twitter:title'].includes(name)) setAttr(meta, 'content', text(title));
      if (name === 'og:url') setAttr(meta, 'content', `https://techsoftsys.com${doc.route}`);
    }
    setAttr(first(head, node => node.tagName === 'link' && attr(node, 'rel') === 'canonical'), 'href', `https://techsoftsys.com${doc.route}`);
    const robots = first(source, node => node.tagName === 'meta' && attr(node, 'name') === 'robots');
    if (robots) append(head, robots);
    if (doc.pdf) append(head, ...fragment('<link rel="stylesheet" href="/resume.css" media="print">'));

    // Move the parsed article intact. Only its outer presentation shell is replaced.
    setAttr(main, 'id', 'main');
    setAttr(main, 'class', `preview-document${doc.pdf ? ' resume-shell' : doc.kind === 'image' ? ' preview-image' : ' preview-essay'}`);
    main.childNodes = [];
    append(main, ...content.childNodes);
    assert.equal(serialize(main), originalContent, `Content changed while theming ${doc.file}`);
    setAttr(first(body, node => hasClass(node, 'skip-link')), 'href', '#main');
    replace(main, ...toolbar(doc), main, ...toolbar(doc, true));
    const header = first(body, node => hasClass(node, 'site-header'));
    for (const link of walk(header, node => node.tagName === 'a' && attr(node, 'href'))) {
      const href = attr(link, 'href');
      if (normalized(doc.route) === normalized(href) || (href === '/defiantly_not_regex/' && doc.route.startsWith(href))) setAttr(link, 'aria-current', 'page');
    }
    const more = first(body, node => hasClass(node, 'nav-more'));
    if (first(more, node => attr(node, 'aria-current') === 'page')) setAttr(first(more, node => node.tagName === 'summary'), 'class', 'has-active-page');
    append(body, ...fragment('<script type="module" src="/document-assets/documents.js"></script>'));
    await writeFile(path.join(directory, doc.file), serialize(page));
  }


  for (const file of (await files(directory)).filter(file => file.endsWith('.html'))) {
    const page = parse(await readFile(path.join(directory, file), 'utf8'));
    const head = first(page, node => node.tagName === 'head');
    append(head, ...fragment('<link rel="stylesheet" href="/document-assets/documents.css">'));
    await writeFile(path.join(directory, file), serialize(page));
  }
  await cp(path.join(root, 'preview'), path.join(directory, 'document-assets'), { recursive: true });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await themeDocuments(path.join(root, 'dist'));
  console.log('Applied approved site theme; canonical article markup and production metadata preserved.');
}
