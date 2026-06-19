import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(8000);
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(2000);

const pre = await page.evaluate(() => {
  const triggers = [...document.querySelectorAll('[class*="acsb"]')].map((el) => ({
    tag: el.tagName,
    class: el.className,
    id: el.id,
    aria: el.getAttribute('aria-label'),
    rect: el.getBoundingClientRect(),
    display: getComputedStyle(el).display,
    visibility: getComputedStyle(el).visibility,
    opacity: getComputedStyle(el).opacity,
    z: getComputedStyle(el).zIndex,
  }));
  return { triggers };
});

const clickRes = await page.evaluate(() => {
  const btn = document.querySelector('.acsb-trigger');
  if (!btn) return { ok: false };
  btn.style.setProperty('display', 'block', 'important');
  btn.style.setProperty('visibility', 'visible', 'important');
  btn.style.setProperty('opacity', '1', 'important');
  btn.click();
  return { ok: true, class: btn.className, rect: btn.getBoundingClientRect() };
});

await page.waitForTimeout(3500);

const post = await page.evaluate(() => {
  const titleEl = [...document.querySelectorAll('*')].find((el) => (el.textContent || '').trim() === "Regolazioni per l'accessibilità");
  const widget = document.querySelector('.acsb-widget');
  const active = document.querySelector('.acsb-widget.acsb-active, .acsb-widget.acsb-opened, .acsb-widget.acsb-widget-open');
  const allClasses = [...new Set([...document.querySelectorAll('[class*="acsb"]')].map((el) => el.className))];
  return {
    titleFound: !!titleEl,
    widgetClass: widget?.className,
    activeClass: active?.className,
    allClasses: allClasses.slice(0, 30),
    widgetHtml: widget?.outerHTML?.slice(0, 40000) || null,
    bodyTail: document.body.innerHTML.slice(-12000),
  };
});

fs.writeFileSync('tools/acsb-capture3.json', JSON.stringify({ pre, clickRes, post }, null, 2));
if (post.widgetHtml) fs.writeFileSync('tools/acsb-panel.html', post.widgetHtml);
await page.screenshot({ path: 'tools/accessibility-panel.png' });
await browser.close();
console.log('click', clickRes, 'title', post.titleFound, 'html', !!post.widgetHtml);