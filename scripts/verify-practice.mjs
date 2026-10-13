import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';
import { chromium } from 'playwright';

const base = process.env.SITE_BASE_URL || 'http://127.0.0.1:4326';
const screenshots = process.env.PRACTICE_SCREENSHOTS || '/tmp/techsoft-practice-preview';
const { archive } = JSON.parse(await readFile('.staging/ai-lab-concept/latest.json', 'utf8'));
const routes = ['/work/', '/services/', '/training/', '/work/on-prem-llm-platform/', '/work/downtime-reduction-program/', '/work/zero-loss-virtualization-migration/'];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const normalize = text => text.replace(/\s+/g, ' ').replace(/←\s*/g, '').trim();
function content(node) {
  if (['svg', 'script', 'style'].includes(node.tagName)) return '';
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(content).join(' ');
}
function record(html) {
  const nodes = walk(parse(html));
  const main = nodes.find(node => node.tagName === 'main');
  return {
    text: normalize(content(main)),
    links: walk(main).filter(node => node.tagName === 'a').map(node => attr(node, 'href')),
    title: normalize(content(nodes.find(node => node.tagName === 'title'))),
    description: attr(nodes.find(node => node.tagName === 'meta' && attr(node, 'name') === 'description'), 'content'),
  };
}

await mkdir(screenshots, { recursive: true });
let checks = 0;
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ colorScheme: 'light' });
  page.on('pageerror', error => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    const before = record(await readFile(path.join(archive, 'site-before', route, 'index.html'), 'utf8'));
    assert.deepEqual(record(await response.text()), before, 'Style-only copy/link/metadata parity: ' + route);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('.site-header').count(), 1);
    assert.equal(await page.locator('.site-footer').count(), 1);
    assert.equal(await page.locator('.practice-card .practice-card').count(), 0);
    checks += 6;
    for (const href of before.links.filter(href => href.startsWith('/'))) {
      assert.equal((await page.request.get(base + href)).status(), 200, 'Broken link: ' + href);
      checks++;
    }
    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').evaluate(el => el.classList.contains('dark')) !== (theme === 'dark')) await page.locator('#themeBtn').click();
        await page.mouse.move(0, 0);
        await page.locator('#themeBtn').evaluate(el => el.blur());
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(200);
        for (const scale of [1, 2]) {
          await page.evaluate(scale => { document.documentElement.style.fontSize = scale * 100 + '%'; }, scale);
          const geometry = await page.evaluate(() => {
            const visible = el => el.checkVisibility();
            const elements = [...document.querySelectorAll('.practice-page h1, .practice-page h2, .practice-page h3, .practice-page p, .practice-page li, .practice-page a, .practice-tools span')].filter(visible);
            const overlap = selector => [...document.querySelectorAll(selector)].filter(visible).flatMap((a, i, all) => all.slice(i + 1).filter(b => {
              const x = a.getBoundingClientRect(), y = b.getBoundingClientRect();
              return x.left < y.right - 1 && y.left < x.right - 1 && x.top < y.bottom - 1 && y.top < x.bottom - 1;
            }).map(b => [a.className, b.className]));
            return {
              width: innerWidth, scroll: document.documentElement.scrollWidth,
              overflow: elements.filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 2).map(el => el.textContent),
              outside: elements.filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.textContent),
              overlap: [...overlap('.practice-grid > *'), ...overlap('.practice-outcomes > *'), ...overlap('.practice-actions > *')],
            };
          });
          const label = route + '/' + width + '/' + theme + '/' + scale;
          assert(geometry.scroll <= geometry.width, 'Horizontal overflow ' + label);
          assert.deepEqual(geometry.overflow, [], 'Text overflow ' + label);
          assert.deepEqual(geometry.outside, [], 'Outside viewport ' + label);
          assert.deepEqual(geometry.overlap, [], 'Overlap ' + label);
          checks += 4;
        }
        await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
        if ([390, 1440].includes(width)) {
          const name = route.slice(1, -1).replaceAll('/', '-');
          await page.screenshot({ path: path.join(screenshots, name + '-' + width + '-' + theme + '.png'), fullPage: true });
        }
      }
    }
  }
  await page.goto(base + '/work/');
  await page.locator('.practice-card').first().click();
  await page.waitForURL(/\/work\/on-prem-llm-platform\/?$/);
  await page.getByRole('link', { name: 'Back to work', exact: true }).click();
  await page.waitForURL(/\/work\/?$/);
  assert.deepEqual(errors, []);
  checks += 3;
  console.log(`PASS: ${checks} practice-page checks. Copy, links, metadata, themes, responsive and 200% layouts verified. Screenshots: ${screenshots}`);
} finally { await browser.close(); }
