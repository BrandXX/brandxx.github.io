import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import { transformWithEsbuild } from 'vite';

let checks = 0;
const normalizeText = text => text.normalize('NFKC').replace(/[\u2010-\u2015]/g, '-').replace(/[\u200b-\u200d\ufeff]/g, '').replace(/\s+/g, ' ').trim();
const repositoryRoot = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const runGit = promisify(execFile);
const genericPrivacyPatterns = [
  ['local source paths', /(?:\/home\/|\/Users\/|[a-z]:\\Users\\)/i],
  ['internal IPv4 endpoints', /\b(?:10(?:\.\d{1,3}){3}|127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|0\.0\.0\.0)\b/],
  ['internal hostnames', /\b(?:localhost|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:local|lan|internal))\b/i],
  ['internal IPv6 endpoints', /(?:\[::1\]|\b(?:https?|wss?):\/\/\[(?:f[cd][0-9a-f]{2}|fe80):)/i],
  ['service ports', /\b(?:https?|wss?):\/\/[^\s"'<>/]+:\d+(?:[/?#]|\b)/i],
];

async function loadPrivatePatterns() {
  if (!process.env.RESUME_PRIVATE_RULES) return [];
  const rulesPath = await realpath(path.resolve(process.env.RESUME_PRIVATE_RULES));
  const relative = path.relative(repositoryRoot, rulesPath);
  assert(relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative), 'Private rules must be stored outside the repository');
  const rules = JSON.parse(await readFile(rulesPath, 'utf8'));
  assert(rules && typeof rules === 'object' && !Array.isArray(rules), 'Private rules must be a JSON object');
  const aliases = rules.aliases ?? [];
  const patterns = rules.patterns ?? [];
  assert(Array.isArray(aliases) && Array.isArray(patterns), 'Private aliases and patterns must be arrays');
  return [
    ...aliases.map((alias, index) => {
      assert(typeof alias === 'string' && alias.trim(), `Invalid private alias rule ${index + 1}`);
      const escaped = normalizeText(alias).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return [`private alias rule ${index + 1}`, new RegExp(`(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`, 'i')];
    }),
    ...patterns.map((pattern, index) => {
      assert(pattern && typeof pattern.label === 'string' && pattern.label.trim() && typeof pattern.source === 'string' && pattern.source, `Invalid private pattern rule ${index + 1}`);
      assert(pattern.flags === undefined || typeof pattern.flags === 'string', `Invalid flags for private pattern rule ${index + 1}`);
      return [pattern.label, new RegExp(pattern.source, pattern.flags ?? '')];
    }),
  ];
}

const configuredPrivatePatterns = await loadPrivatePatterns();

function assertTextPatterns(text, label, patterns) {
  for (const [reason, pattern] of patterns) {
    for (const candidate of new Set([text, normalizeText(text)])) {
      pattern.lastIndex = 0;
      assert(!pattern.test(candidate), `${label}: ${reason}`);
    }
    checks++;
  }
}

function assertPublicText(text, label) {
  assertTextPatterns(text, label, [...genericPrivacyPatterns, ...configuredPrivatePatterns]);
}

async function scanRepositoryPrivacy(indexOnly = false) {
  const result = { enabled: configuredPrivatePatterns.length > 0, rules: configuredPrivatePatterns.length, workingTreeFiles: 0, workingTreeTextFiles: 0, indexedFiles: 0, indexedTextFiles: 0 };
  if (!result.enabled) return result;
  const gitOptions = { cwd: repositoryRoot, maxBuffer: 32 * 1024 * 1024 };
  const { stdout: paths } = await runGit('git', ['ls-files', '--cached', ...(!indexOnly ? ['--others', '--exclude-standard'] : []), '-z'], gitOptions);
  const label = indexOnly ? 'Indexed' : 'Working-tree';
  for (const file of new Set(paths.split('\0').filter(Boolean))) {
    assertTextPatterns(file, `${label} filename`, configuredPrivatePatterns);
    let body;
    if (indexOnly) {
      ({ stdout: body } = await runGit('git', ['show', `:${file}`], { ...gitOptions, encoding: 'buffer' }));
    } else {
      try {
        body = await readFile(path.join(repositoryRoot, file));
      } catch (error) {
        if (error.code === 'ENOENT') continue;
        throw error;
      }
    }
    result[indexOnly ? 'indexedFiles' : 'workingTreeFiles']++;
    if (!body.includes(0)) {
      assertTextPatterns(body.toString('utf8'), `${label} source: ${file}`, configuredPrivatePatterns);
      result[indexOnly ? 'indexedTextFiles' : 'workingTreeTextFiles']++;
    }
  }
  return result;
}

function assertContains(text, expected, label) {
  assert(normalizeText(text).includes(normalizeText(expected)), `${label}: missing ${expected}`);
  checks++;
}

function assertResidencyEvidence(text, label) {
  const normalized = normalizeText(text);
  for (const [description, pattern] of [
    ['full source-sleep-to-first-visible-token timing', /source.{0,40}sleep.{0,80}first.{0,30}visible.{0,20}token/i],
    ['0.96-0.97 second full switch measurement', /\b0\.96\d*\s*(?:-|\/)\s*0\.97\d*\s*(?:s\b|seconds?\b)/i],
    ['61/61 cycles', /\b61\s*\/\s*61\b.{0,40}cycles?\b/i],
    ['122/122 post-wake checks', /\b122\s*\/\s*122\b.{0,50}checks?\b/i],
    ['arithmetic and tool validation', /\barithmetic.{0,30}tool\b/i],
    ['473 ms mean', /(?:\bmean\b.{0,40}(?:473\s*ms|0\.473\s*s\b)|(?:473\s*ms|0\.473\s*s\b).{0,40}\bmean\b)/i],
    ['1.630-1.634 second synchronized pair', /\b1\.630?\s*-\s*1\.634\s*(?:s\b|seconds?\b)/i],
    ['synchronized pair under embedder load', /synchroniz(?:ed|ation).{0,100}pair.{0,120}embed(?:der|ding)/i],
    ['274.7 GB/s STREAM background', /(?:STREAM.{0,100}274\.7\s*GB\s*\/\s*s\b|274\.7\s*GB\s*\/\s*s\b.{0,100}STREAM)/i],
    ['3.5-3.9% median pair-wake increase', /\b3\.5\s*%?\s*-\s*3\.9\s*%/],
    ['median pair-wake comparison', /\bmedian\b.{0,60}pair.{0,30}wake/i],
    ['60/60 final arithmetic gates', /\b60\s*\/\s*60\b.{0,40}arithmetic.{0,20}checks?\b/i],
    ['final stable gate matrix', /\bfinal\b.{0,30}\bstable[\s-]+gate\b/i],
    ['failed Nano boundary', /(?:\bNano\b.{0,90}\bfail(?:ed|ure|ures)\b|\bfail(?:ed|ure|ures)\b.{0,90}\bNano\b)/i],
    ['outstanding long soak boundary', /(?:\blong[\s-]+(?:duration[\s-]+)?(?:near-saturation contention testing|soak)\b.{0,120}\b(?:outstanding|pending|incomplete|unfinished|not (?:yet )?complete|remains? open)\b|\b(?:outstanding|pending|incomplete|unfinished)\b.{0,120}\blong[\s-]+(?:duration[\s-]+)?soak\b)/i],
  ]) {
    assert(pattern.test(normalized), `${label}: missing ${description}`);
    checks++;
  }
}

function assertProposalStatus(project, label) {
  assertContains(project.status, 'Proposal and design only', `${label}: status`);
  assertContains(project.status, 'no combined-system experiments', `${label}: status`);
  assertContains(project.summary, 'no combined-system implementation, experiments, or measured gains', label);
  assertContains(project.boundary, 'No combined-system implementation, experimental improvement, safety guarantee, or publication is claimed', label);
  assertContains(project.boundary, 'Papers, diagrams, and internal architecture details remain private', label);
  assertContains(project.boundary, 'high-level abstract only', label);
}

function pdfPageCount(pdf, label) {
  const pages = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length;
  assert(pages > 0, `${label}: PDF has no readable page objects`);
  checks++;
  return pages;
}

function assertPdfPages(pages, kind) {
  const [minimum, maximum] = kind === 'research' ? [4, 8] : kind === 'cover' ? [1, 1] : [2, 4];
  assert(pages >= minimum && pages <= maximum, `${kind}: expected ${minimum}-${maximum} PDF pages, got ${pages}`);
  checks++;
}

async function assertPublicDocument(page, route) {
  // Include hidden copy, metadata, and link attributes without scanning dev-server scripts.
  const content = await page.evaluate(() => {
    const main = document.querySelector('main');
    const markup = main.cloneNode(true);
    if (document.querySelector('script[src*="/@vite/client"], astro-dev-toolbar')) {
      for (const element of [markup, ...markup.querySelectorAll('[data-astro-source-file]')]) element.removeAttribute('data-astro-source-file');
    }
    return [
      document.title,
      document.querySelector('meta[name="description"]')?.content ?? '',
      markup.outerHTML,
      main.textContent,
      ...[...document.querySelectorAll('a[href]')].map(link => link.getAttribute('href')),
    ].join('\n');
  });
  assertPublicText(content, route);
}

async function assertSelectedProjects(page, selectedProjects, compact = false) {
  const entries = page.locator('main .project-entry');
  assert.deepEqual(await entries.locator('h3').allTextContents(), selectedProjects.map(project => project.title), 'General resume project selection/order');
  checks++;
  for (const [index, project] of selectedProjects.entries()) {
    assertContains(await entries.nth(index).innerText(), project.printSummary, `General resume: ${project.id}`);
    if (project.resumeBoundary) assertContains(await entries.nth(index).innerText(), project.resumeBoundary, `General resume: ${project.id} boundary`);
    if (!compact) {
      assert.equal(await entries.nth(index).locator('h3 a').getAttribute('href'), `/resume-research#${project.id}`);
      checks++;
    }
  }
}

async function assertResumeExperience(page, compact = false) {
  const employers = ['Pascua Yaqui Tribe Government', 'TechSoft Systems', ...previousRoles.map(role => role.employer)];
  assert.deepEqual(await page.locator('main .experience-entry .entry-heading h3').allTextContents(), employers, 'Resume must retain every employer once, in order');
  const headingIds = await page.locator('main h2[id]').evaluateAll(headings => headings.map(heading => heading.id));
  assert.equal(new Set(headingIds).size, headingIds.length, 'Resume section headings must have unique IDs');
  assert.equal(await page.locator('main [aria-labelledby]').evaluateAll(sections => sections.every(section => section.getAttribute('aria-labelledby').split(/\s+/).every(id => document.getElementById(id)))), true, 'Resume section labels must resolve');
  checks += 3;
  if (compact) {
    const frames = page.locator('.print-page');
    assert.equal(await frames.count(), 3, 'Expected three logical resume print pages');
    const expectedEmployers = [[employers[0]], [employers[1], ...employers.slice(2, 4)], employers.slice(4)];
    for (const [index, expected] of expectedEmployers.entries()) {
      assert.deepEqual(await frames.nth(index).locator('.experience-entry .entry-heading h3').allTextContents(), expected, `Employer placement on print page ${index + 1}`);
      checks++;
    }
    assert.equal(await frames.nth(0).locator('.resume-identity').count(), 1);
    assert.equal(await frames.nth(1).locator('.project-entry').count(), selectedProjects.length);
    checks += 3;
  }
}

// Use the site's TypeScript transform so counts and titles follow the public data.
const publicSource = await readFile(new URL('../src/data/publicResume.ts', import.meta.url), 'utf8');
const { code } = await transformWithEsbuild(publicSource, 'publicResume.ts', { loader: 'ts' });
const publicResume = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const { projects, benchmarks, resumeProjects: selectedProjects, residencyMeasurements, inferenceEngineering, previousRoles } = publicResume;
assert(Array.isArray(projects) && projects.length > 0, 'Public projects are required');
assert(Array.isArray(benchmarks) && benchmarks.length > 0, 'Retain the inference benchmark data');
const selectedProjectIds = ['residency', 'ai-q', 'piper'];
for (const id of [...selectedProjectIds, 'memory', 'preloader', 'proposals']) {
  assert.equal(projects.filter(project => project.id === id).length, 1, `Missing or duplicate public project: ${id}`);
  checks++;
}
assert.deepEqual(selectedProjects.map(project => project.id), selectedProjectIds, 'Public resume project selection/order');
assert.deepEqual(selectedProjects, selectedProjectIds.map(id => projects.find(project => project.id === id)), 'Resume projects must use the public research entries');
assert(Array.isArray(residencyMeasurements) && residencyMeasurements.length > 0, 'Residency measurements are required');
const researchIds = [...projects.map(project => project.id), 'inference'];
assert.equal(new Set(researchIds).size, researchIds.length, 'Research IDs must be unique');
assert(researchIds.every(id => /^[a-z][a-z0-9-]*$/.test(id)), 'Research IDs must be valid anchor slugs');
assert.equal(projects[0].id, 'residency', 'Residency should be the first research project');
assertPublicText(publicSource, 'Public resume source');
assertPublicText(JSON.stringify(publicResume), 'Public resume data');
assertResidencyEvidence([selectedProjects[0].summary, ...selectedProjects[0].details, ...residencyMeasurements.flatMap(measurement => [measurement.title, measurement.result, measurement.method]), selectedProjects[0].boundary].join('\n'), 'Public residency data');
assertContains(selectedProjects[0].resumeBoundary, 'Historical component validation, not whole-architecture production qualification', 'Residency resume boundary');
assertContains(selectedProjects[0].resumeBoundary, 'Nano numerical failures and long-duration near-saturation testing remained unresolved', 'Residency resume boundary');
assertProposalStatus(projects.find(project => project.id === 'proposals'), 'Public proposals');

const base = process.env.RESUME_BASE_URL || 'http://127.0.0.1:4322';
const screenshots = process.env.RESUME_SCREENSHOTS || '/tmp/resume-preview';
const verificationSummaryPath = path.resolve(process.env.RESUME_VERIFICATION_SUMMARY || path.join(screenshots, 'verification.json'));
const generatePdf = process.argv.includes('--pdf');
const generateCoverPdf = process.argv.includes('--cover-pdf');
await mkdir(screenshots, { recursive: true });
let repositoryPrivacy;
let browser;
let phase = 'repository-privacy';
const errors = [];
const downloadedPdfPages = {};
try {
  repositoryPrivacy = await scanRepositoryPrivacy();
  browser = await chromium.launch({ headless: true });
  phase = 'browser';
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/resume', '/resume-research', '/resume-print', '/cover-letter.html']) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('main h1').count(), 1);
      const [downloadPath, pdfKind] = route === '/resume-research'
        ? ['/pdfs/johnathan-carroll-applied-ai-research.pdf', 'research']
        : route === '/cover-letter.html'
          ? ['/pdfs/johnathan-carroll-cover-letter.pdf', 'cover']
          : ['/pdfs/johnathan-carroll-resume.pdf', 'resume'];
      assert.equal(await page.locator('.download-button').getAttribute('href'), downloadPath);
      const downloadResponse = await context.request.get(base + downloadPath);
      assert.equal(downloadResponse.status(), 200, downloadPath);
      assert(downloadResponse.headers()['content-type'].includes('application/pdf'));
      const downloadBody = await downloadResponse.body();
      assert.equal(downloadBody.subarray(0, 5).toString(), '%PDF-');
      assert.deepEqual(downloadBody, await readFile('public' + downloadPath), `Unexpected PDF bytes: ${route}`);
      downloadedPdfPages[pdfKind] = pdfPageCount(downloadBody, downloadPath);
      assertPdfPages(downloadedPdfPages[pdfKind], pdfKind);
      await assertPublicDocument(page, route);
      if (route === '/resume' || route === '/resume-print') {
        const compact = route === '/resume-print';
        await assertSelectedProjects(page, selectedProjects, compact);
        await assertResumeExperience(page, compact);
      }
      checks += 5;
      await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow: ${route} at ${width}`);
      assert.equal(await page.locator('.resume-nav img').count(), 0);
      const printName = route === '/cover-letter.html' ? 'Print cover letter' : route === '/resume-research' ? 'Print research' : 'Print resume';
      for (const region of ['.resume-nav', '.resume-footer']) {
        assert.equal(await page.locator(region).getByRole('button', { name: printName, exact: true }).count(), 1);
      }
      const background = await page.locator('body').evaluate(body => {
        const style = getComputedStyle(body, '::before');
        return { image: style.backgroundImage, position: style.position, filter: style.filter, opacity: style.opacity, pointerEvents: style.pointerEvents };
      });
      assert(background.image.includes('linear-gradient'));
      assert.equal(background.position, 'fixed');
      assert.equal(background.filter, 'blur(56px)');
      assert.equal(background.opacity, '0.6');
      assert.equal(background.pointerEvents, 'none');
      assert.equal(await page.locator('.resume-nav').evaluate(nav => {
        const rects = [...nav.querySelectorAll('a, button')].map(element => element.getBoundingClientRect());
        return rects.every((a, i) => rects.every((b, j) => i === j || a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1));
      }), true, `Overlapping controls: ${route} at ${width}`);
      await page.screenshot({ path: path.join(screenshots, `${route.slice(1)}-${width}-light.png`), fullPage: true, animations: 'disabled' });
      await page.screenshot({ path: path.join(screenshots, `${route.slice(1)}-${width}-viewport.png`), animations: 'disabled' });
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
      assert.equal(await page.locator('html').evaluate(root => root.classList.contains('dark')), true);
      await page.screenshot({ path: path.join(screenshots, `${route.slice(1)}-${width}-dark.png`), fullPage: true, animations: 'disabled' });
      await page.screenshot({ path: path.join(screenshots, `${route.slice(1)}-${width}-dark-viewport.png`), animations: 'disabled' });
      await page.getByRole('button', { name: 'Switch to light theme' }).click();
      checks += 14;
    }
    await page.goto(base + '/resume');
    const text = await page.locator('main').innerText();
    for (const expected of ['Aug 2023 - Present', 'Jan 2021 - Aug 2023', 'Jan 2019 - Jan 2021', '$250,000', '25+ years', 'advisory', 'Tier 2/3 Windows']) assert(text.includes(expected), expected);
    for (const excluded of ['Guadalupe', '36 TB', '400 switching', 'known threat group', '10x', 'two network-wide', '114 successful live']) assert(!text.includes(excluded), excluded);
    assert(text.includes('Originated and serve as primary architect for an estimated $6 million'));
    await assertSelectedProjects(page, selectedProjects);
    checks++;
    await page.locator('a[href="/resume-research#piper"]').click();
    await page.waitForURL('**/resume-research#piper');
    const researchMain = await page.locator('main').innerText();
    for (const expected of ['typed request, budget, and evidence contracts', 'Separated advisory classification from agent execution', 'blocked approval on source drift', 'live-memory application disabled', 'single-GPU serving configuration', 'workload-specific model selection', "each engine's own KV capacity", 'startup capacity did not establish simultaneous maximum-context workload support']) {
      assert(researchMain.includes(expected), expected);
      checks++;
    }
    await assertPublicDocument(page, '/resume-research');
    assertResidencyEvidence(await page.locator('#residency').innerText(), 'Rendered residency research');
    assert.deepEqual(await page.locator('.research-section').evaluateAll(sections => sections.map(section => section.id)), researchIds);
    assert.deepEqual(await page.locator('.project-nav a').evaluateAll(links => links.map(link => link.getAttribute('href'))), researchIds.map(id => `#${id}`));
    checks += 2;
    for (const project of projects) {
      const section = page.locator(`#${project.id}`);
      assert.equal(await section.locator('h2').innerText(), project.title);
      assert.equal(await section.locator('.research-status').innerText(), project.status);
      assert.equal(await section.locator('.claim-boundary').count(), 1);
      assertContains(await section.locator('.claim-boundary').innerText(), project.boundary, `${project.id}: claim boundary`);
      const sectionText = await section.innerText();
      for (const expected of [project.focus, project.summary, ...project.details]) assertContains(sectionText, expected, `${project.id}: public content`);
      checks += 3;
    }
    const proposalSection = page.locator('#proposals');
    assertProposalStatus({
      status: await proposalSection.locator('.research-status').innerText(),
      summary: await proposalSection.innerText(),
      boundary: await proposalSection.locator('.claim-boundary').innerText(),
    }, 'Rendered proposals');
    assert.equal(await proposalSection.locator('a[href], img, picture, svg, canvas, iframe, object, embed').count(), 0, 'Proposal abstract must not publish artifacts or diagrams');
    checks++;
    const residencyEntries = page.locator('#residency .benchmark-list article');
    assert.equal(await residencyEntries.count(), residencyMeasurements.length);
    checks++;
    for (const [index, measurement] of residencyMeasurements.entries()) {
      const measurementText = await residencyEntries.nth(index).innerText();
      for (const expected of [measurement.title, measurement.result, measurement.method]) assertContains(measurementText, expected, 'Residency measurement');
    }
    const inferenceSection = page.locator('#inference');
    assert.equal(await inferenceSection.locator('.research-status').innerText(), inferenceEngineering.status);
    assert.equal(await inferenceSection.locator('h2').innerText(), inferenceEngineering.title);
    checks += 2;
    for (const expected of [inferenceEngineering.focus, ...inferenceEngineering.paragraphs, ...inferenceEngineering.details, inferenceEngineering.boundary]) assertContains(await inferenceSection.innerText(), expected, 'Inference engineering');
    const benchmarkEntries = page.locator('#inference .benchmark-list article');
    assert.equal(await benchmarkEntries.count(), benchmarks.length);
    checks++;
    for (const [index, benchmark] of benchmarks.entries()) {
      const benchmarkText = await benchmarkEntries.nth(index).innerText();
      for (const expected of [benchmark.model, benchmark.result, benchmark.method]) assertContains(benchmarkText, expected, 'Inference benchmark');
    }
    for (const id of researchIds) {
      await page.locator(`.project-nav a[href="#${id}"]`).click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/resume-research' && url.hash === `#${id}`);
      assert.equal(await page.locator(`#${id}`).count(), 1);
      assert.equal(await page.locator(`#${id}`).isVisible(), true);
      checks += 2;
    }
    await page.goto(base + '/resume');
    const resumeResearchLinks = [...new Set(await page.locator('main a[href*="/resume-research#"]').evaluateAll(links => links.map(link => link.getAttribute('href'))))];
    for (const href of resumeResearchLinks) {
      const id = new URL(href, base).hash.slice(1);
      assert(researchIds.includes(id), `Unknown research anchor on resume: ${id}`);
      assert(!projects.some(project => project.id === id && !selectedProjectIds.includes(id)), `Research-only project linked from general resume: ${id}`);
      await page.goto(base + '/resume');
      await page.locator(`main a[href="${href}"]`).first().click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/resume-research' && url.hash === `#${id}`);
      assert.equal(await page.locator(`#${id}`).count(), 1);
      checks += 3;
    }
    for (const route of ['/resume']) {
      for (const region of ['.resume-nav', '.resume-footer']) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
        await page.locator(region).getByRole('button', { name: 'Print resume', exact: true }).click();
        await page.waitForURL('**/resume-print');
        const printPageCount = await page.locator('.print-page').count();
        assert.equal(printPageCount, 3, 'Expected three logical resume print pages');
        await assertSelectedProjects(page, selectedProjects, true);
        checks++;
      }
    }
    await page.evaluate(() => { window.print = () => { window.__resumePrintCalls = (window.__resumePrintCalls || 0) + 1; }; });
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    for (const region of ['.resume-nav', '.resume-footer']) await page.locator(region).getByRole('button', { name: 'Print resume', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__resumePrintCalls), 2);
    checks++;
    await page.goto(base + '/resume-research#piper');
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    const researchUrl = page.url();
    const researchText = await page.locator('main').innerText();
    await page.evaluate(() => { window.print = () => { window.__researchPrintCalls = (window.__researchPrintCalls || 0) + 1; }; });
    for (const region of ['.resume-nav', '.resume-footer']) {
      await page.locator(region).getByRole('button', { name: 'Print research', exact: true }).click();
      assert.equal(page.url(), researchUrl);
      checks++;
    }
    assert.equal(await page.evaluate(() => window.__researchPrintCalls), 2);
    assert.equal(await page.locator('main').innerText(), researchText);
    checks += 2;
    await page.goto(base + '/resume.html', { waitUntil: 'networkidle' });
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/resume');
    assert.equal(await page.locator('main h1').innerText(), 'Johnathan W. Carroll');
    const pdfResponse = await context.request.get(base + '/pdfs/johnathan-carroll-resume.pdf');
    assert.equal(pdfResponse.status(), 200);
    assert((await pdfResponse.body()).subarray(0, 5).toString() === '%PDF-');
    assert.equal((await context.request.get(base + '/cover-letter.html')).status(), 200);
    assert.equal((await context.request.get(base + '/resume-icons.svg')).status(), 200);
    checks += 22;
    let documentGeometry;
    for (const [route, activeLabel] of [['/resume', 'Resume'], ['/cover-letter.html', 'Cover Letter'], ['/resume-research', 'Research']]) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const navigation = page.locator('.document-nav');
      const presentation = await page.evaluate(() => {
        const css = selector => getComputedStyle(document.querySelector(selector));
        return {
          width: css('.document-shell, .shell').maxWidth,
          headerRadius: css('.resume-nav, .topbar').borderRadius,
          documentRadius: css('.resume-shell, .content').borderRadius,
          pdfBackground: css('.download-button, .btn.primary').backgroundImage,
          gutter: css('html').scrollbarGutter,
          lineHeight: css('body').lineHeight,
          geometry: {
            header: (() => {
              const { x, y, width, height } = document.querySelector('.resume-nav').getBoundingClientRect();
              return { x, y, width, height };
            })(),
            content: (() => {
              const { x, y, width } = document.querySelector('main').getBoundingClientRect();
              return { x, y, width };
            })(),
            navigation: [...document.querySelectorAll('.document-nav a')].map(link => {
              const { x, y, width, height } = link.getBoundingClientRect();
              return { x, y, width, height };
            }),
          },
        };
      });
      assert.equal(presentation.width, '980px');
      assert.equal(presentation.headerRadius, '16px');
      assert.equal(presentation.documentRadius, '20px');
      assert(presentation.pdfBackground.includes('linear-gradient'));
      assert.equal(presentation.gutter, 'stable');
      documentGeometry ??= presentation.geometry;
      assert.deepEqual(presentation.geometry, documentGeometry, `Document layout jump: ${route} at ${width}`);
      assert.equal(presentation.lineHeight, '25.5px');
      const header = page.locator('.resume-nav, .topbar');
      assert.equal(await header.locator('img').count(), 0);
      assert.equal(await header.locator('.document-theme-toggle svg').count(), 1);
      assert.equal(await header.getByRole('link', { name: 'Back to site', exact: true }).getAttribute('href'), '/');
      assert.equal(await header.locator('button').evaluateAll(buttons => buttons.every(button => button.innerText === '')), true);
      await header.getByRole('button', { name: 'Switch to dark theme' }).click();
      assert.equal(await header.locator('.document-theme-toggle use').getAttribute('href'), '/resume-icons.svg#sun');
      await header.getByRole('button', { name: 'Switch to light theme' }).click();
      assert.equal(await header.locator('.document-theme-toggle use').getAttribute('href'), '/resume-icons.svg#moon');
      assert.equal(await navigation.locator('a').count(), 3);
      assert.equal(await navigation.locator('[aria-current="page"]').innerText(), activeLabel);
      assert.equal(await navigation.locator('a').evaluateAll(links => {
        const rects = links.map(link => link.getBoundingClientRect());
        return rects.every(rect => Math.abs(rect.top - rects[0].top) < 1);
      }), true, `Navigation buttons should share a row: ${route} at ${width}`);
      assert.equal(await navigation.locator('a').evaluateAll(links => links.every(link => {
        const style = getComputedStyle(link);
        return parseFloat(style.borderTopWidth) >= 1 && style.borderTopStyle === 'solid' && parseFloat(style.borderRadius) === 12;
      })), true, `Navigation button styling: ${route}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow: ${route} at ${width}`);
      await page.locator('.resume-nav, .topbar').screenshot({ path: path.join(screenshots, `navigation-${activeLabel.toLowerCase().replaceAll(' ', '-')}-${width}.png`), animations: 'disabled' });
      await page.screenshot({ path: path.join(screenshots, `document-${activeLabel.toLowerCase().replaceAll(' ', '-')}-${width}.png`), animations: 'disabled' });
      checks += 18;
    }
    await page.goto(base + '/resume');
    await page.locator('.document-nav').getByRole('link', { name: 'Cover Letter', exact: true }).click();
    await page.waitForURL('**/cover-letter.html');
    assert.equal(await page.locator('.download-button').getAttribute('href'), '/pdfs/johnathan-carroll-cover-letter.pdf');
    assert.equal(await page.locator('.cover-letter-body li').count(), 5);
    const letterText = await page.locator('.cover-letter-body').innerText();
    assert(letterText.includes('Infrastructure, Security & AI Platform Engineering Leader'));
    for (const expected of ['25 years', '$250,000 in annual operating savings', '50% reduction in physical footprint', 'vLLM, Ollama, NVIDIA GPUs', 'emerging enterprise AI program']) {
      assert(letterText.includes(expected), expected);
      checks++;
    }
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.evaluate(() => { window.print = () => { window.__coverLetterPrintCalls = (window.__coverLetterPrintCalls || 0) + 1; }; });
    for (const region of ['.resume-nav', '.resume-footer']) await page.locator(region).getByRole('button', { name: 'Print cover letter', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__coverLetterPrintCalls), 2);
    await page.goto(base + '/cover_letter.html');
    await page.waitForURL('**/cover-letter.html');
    await page.locator('.document-nav').getByRole('link', { name: 'Research', exact: true }).click();
    await page.waitForURL('**/resume-research');
    await page.locator('.document-nav').getByRole('link', { name: 'Resume', exact: true }).click();
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/resume');
    checks += 8;
    await page.locator('.resume-nav').getByRole('link', { name: 'Back to site', exact: true }).click();
    await page.waitForURL(url => url.pathname === '/');
    checks++;
    await context.close();
  }
  assert.equal(await readFile('cover-letter.html', 'utf8'), await readFile('public/cover-letter.html', 'utf8'));
  checks++;
  for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/resume', '/resume-research', '/cover-letter.html']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').evaluate(root => root.classList.contains('dark')), colorScheme === 'dark');
      checks++;
    }
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 710, height: 970 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/resume-research', { waitUntil: 'networkidle' });
  const researchScreenText = await page.locator('main').innerText();
  await page.emulateMedia({ media: 'print' });
  for (const selector of ['.resume-nav', '.resume-footer', '.back-link', '.project-nav']) {
    assert.equal(await page.locator(selector).isVisible(), false);
    checks++;
  }
  assert.equal(await page.locator('main h1').innerText(), 'Applied AI Research');
  assert.equal(await page.locator('.research-section').count(), researchIds.length);
  assert.equal(await page.locator('.research-status').count(), researchIds.length);
  assert.equal(await page.locator('.claim-boundary').count(), researchIds.length);
  for (const id of researchIds) {
    const section = page.locator(`#${id}`);
    assert.equal(await section.isVisible(), true, `Research section hidden in print: ${id}`);
    assert.equal(await section.locator('.claim-boundary').isVisible(), true, `Claim boundary hidden in print: ${id}`);
    checks += 2;
  }
  assert.equal(await page.locator('body').evaluate(body => getComputedStyle(body, '::before').display), 'none');
  for (const selector of ['.research-section', '.research-status', '.claim-boundary', '.benchmark-list article']) {
    assert.equal(await page.locator(selector).evaluateAll(elements => elements.every(element => getComputedStyle(element).display !== 'none')), true);
    checks++;
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const researchPdf = await page.pdf({ path: path.join(screenshots, 'research-print.pdf'), preferCSSPageSize: true, printBackground: true, tagged: true });
  const researchPdfPages = pdfPageCount(researchPdf, 'Research print PDF');
  assertPdfPages(researchPdfPages, 'research');
  await page.screenshot({ path: path.join(screenshots, 'research-print.png'), animations: 'disabled' });
  await page.emulateMedia({ media: 'screen' });
  assert.equal(await page.locator('main').innerText(), researchScreenText);
  checks += 7;
  await page.goto(base + '/cover-letter.html', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.resume-nav').isVisible(), false);
  assert.equal(await page.locator('.resume-footer').isVisible(), false);
  const coverLetterPdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true });
  const coverLetterPdfPages = pdfPageCount(coverLetterPdf, 'Cover letter print PDF');
  assertPdfPages(coverLetterPdfPages, 'cover');
  if (generateCoverPdf) await writeFile('public/pdfs/johnathan-carroll-cover-letter.pdf', coverLetterPdf);
  checks += 3;
  await page.goto(base + '/resume-print', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await assertSelectedProjects(page, selectedProjects, true);
  await assertResumeExperience(page, true);
  assert.equal(await page.locator('body').evaluate(body => getComputedStyle(body, '::before').display), 'none');
  assert.equal(await page.locator('html').evaluate(root => getComputedStyle(root).scrollbarGutter), 'auto');
  checks += 2;
  const heights = await page.locator('.print-page').evaluateAll(pages => pages.map(page => page.getBoundingClientRect().height));
  assert.equal(heights.length, 3, 'Expected three logical resume print pages');
  assert(heights.every(height => height > 0 && height < 970), `Print page overflow: ${heights.join(', ')}`);
  const printFrameScreenshots = [];
  for (let i = 0; i < heights.length; i++) {
    const screenshotPath = path.resolve(screenshots, `print-page-${i + 1}.png`);
    await page.locator('.print-page').nth(i).screenshot({ path: screenshotPath });
    printFrameScreenshots.push(screenshotPath);
  }
  const resumePrintPdf = path.resolve(screenshots, 'resume-print.pdf');
  const pdf = await page.pdf({ path: resumePrintPdf, preferCSSPageSize: true, printBackground: true, tagged: true });
  const pages = pdfPageCount(pdf, 'Resume print PDF');
  assert.equal(pages, 3, 'Expected exactly three generated resume PDF pages');
  checks += 3;
  if (generatePdf) {
    await page.pdf({ path: 'public/pdfs/johnathan-carroll-resume.pdf', preferCSSPageSize: true, printBackground: true, tagged: true });
    const saved = await readFile('public/pdfs/johnathan-carroll-resume.pdf');
    assert.equal(pdfPageCount(saved, 'Saved resume PDF'), pages);
  }
  assert.deepEqual(errors, []);
  phase = 'repository-privacy';
  const { indexedFiles, indexedTextFiles } = await scanRepositoryPrivacy(true);
  Object.assign(repositoryPrivacy, { indexedFiles, indexedTextFiles });
  const summary = { status: 'passed', verifiedAt: new Date().toISOString(), baseUrl: base, checks, repositoryPrivacy, pdfPages: pages, researchPdfPages, coverLetterPdfPages, downloadedPdfPages, printHeights: heights, researchProjects: researchIds, resumeProjects: selectedProjectIds, screenshots: path.resolve(screenshots), printFrameScreenshots, resumePrintPdf, verificationSummaryPath, pdfUpdated: generatePdf, coverLetterPdfUpdated: generateCoverPdf };
  await writeFile(verificationSummaryPath, JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary));
} catch (error) {
  await writeFile(verificationSummaryPath, JSON.stringify({ status: 'failed', phase, verifiedAt: new Date().toISOString(), baseUrl: base, checks, repositoryPrivacy, downloadedPdfPages, errors, failure: error.message, screenshots: path.resolve(screenshots) }, null, 2) + '\n');
  throw error;
} finally {
  if (browser) await browser.close();
}
