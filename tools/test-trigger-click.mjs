import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:8080/franchising.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const before = await page.evaluate(() => {
  const t = document.getElementById('acsw-trigger');
  const c = document.getElementById('CybotCookiebotDialog');
  if (!t || !c) return { missing: true };
  const tr = t.getBoundingClientRect();
  const els = document.elementsFromPoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
  return {
    triggerZ: getComputedStyle(t).zIndex,
    cookieZ: getComputedStyle(c).zIndex,
    topElement: els[0]?.id || els[0]?.className?.slice?.(0, 60),
    stack: els.slice(0, 6).map((el) => el.id || el.className?.slice?.(0, 50)),
  };
});

let clickOk = false;
try {
  await page.click('#acsw-trigger', { timeout: 5000 });
  clickOk = true;
} catch (e) {
  clickOk = false;
}

console.log(JSON.stringify({ before, clickOk }, null, 2));
await browser.close();