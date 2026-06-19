import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:8080/franchising.html', { waitUntil: 'networkidle', timeout: 30000 });
await page.evaluate(() => {
  localStorage.removeItem('bk_cookiebot_consent');
  if (typeof BK_resetCookieConsent === 'function') BK_resetCookieConsent();
});
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const dialog = await page.$('#CybotCookiebotDialog:not(.cookie-banner-hidden)');
console.log('visible', !!dialog);
if (dialog) {
  const box = await dialog.boundingBox();
  console.log('box', box);
}
await page.screenshot({ path: 'tools/cookiebot-clone-v2.png' });
await browser.close();