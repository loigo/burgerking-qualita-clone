import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('https://www.burgerking.it/prodotti', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2500);

const prodottiPage = await page.evaluate(() => {
  const categories = [...document.querySelectorAll('#carousel-categorie-prod [data-cat]')].map((el) => ({
    cat: el.dataset.cat,
    title: el.querySelector('.title')?.textContent?.trim(),
    img: el.querySelector('img')?.src,
    index: el.dataset.index,
  }));

  const filters = [...document.querySelectorAll('.btn-filtro-categoria')].map((b) => ({
    cat: b.dataset.cat,
    text: b.textContent.trim(),
    active: b.classList.contains('active'),
  }));

  const products = [...document.querySelectorAll('.main-prodotti .col-prodotto, .main-prodotti [id^="prodotto-"]')].map((el) => {
    const link = el.querySelector('a');
    const img = el.querySelector('.div-img-news');
    return {
      id: el.id,
      title: el.querySelector('.news-title')?.textContent?.trim(),
      href: link?.getAttribute('href'),
      img: img?.style?.backgroundImage?.match(/url\(["']?([^"')]+)/)?.[1],
      dataCat: el.dataset?.cat,
      classes: el.className,
    };
  });

  // fallback grid items
  const gridItems = [...document.querySelectorAll('.main-prodotti a.no-decoration, .main-prodotti .news-card')];
  const cards = [];
  document.querySelectorAll('.main-prodotti .row .col-prodotto, .main-prodotti .row > div').forEach((col) => {
    const a = col.querySelector('a');
    const title = col.querySelector('.news-title')?.textContent?.trim();
    const bg = col.querySelector('.div-img-news')?.style?.backgroundImage || '';
    const img = bg.match(/url\(["']?([^"')]+)/)?.[1];
    if (title) cards.push({ title, href: a?.getAttribute('href'), img, html: col.outerHTML.slice(0, 300) });
  });

  const novita = [...document.querySelectorAll('#carousel-news li, .section-carousel .news-card')].slice(0, 8).map((li) => {
    const a = li.closest('a') || li.querySelector('a');
    return {
      title: li.querySelector('.news-title')?.textContent?.trim(),
      preview: li.querySelector('.news-preview')?.textContent?.trim(),
      href: a?.getAttribute('href'),
      img: li.querySelector('.div-img-news')?.style?.backgroundImage?.match(/url\(["']?([^"')]+)/)?.[1],
    };
  });

  return {
    h1: document.querySelector('.main-prodotti h1, .titolo-section')?.textContent?.trim(),
    subtitle: document.querySelector('.main-prodotti p, .sottotitolo')?.textContent?.trim(),
    categories,
    filters,
    products,
    cards: cards.slice(0, 30),
    cardCount: cards.length,
    novitaSection: [...document.querySelectorAll('section')].map((s) => s.className + ' ' + (s.querySelector('.titolo-section')?.textContent?.trim() || '')).filter((t) => /novit/i.test(t)),
    bodyClasses: document.body.className,
  };
});

// product detail
await page.goto('https://www.burgerking.it/prodotti/dettaglio/crazy_cheese_chicken_bbq', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);

const detail = await page.evaluate(() => {
  const getText = (sel) => document.querySelector(sel)?.textContent?.trim();
  const ingredients = [...document.querySelectorAll('.ingredienti .ingrediente, .list-ingredienti li, .ingredient-item')].map((el) => ({
    name: el.querySelector('.nome, .title, span')?.textContent?.trim() || el.textContent?.trim(),
    img: el.querySelector('img')?.src,
    html: el.outerHTML.slice(0, 200),
  }));

  const allergeni = [...document.querySelectorAll('.allergeni img, .allergeni .allergene, [class*="allergen"] img')].map((el) => ({
    alt: el.alt,
    src: el.src,
  }));

  return {
    title: getText('h1') || getText('.titolo-prodotto') || getText('.product-title'),
    description: document.querySelector('.descrizione, .description, .testo-prodotto, .product-description')?.innerHTML?.slice(0, 2000),
    descText: getText('.descrizione, .description, .testo-prodotto'),
    mainImg: document.querySelector('.img-prodotto img, .product-image img, .div-img-prodotto')?.src || document.querySelector('[style*="background-image"]')?.style?.backgroundImage,
    ingredients,
    allergeni,
    htmlSnippet: document.querySelector('main, .main-prodotti, .dettaglio-prodotto, .product-detail')?.innerHTML?.slice(0, 5000),
    allH: [...document.querySelectorAll('h1,h2,h3,.titolo-section')].map((e) => ({ tag: e.tagName, text: e.textContent.trim(), cls: e.className })),
  };
});

// extract dati_pagina from prodotti source if needed
const output = { prodottiPage, detail };
fs.writeFileSync('tools/prodotti-scrape.json', JSON.stringify(output, null, 2));
console.log('saved tools/prodotti-scrape.json');
console.log('cards:', prodottiPage.cardCount, 'categories:', prodottiPage.categories.length);
console.log('detail title:', detail.title);

await browser.close();