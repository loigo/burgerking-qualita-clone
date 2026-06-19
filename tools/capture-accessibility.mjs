import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(6000);

const before = await page.evaluate(() => {
  const all = [...document.querySelectorAll('*')];
  return all
    .filter((el) => {
      const t = (el.textContent || '').trim();
      const id = el.id || '';
      const cls = typeof el.className === 'string' ? el.className : '';
      return /Regolazioni|accessiway|acsw|acs-|accessibilit/i.test(t + id + cls);
    })
    .slice(0, 40)
    .map((el) => ({
      tag: el.tagName,
      id: el.id,
      class: el.className,
      text: el.textContent?.trim().slice(0, 80),
      role: el.getAttribute('role'),
    }));
});

// try clicking floating accessibility button
const clicked = await page.evaluate(() => {
  const candidates = [...document.querySelectorAll('button, a, div, [role=button]')].filter((el) => {
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const title = (el.getAttribute('title') || '').toLowerCase();
    const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    const id = (el.id || '').toLowerCase();
    return /access|regolaz|acsw|acs-|accessiway/.test(aria + title + cls + id);
  });
  const btn = candidates.find((el) => el.offsetParent !== null && el.getBoundingClientRect().width > 0);
  if (btn) {
    btn.click();
    return { ok: true, tag: btn.tagName, class: btn.className, aria: btn.getAttribute('aria-label') };
  }
  return { ok: false, count: candidates.length, sample: candidates.slice(0, 8).map((el) => ({ tag: el.tagName, class: el.className, aria: el.getAttribute('aria-label') })) };
});

await page.waitForTimeout(3000);

const after = await page.evaluate(() => {
  const modal = [...document.querySelectorAll('*')].find((el) => (el.textContent || '').includes("Regolazioni per l'accessibilità"));
  const styles = modal
    ? (() => {
        const cs = getComputedStyle(modal);
        return { tag: modal.tagName, id: modal.id, class: modal.className, bg: cs.backgroundColor, color: cs.color, w: cs.width, h: cs.height };
      })()
    : null;
  const htmlParts = [...document.querySelectorAll('*')]
    .filter((el) => /Regolazioni per l'accessibilità|Personalizza la tua esperienza|Reset impostazioni|AccessiWay/i.test(el.textContent || ''))
    .map((el) => ({ tag: el.tagName, id: el.id, class: el.className, text: el.textContent?.trim().slice(0, 120) }));
  const shadowHosts = [...document.querySelectorAll('*')].filter((el) => el.shadowRoot).map((el) => el.tagName + '#' + el.id + '.' + el.className);
  return { styles, htmlParts: htmlParts.slice(0, 20), shadowHosts, bodySnippet: document.body.innerHTML.slice(-8000) };
});

fs.writeFileSync('tools/accessibility-capture.json', JSON.stringify({ before, clicked, after }, null, 2));
await page.screenshot({ path: 'tools/accessibility-original.png', fullPage: false });
await browser.close();
console.log('clicked', clicked.ok, 'parts', after.htmlParts?.length || 0);