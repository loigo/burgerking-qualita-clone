import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(8000);

const trigger = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.acsb-trigger, [class*=acsb], [id*=acsb]')];
  return els.map((el) => ({
    tag: el.tagName,
    id: el.id,
    class: el.className,
    aria: el.getAttribute('aria-label'),
    rect: el.getBoundingClientRect(),
    display: getComputedStyle(el).display,
  }));
});

let clicked = false;
for (const sel of ['.acsb-trigger', '.acsb-widget .acsb-trigger', '[data-acsb-trigger]', '.acsb-custom-trigger']) {
  const el = await page.$(sel);
  if (el) {
    await el.click({ force: true });
    clicked = sel;
    break;
  }
}

await page.waitForTimeout(2500);

const panel = await page.evaluate(() => {
  const findByText = (txt) => [...document.querySelectorAll('*')].find((el) => el.childElementCount < 8 && (el.textContent || '').trim() === txt);
  const title = findByText("Regolazioni per l'accessibilità") || [...document.querySelectorAll('*')].find((el) => (el.textContent || '').includes("Regolazioni per l'accessibilità") && el.children.length < 6);
  const root = title?.closest('[class*=acsb]') || title?.parentElement?.parentElement?.parentElement;
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { tag: el.tagName, id: el.id, class: el.className, bg: cs.backgroundColor, color: cs.color, w: cs.width, h: cs.height, fs: cs.fontSize, pad: cs.padding, br: cs.borderRadius };
  };
  const items = [...document.querySelectorAll('[class*=acsb]')].slice(0, 80).map((el) => ({
    tag: el.tagName,
    class: el.className,
    text: el.textContent?.trim().slice(0, 80),
    ...pick(el),
  }));
  return {
    title: title ? { tag: title.tagName, class: title.className, text: title.textContent?.trim().slice(0, 120) } : null,
    rootHtml: root?.outerHTML?.slice(0, 20000) || null,
    items,
    allAcsb: [...document.querySelectorAll('[class*="acsb"]')].length,
  };
});

fs.writeFileSync('tools/acsb-capture.json', JSON.stringify({ trigger, clicked, panel }, null, 2));
await page.screenshot({ path: 'tools/accessibility-panel.png' });
await browser.close();
console.log('trigger', trigger.length, 'clicked', clicked, 'acsb', panel.allAcsb, 'root', !!panel.rootHtml);