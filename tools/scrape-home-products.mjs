import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://www.burgerking.it/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

const cats = ['best_seller', 'italian_kings', 'manzo', 'pollo', 'insalate_&_wrap', 'king_junior_meal'];
const result = {};

for (const cat of cats) {
  const selector = `#btn-${cat.replace(/&/g, '\\&')}`;
  await page.click(selector);
  await page.waitForTimeout(900);
  result[cat] = await page.evaluate(() =>
    [...document.querySelectorAll('#carousel-prodotti li')].map((li) => {
      const bg = li.querySelector('.div-img-news')?.style?.backgroundImage || '';
      const imgMatch = bg.match(/url\(["']?([^"')]+)/);
      return {
        title: li.querySelector('.news-title')?.textContent?.trim(),
        href: li.querySelector('a')?.getAttribute('href'),
        img: imgMatch ? imgMatch[1] : null,
      };
    })
  );
}

console.log(JSON.stringify(result, null, 2));
await browser.close();