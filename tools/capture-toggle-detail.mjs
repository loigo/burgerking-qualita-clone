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
await page.waitForTimeout(3000);
await page.evaluate(() => {
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
  findMain()?.querySelector('.profile')?.click();
});
await page.waitForTimeout(500);

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
  const p = main?.querySelector('.profile[aria-checked="true"]');
  if (!p) return { found: false };
  const toggle = p.querySelector('.toggle');
  const si = p.querySelector('.toggle__option--on');
  const no = p.querySelector('.toggle__option:not(.toggle__option--on)');
  function full(el, pseudo) {
    const cs = getComputedStyle(el, pseudo || null);
    const r = el.getBoundingClientRect();
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      width: Math.round(r.width),
      height: Math.round(r.height),
      left: Math.round(r.left),
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      content: pseudo ? cs.content : undefined,
    };
  }
  return {
    found: true,
    profile: full(p),
    toggle: full(toggle),
    toggleBefore: full(toggle, '::before'),
    toggleAfter: full(toggle, '::after'),
    si: full(si),
    siBefore: full(si, '::before'),
    no: full(no),
    toggleClass: toggle.className,
    toggleHtml: toggle.outerHTML.slice(0, 500),
  };
});

console.log(JSON.stringify(data, null, 2));
fs.writeFileSync('tools/acsw-toggle-detail.json', JSON.stringify(data, null, 2));
await browser.close();