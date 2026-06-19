import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(15000);
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(2000);
await page.evaluate(() => {
  for (const h of document.querySelectorAll('access-widget-ui')) {
    const btn = h.shadowRoot?.querySelector('[data-testid="acsb-trigger"]');
    if (btn) { btn.click(); return; }
  }
});
await page.waitForTimeout(4000);

const data = await page.evaluate(() => {
  function findMain() {
    function walk(root) {
      for (const el of root.querySelectorAll ? [...root.querySelectorAll('*')] : []) {
        if (el.classList?.contains('widget-container__main')) return el;
        if (el.shadowRoot) { const f = walk(el.shadowRoot); if (f) return f; }
      }
      return null;
    }
    return walk(document);
  }
  const main = findMain();
  if (!main) return { err: 'no main' };
  const els = ['.main', '.header', '.hero', '.search', '.title', '.actions', '.main-options', '.action-section', '.brand', '.brand-footer', 'footer', '[class*="footer"]', '[class*="brand"]'];
  const out = {};
  for (const sel of els) {
    const el = main.querySelector(sel);
    if (el) {
      const cs = getComputedStyle(el);
      out[sel] = { class: el.className, bg: cs.backgroundColor, bgImage: cs.backgroundImage, color: cs.color, height: cs.height };
    }
  }
  // check pseudo on .main
  const mainEl = main.querySelector('.main');
  if (mainEl) {
    const before = getComputedStyle(mainEl, '::before');
    out['.main::before'] = { content: before.content, bg: before.backgroundColor, height: before.height };
  }
  const heroBefore = main.querySelector('.hero');
  if (heroBefore) {
    const before = getComputedStyle(heroBefore, '::before');
    out['.hero::before'] = { content: before.content, bg: before.backgroundColor };
  }
  // find brown elements
  const brown = [];
  function walkBrown(root) {
    for (const el of root.querySelectorAll ? [...root.querySelectorAll('*')] : []) {
      const cs = getComputedStyle(el);
      if (cs.backgroundColor.includes('80, 35, 20') || cs.backgroundColor.includes('80,35,20')) {
        brown.push({ class: el.className, bg: cs.backgroundColor, h: cs.height });
      }
      if (el.shadowRoot) walkBrown(el.shadowRoot);
    }
  }
  walkBrown(document);
  out.brownEls = brown.slice(0, 15);
  out.mainTail = main.innerHTML.slice(-3000);
  return out;
});

fs.writeFileSync('tools/acsw-brown.json', JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2).slice(0, 5000));
await browser.close();