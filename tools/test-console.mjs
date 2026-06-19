import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
page.on('pageerror', (e) => logs.push('PAGE:' + e.message));
await page.goto('http://127.0.0.1:8080/franchising.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
await page.click('#acsw-trigger');
await page.waitForTimeout(500);
await page.click('#acsw-btn-reset');
await page.click('.acsw-profile-seizures');
await page.click('#acsw-btn-close');
await page.click('#acsw-btn-declaration').catch(() => {});
await page.waitForTimeout(1000);
const declUrl = page.url();
console.log(JSON.stringify({ logs, declUrl }, null, 2));
await browser.close();