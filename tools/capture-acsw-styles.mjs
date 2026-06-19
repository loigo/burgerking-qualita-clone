import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(15000);
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(2000);
await page.evaluate(() => {
  for (const h of document.querySelectorAll('access-widget-ui')) {
    const btn = h.shadowRoot?.querySelector('[data-testid="acsb-trigger"]');
    if (btn) { btn.click(); return; }
  }
});
await page.waitForTimeout(4000);

const styles = await page.evaluate(() => {
  function deepFind(text) {
    function walk(root) {
      const all = root.querySelectorAll ? [...root.querySelectorAll('*')] : [];
      for (const el of all) {
        if ((el.textContent || '').trim() === text) return el;
        if (el.shadowRoot) {
          const f = walk(el.shadowRoot);
          if (f) return f;
        }
      }
      return null;
    }
    return walk(document);
  }
  function s(el) {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { class: el.className, bg: cs.backgroundColor, color: cs.color, fontSize: cs.fontSize, borderRadius: cs.borderRadius, padding: cs.padding, border: cs.border, width: cs.width, height: cs.height };
  }
  const selectors = [
    ['.header', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.header')],
    ['.hero', deepFind("Regolazioni per l'accessibilità")?.closest('.hero')],
    ['.close_button', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.close_button')],
    ['.hero-button', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.hero-button')],
    ['.search-form', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.search-form')],
    ['.search .input', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.search .input')],
    ['.toggle', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.toggle')],
    ['.toggle__option', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.toggle__option')],
    ['.toggle__option--on', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.toggle__option--on')],
    ['.profile', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.profile')],
    ['.profile-content__name', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.profile-content__name')],
    ['.profile-content__text', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.profile-content__text')],
    ['.profile-content__icon', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.profile-content__icon')],
    ['.widget-container__main', deepFind("Regolazioni per l'accessibilità")?.closest('.widget-container__main')],
    ['.footer', deepFind("Regolazioni per l'accessibilità")?.closest('.main')?.querySelector('.footer')],
    ['.overlay--visible', deepFind("Regolazioni per l'accessibilità")?.closest('.widget-container')?.querySelector('.overlay--visible')],
  ];
  const out = {};
  for (const [name, el] of selectors) out[name] = s(el);
  return out;
});

fs.writeFileSync('tools/acsw-styles.json', JSON.stringify(styles, null, 2));
console.log(JSON.stringify(styles, null, 2));
await browser.close();