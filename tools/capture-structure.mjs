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

const html = await page.evaluate(() => {
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
  return main ? main.innerHTML.slice(0, 12000) : 'none';
});

fs.writeFileSync('tools/acsw-main-structure.html', html);
console.log('len', html.length, html.slice(0, 3000));
await browser.close();