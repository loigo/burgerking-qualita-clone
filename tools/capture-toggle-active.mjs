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
  function s(el) {
    const cs = getComputedStyle(el);
    return { text: el.textContent?.trim(), bg: cs.backgroundColor, color: cs.color, fontWeight: cs.fontWeight, boxShadow: cs.boxShadow, borderRadius: cs.borderRadius };
  }
  return {
    found: true,
    profileBg: getComputedStyle(p).backgroundColor,
    no: s(p.querySelector('.toggle__option:not(.toggle__option--on)')),
    si: s(p.querySelector('.toggle__option--on')),
    toggle: s(p.querySelector('.toggle')),
  };
});

console.log(JSON.stringify(data, null, 2));
fs.writeFileSync('tools/acsw-toggle-active.json', JSON.stringify(data, null, 2));
await browser.close();