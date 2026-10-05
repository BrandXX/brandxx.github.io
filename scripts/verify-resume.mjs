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
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/resume', '/resume-research', '/resume-print', '/cover-letter.html']) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('main h1').count(), 1);
      await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow: ${route} at ${width}`);
      assert.equal(await page.locator('.resume-nav img').count(), 0);
      const printName = route === '/cover-letter.html' ? 'Print cover letter' : 'Print resume';
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
    await page.locator('a[href="/resume-research#piper"]').click();
    await page.waitForURL('**/resume-research#piper');
    for (const route of ['/resume', '/resume-research']) {
      for (const region of ['.resume-nav', '.resume-footer']) {
        await page.goto(base + route);
        await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
        await page.locator(region).getByRole('button', { name: 'Print resume', exact: true }).click();
        await page.waitForURL('**/resume-print');
        assert.equal(await page.locator('.print-page').count(), 2);
        checks++;
      }
    }
    await page.evaluate(() => { window.print = () => { window.__resumePrintCalls = (window.__resumePrintCalls || 0) + 1; }; });
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    for (const region of ['.resume-nav', '.resume-footer']) await page.locator(region).getByRole('button', { name: 'Print resume', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__resumePrintCalls), 2);
    checks++;
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
    assert.equal(await page.locator('.cover-letter-body li').count(), 4);
    assert((await page.locator('.cover-letter-body').innerText()).includes('IT Infrastructure & AI Systems Leader'));
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
    for (const route of ['/resume', '/resume-research', '/cover-letter.html']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').evaluate(root => root.classList.contains('dark')), colorScheme === 'dark');
      checks++;
    }
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 710, height: 970 } });
  await page.goto(base + '/cover-letter.html', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.resume-nav').isVisible(), false);
  assert.equal(await page.locator('.resume-footer').isVisible(), false);
  const coverLetterPdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true });
  assert.equal([...coverLetterPdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length, 1);
  checks += 3;
  await page.goto(base + '/resume-print', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('body').evaluate(body => getComputedStyle(body, '::before').display), 'none');
  assert.equal(await page.locator('html').evaluate(root => getComputedStyle(root).scrollbarGutter), 'auto');
  checks += 2;
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
