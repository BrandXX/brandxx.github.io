import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.RESUME_BASE_URL || 'http://127.0.0.1:4322';
const screenshots = process.env.RESUME_SCREENSHOTS || '/tmp/resume-preview';
const generatePdf = process.argv.includes('--pdf');
await mkdir(screenshots, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
let checks = 0;
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/resume', '/resume-research', '/resume-print']) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('main h1').count(), 1);
      await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow: ${route} at ${width}`);
      assert.equal(await page.locator('.site-brand img').evaluate(image => image.complete && image.naturalWidth > 0), true);
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
      checks += 7;
    }
    await page.goto(base + '/resume');
    const text = await page.locator('main').innerText();
    for (const expected of ['Aug 2023 - Present', 'Jan 2021 - Aug 2023', 'Jan 2019 - Jan 2021', '$250,000', '25+ years', 'advisory', 'Tier 2/3 Windows']) assert(text.includes(expected), expected);
    for (const excluded of ['Guadalupe', '36 TB', '400 switching', 'known threat group', '10x', 'two network-wide', '114 successful live']) assert(!text.includes(excluded), excluded);
    await page.locator('a[href="/resume-research#piper"]').click();
    await page.waitForURL('**/resume-research#piper');
    await page.goto(base + '/resume');
    await page.getByRole('button', { name: 'Print resume', exact: true }).click();
    await page.waitForURL('**/resume-print');
    await page.goto(base + '/resume.html', { waitUntil: 'networkidle' });
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/resume');
    const pdfResponse = await context.request.get(base + '/pdfs/johnathan-carroll-resume.pdf');
    assert.equal(pdfResponse.status(), 200);
    assert((await pdfResponse.body()).subarray(0, 5).toString() === '%PDF-');
    assert.equal((await context.request.get(base + '/cover-letter.html')).status(), 200);
    assert.equal((await context.request.get(base + '/resume-icons.svg')).status(), 200);
    checks += 21;
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
        };
      });
      assert.equal(presentation.width, '980px');
      assert.equal(presentation.headerRadius, '16px');
      assert.equal(presentation.documentRadius, '20px');
      assert(presentation.pdfBackground.includes('linear-gradient'));
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
      checks += 9;
    }
    await page.goto(base + '/resume');
    await page.locator('.document-nav').getByRole('link', { name: 'Cover Letter', exact: true }).click();
    await page.waitForURL('**/cover-letter.html');
    await page.locator('.document-nav').getByRole('link', { name: 'Research', exact: true }).click();
    await page.waitForURL('**/resume-research');
    await page.locator('.document-nav').getByRole('link', { name: 'Resume', exact: true }).click();
    await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/resume');
    checks += 3;
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 710, height: 970 } });
  await page.goto(base + '/resume-print', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  const heights = await page.locator('.print-page').evaluateAll(pages => pages.map(page => page.getBoundingClientRect().height));
  assert.equal(heights.length, 2);
  assert(heights.every(height => height <= 970), `Print page overflow: ${heights.join(', ')}`);
  for (let i = 0; i < 2; i++) await page.locator('.print-page').nth(i).screenshot({ path: path.join(screenshots, `print-page-${i + 1}.png`) });
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true });
  const pages = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length;
  assert.equal(pages, 2, `Expected a two-page PDF, got ${pages}`);
  if (generatePdf) {
    await page.pdf({ path: 'public/pdfs/johnathan-carroll-resume.pdf', preferCSSPageSize: true, printBackground: true, tagged: true });
    const saved = await readFile('public/pdfs/johnathan-carroll-resume.pdf');
    assert.equal([...saved.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length, 2);
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ checks, pdfPages: pages, printHeights: heights, screenshots, pdfUpdated: generatePdf }));
} finally {
  await browser.close();
}
