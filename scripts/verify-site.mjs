import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4326';
const screenshots = process.env.SITE_SCREENSHOTS || '/tmp/techsoft-site-preview';
await mkdir(screenshots, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
let checks = 0;

async function geometry(page, label) {
  const result = await page.evaluate(() => {
    const visible = element => element.checkVisibility() && !element.closest('details:not([open]) :not(summary)');
    const content = [...document.querySelectorAll('.site-header a, .site-header button, .homepage h1, .homepage h2, .homepage h3, .homepage p, .homepage a, .site-content h1, .site-content h2, .site-content h3, .site-content p, .site-content a, .site-content button, .site-footer a')].filter(visible);
    return {
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      overflow: content.filter(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2).map(el => ({ text: el.textContent.trim(), width: el.clientWidth, scroll: el.scrollWidth })),
      outside: content.filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.textContent.trim()),
      overlaps: [...document.querySelectorAll('.header-row > *')].filter(visible).flatMap((a, index, all) => all.slice(index + 1).filter(b => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return ra.right > rb.left + 1 && rb.right > ra.left + 1 && ra.bottom > rb.top + 1 && rb.bottom > ra.top + 1;
      }).map(b => [a.className, b.className])),
    };
  });
  assert(result.scroll <= result.width, `Page overflow ${label}: ${JSON.stringify(result)}`);
  assert.deepEqual(result.overflow, [], `Text overflow ${label}`);
  assert.deepEqual(result.outside, [], `Outside viewport ${label}`);
  assert.deepEqual(result.overlaps, [], `Header overlap ${label}`);
  checks += 4;
}

