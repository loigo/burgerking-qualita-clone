import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/prodotti/dettaglio/crazy_cheese_chicken_bbq', { waitUntil: 'networkidle', timeout: 90000 });
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(2500);

const data = await page.evaluate(() => {
  const content = document.querySelector('.container-prodotto, .dettaglio-prodotto, main');
  const pick = (sel) => document.querySelector(sel);
  return {
    h1: pick('h1')?.outerHTML,
    title: pick('h1')?.textContent?.trim(),
    descHtml: pick('.descrizione-prodotto, .description, .testo-prodotto, .product-description, [class*="descrizione"]')?.innerHTML,
    hero: pick('.img-prodotto img, .hero-prodotto img, .slide-immagine')?.src,
    bgHero: [...document.querySelectorAll('[style*="background"]')].map((e) => e.style.backgroundImage).find((b) => b && /products/.test(b)),
    ingredienti: [...document.querySelectorAll('.list-ingredienti li, .ingredienti-list li, .ingrediente')].map((el) => ({
      text: el.textContent?.trim(),
      img: el.querySelector('img')?.src,
      html: el.outerHTML.slice(0, 250),
    })),
    allergeni: [...document.querySelectorAll('.allergeni img, .list-allergeni img')].map((img) => ({ src: img.src, alt: img.alt })),
    classes: [...document.querySelectorAll('main *')].filter((el) => /prodotto|ingred|allerg|dettaglio/i.test(el.className)).slice(0, 40).map((el) => ({ tag: el.tagName, cls: el.className })),
    mainSnippet: (content || document.body).innerHTML.replace(/<script[\s\S]*?<\/script>/gi, '').slice(0, 12000),
  };
});

fs.writeFileSync('tools/detail-page-snippet.html', data.mainSnippet || '');
fs.writeFileSync('tools/detail-page-data.json', JSON.stringify(data, null, 2));
console.log('title:', data.title, 'ingredienti:', data.ingredienti.length, 'allergeni:', data.allergeni.length);
await browser.close();