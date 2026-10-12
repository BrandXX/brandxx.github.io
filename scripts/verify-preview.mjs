import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4326';
const original = process.env.ORIGINAL_BASE_URL || 'http://127.0.0.1:4327';
const production = process.env.SITE_MODE === 'production';
const screenshots = process.env.PREVIEW_SCREENSHOTS || '/tmp/techsoft-full-preview';
const manifest = JSON.parse(await readFile('.staging/latest.json', 'utf8'));
assert.equal(Object.keys(manifest.originalBuildHashes).some(file => file.startsWith('preview-assets/') || file.startsWith('.staging/')), false, 'Preview material leaked into the normal build');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let checks = 0;
await mkdir(screenshots, { recursive: true });
for (const [file, expected] of Object.entries(manifest.protectedSourceHashes)) {
  assert.equal(sha(await readFile(file)), expected, `Canonical source changed: ${file}`);
  assert.equal(sha(await readFile(path.join(manifest.archive, 'source', file))), expected, `Archived source changed: ${file}`);
  checks += 2;
}
for (const [file, expected] of Object.entries(manifest.originalBuildHashes)) {
  assert.equal(sha(await readFile(path.join(manifest.sourceBuildDirectory, file))), expected, `Source build changed: ${file}`);
  assert.equal(sha(await readFile(path.join(manifest.archive, 'site', file))), expected, `Archived build changed: ${file}`);
  checks += 2;
}