try {
  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1024, 900], [1440, 1000], [1920, 1080]]) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const requests = new Set();
    page.on('request', request => requests.add(request.url()));
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main h1').innerText(), 'TechSoft\nSystems.');
    assert.equal(await page.locator('main h1').count(), 1);
    assert(await page.evaluate(() => document.fonts.check('16px "Inter Variable"')));
    assert.equal([...requests].some(url => /^https?:/.test(url) && new URL(url).origin !== new URL(base).origin), false, 'Unexpected external font or asset request');
    assert(await page.locator('#research').evaluate(el => el.getBoundingClientRect().top < innerHeight), `No next-section hint at ${width}`);
    checks += 6;

    for (const dark of [false, true]) {
      if (dark) await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
      const mode = dark ? 'dark' : 'light';
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('dark')), dark);
      assert.equal(await page.locator('.site-header img.brand-on-dark').isVisible(), dark);
      assert.equal(await page.locator('.site-header img.brand-on-light').isVisible(), !dark);
      await geometry(page, `${width}/${mode}`);
      await page.screenshot({ path: path.join(screenshots, `home-${width}-${mode}.png`), fullPage: true });
      await page.screenshot({ path: path.join(screenshots, `viewport-${width}-${mode}.png`) });
      for (const font of ['inherit', 'Arial, sans-serif']) {
        await page.evaluate(font => {
          document.documentElement.style.fontSize = '200%';
          if (font !== 'inherit') document.body.style.fontFamily = font;
        }, font);
        await geometry(page, `${width}/${mode}/200%/${font}`);
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; document.body.style.fontFamily = ''; });
      checks += 3;
    }

    const menu = page.locator(width <= 1088 ? '.mobile-navigation' : '.nav-more');
    const summary = menu.locator('summary');
    await summary.click();
    assert(await menu.evaluate(el => el.open));
    await geometry(page, `${width}/menu-open`);
    await page.screenshot({ path: path.join(screenshots, `navigation-${width}.png`) });
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate(el => el.open), false);
    assert(await summary.evaluate(el => el === document.activeElement));
    await summary.click();
    await page.locator('.site-header').click({ position: { x: 2, y: 2 } });
    assert.equal(await menu.evaluate(el => el.open), false);
    checks += 4;

    await page.reload({ waitUntil: 'networkidle' });
    assert(await page.locator('html').evaluate(el => el.classList.contains('dark')), 'Theme not persisted');
    await page.getByRole('button', { name: 'Switch to light theme', exact: true }).click();
    await page.getByRole('link', { name: 'Explore the research', exact: true }).click();
    await page.waitForURL('**/#research');
    const researchTop = await page.locator('#research').evaluate(el => el.getBoundingClientRect().top);
    assert(researchTop >= -1 && researchTop < height);
    checks += 2;
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  const links = await page.locator('a[href]').evaluateAll(anchors => [...new Set(anchors.map(a => a.getAttribute('href')).filter(href => href.startsWith('/')))]);
  for (const href of links) {
    const url = new URL(href, base);
    const response = await context.request.get(url.href);
    assert.equal(response.status(), 200, `Broken local link ${href}`);
    if (url.hash) {
      const found = await page.evaluate(({ html, id }) => Boolean(new DOMParser().parseFromString(html, 'text/html').getElementById(id)), { html: await response.text(), id: decodeURIComponent(url.hash.slice(1)) });
      assert(found, `Missing fragment ${href}`);
    }
    checks++;
  }
  const images = await page.locator('img').evaluateAll(elements => [...new Set(elements.map(image => image.getAttribute('src')))]);
  for (const src of images) {
    const response = await context.request.get(new URL(src, base).href);
    assert.equal(response.status(), 200, `Missing image ${src}`);
    assert.deepEqual(await response.body(), await readFile('public' + src));
    checks += 2;
  }
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/ai-lab', '/open-source', '/services', '/training', '/work', '/about', '/contact']) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('.site-header').count(), 1);
      assert.equal(await page.locator('.site-footer').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      await page.evaluate(() => document.fonts.ready);
      for (const scale of [1, 2]) {
        await page.evaluate(scale => { document.documentElement.style.fontSize = `${scale * 100}%`; }, scale);
        await geometry(page, `${route}/${width}/${scale * 100}%`);
      }
      checks += 4;
    }
  }
  await page.goto(base + '/about/');
  assert.equal(await page.locator('main h1').count(), 1);
  assert.equal(await page.locator('main h1').innerText(), 'About TechSoft Systems');
  assert.match(await page.locator('.about-introduction').innerText(), /Founded in 2012 by Johnathan W\. Carroll/);
  assert.match(await page.locator('#story').innerText(), /TBM Equities[\s\S]*24 hours/);
  assert.match(await page.locator('#story').innerText(), /independent applied AI R&D practice[\s\S]*full-time Tribal government role[\s\S]*January 2025/);
  assert.match(await page.locator('#founder').innerText(), /25\+ years[\s\S]*Pascua Yaqui Tribe Government[\s\S]*\$250,000[\s\S]*50%/);
  assert.match(await page.locator('.about-research-note').innerText(), /not presented as completed commercial AI deployments/);
  assert.equal((await page.locator('main').innerText()).includes('/home/userx'), false, 'Private source path exposed');
  checks += 8;
  const aboutLinks = await page.locator('main a[href]').evaluateAll(anchors => [...new Set(anchors.map(a => a.getAttribute('href')))]);
  for (const href of aboutLinks) {
    const url = new URL(href, base);
    const response = await context.request.get(url.href);
    assert.equal(response.status(), 200, `Broken About link ${href}`);
    if (url.hash) assert(await page.evaluate(({ html, id }) => Boolean(new DOMParser().parseFromString(html, 'text/html').getElementById(id)), { html: await response.text(), id: url.hash.slice(1) }), `Missing About fragment ${href}`);
    checks++;
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    for (const mode of ['light', 'dark']) {
      const dark = await page.locator('html').evaluate(el => el.classList.contains('dark'));
      if (dark !== (mode === 'dark')) await page.locator('#themeBtn').click();
      await page.evaluate(() => document.fonts.ready);
      await geometry(page, `about/${width}/${mode}`);
      await page.screenshot({ path: path.join(screenshots, `about-${width}-${mode}.png`), fullPage: true });
      await page.screenshot({ path: path.join(screenshots, `about-viewport-${width}-${mode}.png`) });
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await geometry(page, `about/${width}/${mode}/200%`);
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
    }
  }
  const manifest = await (await context.request.get(base + '/branding/site.webmanifest')).json();
  for (const icon of manifest.icons) {
    const response = await context.request.get(base + icon.src);
    assert.equal(response.status(), 200);
    assert.deepEqual(await response.body(), await readFile('public' + icon.src));
    checks += 2;
  }
  await context.close();

  const restricted = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' });
  await restricted.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } });
  });
  const fallback = await restricted.newPage();
  fallback.on('pageerror', error => errors.push(error.message));
  await fallback.goto(base);
  await fallback.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
  assert(await fallback.locator('html').evaluate(el => el.classList.contains('dark')));
  assert.equal(await fallback.locator('.home-button').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  await restricted.close();
  checks += 2;

  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base);
  await staticPage.locator('.mobile-navigation summary').click();
  assert(await staticPage.getByRole('navigation', { name: 'Mobile navigation' }).isVisible());
  await noScript.close();
  checks++;

  assert.deepEqual(errors, [], 'Browser script errors');
  console.log(`PASS: ${checks} site checks. Screenshots: ${screenshots}`);
} finally {
  await browser.close();
}
