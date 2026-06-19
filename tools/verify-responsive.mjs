import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:8080';
const viewports = [
  { name: 'iPhone', w: 390, h: 844 },
  { name: 'iPad', w: 768, h: 1024 },
  { name: 'Desktop', w: 1280, h: 800 },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle', timeout: 30000 });
  const m = await page.evaluate(() => ({
    twCdn: !!document.querySelector('script[src*="tailwindcss"]'),
    twCss: !!document.querySelector('link[href*="tailwind.css"]'),
    customCss: !!document.querySelector('link[href*="custom.css"]'),
    cols: document.querySelector('#hero-slider .grid')
      ? getComputedStyle(document.querySelector('#hero-slider .grid')).gridTemplateColumns
      : null,
    h1: document.querySelector('#hero-slider h1')
      ? getComputedStyle(document.querySelector('#hero-slider h1')).fontSize
      : null,
    mobileBar: document.getElementById('mobile-bar')
      ? getComputedStyle(document.getElementById('mobile-bar')).display
      : null,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  }));
  console.log(vp.name, JSON.stringify(m));
}

await browser.close();