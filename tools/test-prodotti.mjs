import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://127.0.0.1:8080/prodotti.html', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

const list = await page.evaluate(() => ({
  categories: document.querySelectorAll('#categories-track .category-carousel-item').length,
  products: document.querySelectorAll('#product-grid .col-prodotto').length,
  firstTitle: document.querySelector('#product-grid .card-prod-title')?.textContent?.trim(),
  sidebar: !!document.querySelector('#sidebar-filtri-prod .btn-filtro-prod'),
  hero: document.querySelectorAll('#prodotti-hero-slider .prodotti-hero-slide').length,
}));

await page.goto('http://127.0.0.1:8080/prodotti/dettaglio/crazy_cheese_chicken_bbq.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const detail = await page.evaluate(() => ({
  title: document.getElementById('product-title')?.textContent?.trim(),
  img: document.getElementById('product-hero-img')?.src?.includes('1322'),
  ingredients: document.querySelectorAll('#ingredienti-track .ingrediente-item').length,
  allergeni: document.querySelectorAll('#allergeni-grid .allergene-item').length,
  desc: document.getElementById('product-description')?.textContent?.includes('cotoletta'),
}));

console.log(JSON.stringify({ list, detail }, null, 2));
await browser.close();