const browser = await chromium.launch({ headless: true });
const errors = [];
const requests = new Set();
const geometry = async (page, label) => {
  const result = await page.evaluate(() => {
    const visible = element => element.checkVisibility() && !element.closest('details:not([open]) :not(summary)');
    const elements = [...document.querySelectorAll('.preview-document h1, .preview-document h2, .preview-document h3, .preview-document p, .preview-document li, .preview-document dd, .preview-tools-row a, .preview-tools-row button')].filter(visible);
    const overlap = selector => [...document.querySelectorAll(selector)].filter(visible).flatMap((a, index, all) => all.slice(index + 1).filter(b => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return ra.right > rb.left + 1 && rb.right > ra.left + 1 && ra.bottom > rb.top + 1 && rb.bottom > ra.top + 1;
    }).map(b => [a.className, b.className]));
    return {
      width: innerWidth, scroll: document.documentElement.scrollWidth,
      headerWidth: document.querySelector('.site-header').getBoundingClientRect().width,
      layoutWidth: document.documentElement.getBoundingClientRect().width,
      overflow: elements.filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 2).map(el => el.textContent.slice(0, 80)),
      outside: elements.filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.textContent.slice(0, 80)),
      overlap: [...overlap('.header-row > *'), ...overlap('.preview-tools-row > *'), ...overlap('.preview-document-tools nav > *')],
    };
  });
  assert(result.scroll <= result.width, `Horizontal overflow ${label}: ${JSON.stringify(result)}`);
  assert.deepEqual(result.overflow, [], `Text overflow ${label}`);
  assert.deepEqual(result.outside, [], `Outside viewport ${label}`);
  assert.deepEqual(result.overlap, [], `Overlapping controls ${label}`);
  assert(Math.abs(result.headerWidth - result.layoutWidth) <= 1, `Header width changed ${label}`);
  checks += 5;
};

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.add(request.url()));
  const localLinks = new Set();
  for (const doc of manifest.documents) {
    const response = await page.goto(base + doc.route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    const source = await (await context.request.get(original + doc.route)).text();
    const parity = await page.evaluate(({ source, output, kind }) => {
      const old = new DOMParser().parseFromString(source, 'text/html');
      const current = new DOMParser().parseFromString(output, 'text/html');
      const content = old.querySelector(kind === 'essay' ? '.content' : 'main');
      return { expected: content.innerHTML, actual: current.querySelector('main').innerHTML };
    }, { source, output: await response.text(), kind: doc.kind });
    assert.equal(parity.actual, parity.expected, `Article markup changed: ${doc.route}`);
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(await page.locator('.site-header').count(), 1);
    assert.equal(await page.locator('.site-footer').count(), 1);
    const robots = await page.locator('meta[name=robots]').evaluateAll(nodes => nodes.map(node => node.content));
    assert.deepEqual(robots, production ? (doc.kind === 'resume-print' ? ['noindex, follow'] : []) : ['noindex, nofollow, noarchive']);
    assert.deepEqual(await page.locator('[id]').evaluateAll(nodes => nodes.map(n => n.id).filter((id, i, all) => all.indexOf(id) !== i)), []);
    assert(await page.evaluate(() => document.fonts.check('16px "Inter Variable"')));
    checks += 8;

    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, theme);
        await geometry(page, `${doc.kind}/${width}/${theme}`);
        if ([390, 1440].includes(width)) {
          const name = doc.route.split('/').filter(Boolean).join('-').replace('.html', '');
          await page.screenshot({ path: path.join(screenshots, `${name}-${width}-${theme}.png`) });
          if (width === 1440) await page.screenshot({ path: path.join(screenshots, `${name}-full-${theme}.png`), fullPage: true });
        }
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        await geometry(page, `${doc.kind}/${width}/${theme}/200%`);
        await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      }
    }
    const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(n => n.href).filter(href => new URL(href).origin === location.origin));
    links.forEach(link => localLinks.add(link));
    if (doc.pdf) {
      const download = await context.request.get(base + `/pdfs/johnathan-carroll-${doc.pdf}.pdf`);
      assert.equal(download.status(), 200);
      assert.deepEqual(await download.body(), await readFile(`public/pdfs/johnathan-carroll-${doc.pdf}.pdf`));
      assert.equal(await page.locator('[data-preview-print]').count(), 2);
      checks += 3;
      for (const index of [0, 1]) {
        await page.goto(base + doc.route);
        const beforePrint = await page.locator('main').innerHTML();
        const beforeURL = page.url();
        await page.evaluate(() => { window.printCalls = 0; window.print = () => window.printCalls++; });
        const button = page.locator('[data-preview-print]').nth(index);
        await button.click();
        assert.equal(await page.evaluate(() => window.printCalls), 1, `First click must print ${doc.route}`);
        assert.equal(page.url(), beforeURL, 'Print unexpectedly navigated');
        assert.equal(await page.locator('main').innerHTML(), beforePrint, 'Print changed document content');
        await button.press('Enter');
        assert.equal(await page.evaluate(() => window.printCalls), 2, 'Keyboard print must work after returning from the dialog');
        assert.equal(page.url(), beforeURL, 'Keyboard print unexpectedly navigated');
        assert.equal(await page.locator('main').innerHTML(), beforePrint, 'Keyboard print changed document content');
        checks += 6;
      }
      await page.goto(base + doc.route);
      await page.emulateMedia({ media: 'print' });
      assert.equal(await page.locator('.site-header').isVisible(), false);
      assert.equal(await page.locator('.preview-document-tools').isVisible(), false);
      assert.equal(await page.locator('.preview-document-end').isVisible(), false);
      assert.equal(await page.locator('.site-footer').isVisible(), false);
      assert(await page.locator('main').isVisible());
      await page.pdf({ path: path.join(screenshots, `${doc.kind}.pdf`), preferCSSPageSize: true });
      await page.emulateMedia({ media: 'screen' });
      checks += 5;
    }
  }
  for (const link of localLinks) {
    const response = await context.request.get(link);
    assert.equal(response.status(), 200, `Broken link: ${link}`);
    const url = new URL(link);
    if (url.hash) {
      assert(await page.evaluate(({ html, id }) => Boolean(new DOMParser().parseFromString(html, 'text/html').getElementById(id)),
        { html: await response.text(), id: decodeURIComponent(url.hash.slice(1)) }), `Broken anchor: ${link}`);
    }
    checks++;
  }
  await page.goto(base + '/resume/');
  await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
  for (const route of ['/resume-research/', '/cover-letter.html', '/defiantly_not_regex/']) {
    await page.goto(base + route);
    assert(await page.locator('html').evaluate(el => el.classList.contains('dark')));
    checks++;
  }
  await page.locator('#imageStack').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#imageStack').getAttribute('aria-pressed'), 'true');
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#imageStack').getAttribute('aria-pressed'), 'false');
  await page.mouse.move(0, 0);
  await page.locator('#imageStack').evaluate(el => el.blur());
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.blurry-image').evaluate(el => getComputedStyle(el).opacity), '1');
  await page.locator('#imageStack').hover();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.blurry-image').evaluate(el => getComputedStyle(el).opacity), '0');
  assert(await page.locator('.main-image').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)));
  checks += 5;
  for (const image of ['defiantly_not_regex_b64_ocrsafe_3000.png', 'defiantly_not_regex_blurry.png']) {
    const response = await context.request.get(base + `/defiantly_not_regex/${image}`);
    assert.deepEqual(await response.body(), await readFile(`public/defiantly_not_regex/${image}`));
    checks++;
  }
  for (const route of ['/resume.html', '/cover_letter.html']) {
    await page.goto(base + route);
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === (route.includes('resume') ? '/resume' : '/cover-letter.html'));
    checks++;
  }
  assert.equal([...requests].some(url => /^https?:/.test(url) && new URL(url).origin !== new URL(base).origin), false, 'External asset request');
  await context.close();

  const restricted = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  await restricted.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  const fallback = await restricted.newPage();
  fallback.on('pageerror', error => errors.push(error.message));
  await fallback.goto(base + '/resume-research/');
  await fallback.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
  assert(await fallback.locator('html').evaluate(el => el.classList.contains('dark')));
  await fallback.locator('.mobile-navigation summary').click();
  assert(await fallback.getByRole('navigation', { name: 'Mobile navigation', exact: true }).isVisible());
  await fallback.keyboard.press('Escape');
  assert.equal(await fallback.locator('.mobile-navigation').evaluate(el => el.open), false);
  await restricted.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base + '/cover-letter.html');
  await staticPage.locator('.mobile-navigation summary').click();
  assert(await staticPage.getByRole('navigation', { name: 'Mobile navigation', exact: true }).isVisible());
  assert(await staticPage.getByRole('navigation', { name: 'Documents', exact: true }).isVisible());
  await noScript.close();
  checks += 6;
  assert.deepEqual(errors, [], 'Browser script errors');
  console.log(`PASS: ${checks} preview checks. Source/content parity, print, PDF bytes, links, themes, rollover, responsive and 200% layouts. Screenshots: ${screenshots}`);
} finally { await browser.close(); }
