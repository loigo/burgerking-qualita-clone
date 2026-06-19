import { chromium } from 'playwright';
import fs from 'fs';

const slug = process.argv[2] || 'crazy_cheese_chicken_bbq';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`https://www.burgerking.it/prodotti/dettaglio/${slug}`, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3000);

const detail = await page.evaluate(() => {
  const main = document.querySelector('main') || document.body;
  const texts = [...main.querySelectorAll('h1,h2,h3,p,span,div')].filter((el) => el.children.length === 0 && el.textContent.trim().length > 10).slice(0, 40).map((el) => ({ tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 200) }));

  const imgs = [...main.querySelectorAll('img')].map((img) => ({ src: img.src, alt: img.alt, cls: img.className }));
  const bgs = [...main.querySelectorAll('[style*="background-image"]')].map((el) => ({ cls: el.className, bg: el.style.backgroundImage }));

  const ingredientBlocks = [...document.querySelectorAll('.ingrediente, .ingredient, [class*="ingred"]')].slice(0, 30).map((el) => ({
    text: el.textContent?.trim(),
    html: el.outerHTML.slice(0, 300),
  }));

  return {
    title: document.querySelector('h1')?.textContent?.trim(),
    pageTitle: document.title,
    texts,
    imgs: imgs.slice(0, 20),
    bgs: bgs.slice(0, 10),
    ingredientBlocks,
    mainHtml: main.innerHTML.slice(0, 15000),
  };
});

fs.writeFileSync(`tools/detail-${slug}.json`, JSON.stringify(detail, null, 2));
console.log('title:', detail.title, 'imgs:', detail.imgs.length);
await browser.close();