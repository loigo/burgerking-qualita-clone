import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const initial = await page.evaluate(() => ({
  filters: [...document.querySelectorAll('#carousel-categorie-home .btn-filtro-categoria')].map((b) => b.textContent.trim()),
  count: document.querySelectorAll('#products-home-track .home-product-card').length,
  titles: [...document.querySelectorAll('#products-home-track .news-title')].map((el) => el.textContent.trim()),
}));

await page.click('#btn-manzo');
await page.waitForTimeout(400);
const manzo = await page.evaluate(() => ({
  count: document.querySelectorAll('#products-home-track .home-product-card').length,
  first: document.querySelector('#products-home-track .news-title')?.textContent?.trim(),
  active: document.querySelector('#btn-manzo')?.classList.contains('active'),
}));

await page.click('#btn-insalate_\\&_wrap');
await page.waitForTimeout(400);
const insalate = await page.evaluate(() => ({
  count: document.querySelectorAll('#products-home-track .home-product-card').length,
  first: document.querySelector('#products-home-track .news-title')?.textContent?.trim(),
}));

console.log(JSON.stringify({ initial, manzo, insalate }, null, 2));
await browser.close();