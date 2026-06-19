import { chromium } from 'playwright';

const pages = [
  'http://127.0.0.1:8080/franchising.html',
  'http://127.0.0.1:8080/accessibilita.html',
  'http://127.0.0.1:8080/franchising/franchising-ristorazione/index.html',
];

const browser = await chromium.launch({ headless: true });
for (const url of pages) {
  const page = await browser.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => failed.push(r.url() + ' ' + r.failure()?.errorText));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch((e) => errors.push('goto:' + e.message));
  await page.waitForTimeout(3000);
  const state = await page.evaluate(() => ({
    header: !!document.getElementById('bk-header')?.innerHTML,
    acsw: !!document.getElementById('acsw-root'),
    icons: !!window.ACSW_PROFILE_ICONS,
    iconCount: window.ACSW_PROFILE_ICONS ? Object.keys(window.ACSW_PROFILE_ICONS).length : 0,
    profileSvg: document.querySelector('.acsw-profile-seizures .acsw-profile-content__icon svg')?.outerHTML?.slice(0, 40),
    initBK: typeof initBKLayout,
  }));
  console.log(JSON.stringify({ url, state, errors, failed: failed.filter((f) => /acsw|components|cookie|accessibility/i.test(f)) }, null, 2));
  await page.close();
}
await browser.close();