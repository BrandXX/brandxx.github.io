import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4326';
const screenshots = process.env.LAB_SCREENSHOTS || '/tmp/techsoft-ai-lab-staging';
const production = process.env.SITE_MODE === 'production';
const archive = JSON.parse(await readFile('.staging/ai-lab-concept/latest.json', 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let checks = 0;
await mkdir(screenshots, { recursive: true });
assert.equal(sha(await readFile(archive.archive + '/TechSoft-AI-Lab-Concept-v1.zip')), archive.zipSha256);
assert.equal(sha(await readFile(archive.archive + '/ai-lab-before.astro')), archive.previousPageSha256);
checks += 2;
// Approved research and TechSoft resume updates retain originals and protect unrelated content.
const documentUpdates = new Set(['src/data/publicResume.ts', 'public/pdfs/README.md', 'public/pdfs/johnathan-carroll-applied-ai-research.pdf', 'public/pdfs/johnathan-carroll-resume.pdf']);
for (const [file, expected] of Object.entries(archive.previousPreviewManifest.protectedSourceHashes)) {
  assert.equal(sha(await readFile(path.join(archive.previousPreviewManifest.archive, 'source', file))), expected, 'Archived source changed: ' + file);
  if (!documentUpdates.has(file)) assert.equal(sha(await readFile(file)), expected, 'Canonical source changed: ' + file);
  checks++;
}
const loadData = async file => import('data:text/javascript;base64,' + (await readFile(file)).toString('base64'));
const previous = await loadData(path.join(archive.previousPreviewManifest.archive, 'source/src/data/publicResume.ts'));
const current = await loadData('src/data/publicResume.ts');
for (const key of Object.keys(previous).filter(key => !['projects', 'researchProfile', 'inferenceEngineering', 'techsoftBullets', 'techsoftPrintBullets'].includes(key))) {
  assert.deepEqual(current[key], previous[key], 'Unrelated resume data changed: ' + key);
  checks++;
}
assert.equal(sha(await readFile(path.join(archive.archive, 'site-before/ai-lab/index.html'))), archive.previousBuiltPageSha256);
checks++;

const browser = await chromium.launch({ headless: true });
const errors = [];
const externalRequests = new Set();
async function geometry(page, label) {
  const result = await page.evaluate(() => {
    const visible = el => el.checkVisibility() && !el.closest('details:not([open]) :not(summary)');
    const elements = [...document.querySelectorAll('.lab-page h1, .lab-page h2, .lab-page h3, .lab-page h4, .lab-page p, .lab-page li, .lab-page dt, .lab-page dd, .lab-page button, .lab-page a, .lab-page figcaption, .lab-map-node span, .lab-map-node strong')].filter(visible);
    const overlaps = selector => [...document.querySelectorAll(selector)].filter(visible).flatMap((a, i, all) => all.slice(i + 1).filter(b => {
      const x = a.getBoundingClientRect(), y = b.getBoundingClientRect();
      return x.left < y.right - 1 && y.left < x.right - 1 && x.top < y.bottom - 1 && y.top < x.bottom - 1;
    }).map(b => [a.className, b.className]));
    return {
      width: innerWidth, scroll: document.documentElement.scrollWidth,
      // Node connectors intentionally cross borders; check their text children instead.
      overflow: elements.filter(el => !el.classList.contains('lab-map-node') && el.clientWidth && el.scrollWidth > el.clientWidth + 2).map(el => el.textContent.trim().slice(0, 100)),
      outside: elements.filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.textContent.trim().slice(0, 100)),
      overlaps: [...overlaps('.lab-hero-layout > *'), ...overlaps('.lab-map-flow > *'), ...overlaps('.lab-experiments > *'), ...overlaps('.lab-card-top > *'), ...overlaps('.lab-card-bottom > *'), ...overlaps('.lab-filter-row > *'), ...overlaps('.lab-filters > *')],
    };
  });
  assert(result.scroll <= result.width, 'Horizontal overflow ' + label + ': ' + JSON.stringify(result));
  assert.deepEqual(result.overflow, [], 'Text overflow ' + label);
  assert.deepEqual(result.outside, [], 'Outside viewport ' + label);
  assert.deepEqual(result.overlaps, [], 'Overlapping content ' + label);
  checks += 4;
}

try {
  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1024, 900], [1440, 1000], [1920, 1080]]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(base).origin) externalRequests.add(request.url()); });
    const response = await page.goto(base + '/ai-lab/', { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('main h1').innerText(), 'TechSoft\nAI Lab.');
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('.site-header').count(), 1);
    assert.equal(await page.locator('.lab-experiment').count(), 5);
    assert.equal(await page.locator('.lab-metric').count(), 4);
    if (production) assert.equal(await page.locator('meta[name=robots]').count(), 0);
    else assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex, nofollow, noarchive');
    assert.equal(await page.locator('.desktop-navigation a[href="/ai-lab"]').getAttribute('aria-current'), 'page');
    assert(await page.locator('.site-header img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)));
    assert(await page.evaluate(() => document.fonts.check('16px "Inter Variable"')));
    assert.deepEqual(await page.locator('[id]').evaluateAll(nodes => nodes.map(n => n.id).filter((id, i, all) => all.indexOf(id) !== i)), []);
    const copy = await page.locator('main').innerText();
    for (const phrase of ['Build history, not live capacity', 'basic testing and selected embedding workloads', 'broader intent-layer architecture', 'advisory plugin', 'do not mutate live memory', 'prepared 100 GiB file', 'RAID0 has no redundancy', 'Research briefs from the published record']) assert(copy.includes(phrase), phrase);
    checks += 19;
    assert.equal(await page.locator('.lab-map-node').count(), 6);
    assert.equal(await page.locator('#lab-map-caption').innerText(), 'Lab / Systems map\nConceptual model');
    assert((await page.locator('#lab-map-note').innerText()).includes('not a deployed system blueprint'));
    checks += 3;

    for (const theme of ['light', 'dark']) {
      if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
      await page.mouse.move(0, 0);
      await page.locator('#themeBtn').evaluate(el => el.blur());
      // Capture settled theme colors, not an intermediate button transition.
      await page.waitForTimeout(200);
      await geometry(page, width + '/' + theme);
      await page.screenshot({ path: path.join(screenshots, 'lab-' + width + '-' + theme + '.png') });
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: path.join(screenshots, 'lab-full-' + width + '-' + theme + '.png'), fullPage: true });
        await page.locator('.lab-experiments').screenshot({ path: path.join(screenshots, 'experiments-' + width + '-' + theme + '.png') });
        await page.locator('.lab-system-map').screenshot({ path: path.join(screenshots, 'systems-map-' + width + '-' + theme + '.png') });
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await geometry(page, width + '/' + theme + '/200%');
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    }
    for (const [category, expected] of [['inference', 4], ['agents', 2], ['memory', 2], ['operations', 3], ['all', 11]]) {
      const button = page.locator('[data-lab-filter="' + category + '"]');
      await button.click();
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[data-lab-filter][aria-pressed=true]').count(), 1);
      assert.equal(await page.locator('#lab-notes li:visible').count(), expected);
      assert.equal(await page.locator('.lab-filter-count').innerText(), expected + ' research ' + (expected === 1 ? 'brief' : 'briefs'));
      await geometry(page, width + '/filter/' + category);
      checks += 4;
    }
    await page.locator('[data-lab-filter=memory]').press('Space');
    assert.equal(await page.locator('#lab-notes li:visible').count(), 2);
    await page.locator('[data-lab-filter=all]').press('Enter');
    assert.equal(await page.locator('#lab-notes li:visible').count(), 11);
    checks += 2;

    if (width === 1440) {
      const links = await page.locator('a[href]').evaluateAll(nodes => [...new Set(nodes.map(n => n.href).filter(href => new URL(href).origin === location.origin))]);
      for (const link of links) {
        const r = await context.request.get(link);
        assert.equal(r.status(), 200, link);
        const url = new URL(link);
        if (url.hash) assert(await page.evaluate(({ html, id }) => Boolean(new DOMParser().parseFromString(html, 'text/html').getElementById(id)), { html: await r.text(), id: decodeURIComponent(url.hash.slice(1)) }), 'Missing anchor ' + link);
        checks++;
      }
      await page.locator('.lab-experiment h3 a[href$="#piper"]').click();
      await page.waitForURL(url => url.hash === '#piper');
      assert(await page.locator('#piper').isVisible());
      assert(await page.locator('html').evaluate(el => el.classList.contains('dark')));
      checks += 2;
    }
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base + '/ai-lab/');
  assert.equal(await page.locator('#lab-notes li:visible').count(), 11);
  assert.equal(await page.locator('.lab-filters').isVisible(), false);
  await page.locator('.mobile-navigation summary').click();
  assert(await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).isVisible());
  await context.close();
  const restricted = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await restricted.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  const fallback = await restricted.newPage();
  fallback.on('pageerror', error => errors.push(error.message));
  await fallback.goto(base + '/ai-lab/');
  await fallback.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
  assert(await fallback.locator('html').evaluate(el => el.classList.contains('dark')));
  await fallback.locator('[data-lab-filter=inference]').click();
  assert.equal(await fallback.locator('#lab-notes li:visible').count(), 4);
  await restricted.close();
  assert.deepEqual(errors, []);
  assert.deepEqual([...externalRequests], []);
  checks += 7;
  console.log('PASS: ' + checks + ' AI Lab checks; responsive themes, filters, keyboard/no-JS access, research links, archived sources, and canonical source preservation. Screenshots: ' + screenshots);
} finally { await browser.close(); }
