import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(8000);

await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(2000);

const triggers = await page.$$eval('[class*="acsb"]', (els) =>
  els.map((el) => ({
    tag: el.tagName,
    class: el.className,
    text: el.textContent?.trim().slice(0, 50),
    rect: el.getBoundingClientRect(),
    vis: !!(el.offsetWidth || el.offsetHeight),
  }))
);

const btn = await page.$('.acsb-trigger');
if (btn) await btn.click({ force: true });
await page.waitForTimeout(3000);

const data = await page.evaluate(() => {
  const titleEl = [...document.querySelectorAll('*')].find((el) =>
    (el.textContent || '').trim() === "Regolazioni per l'accessibilità"
  );
  const root = titleEl?.closest('.acsb-widget') || titleEl?.closest('[class*="acsb-"]');
  const styles = root
    ? (() => {
        const cs = getComputedStyle(root);
        return { bg: cs.backgroundColor, color: cs.color, w: cs.width, h: cs.height, br: cs.borderRadius, shadow: cs.boxShadow };
      })()
    : null;

  const buttons = [...document.querySelectorAll('button, a')].filter((el) =>
    ['Reset impostazioni', 'Dichiarazione', 'Nascondi interf.'].some((t) => (el.textContent || '').includes(t))
  ).map((el) => {
    const cs = getComputedStyle(el);
    return { text: el.textContent?.trim(), bg: cs.backgroundColor, color: cs.color, br: cs.borderRadius, pad: cs.padding };
  });

  const toggles = [...document.querySelectorAll('*')].filter((el) =>
    /Sicurezza epilessia|Supporto per ipovisione|ADHD Friendly|Supporto alla lettura|Navigazione da tastiera|lettore di schermo|Persone anziane/i.test(el.textContent || '')
  ).slice(0, 12).map((el) => ({ tag: el.tagName, class: el.className, text: el.textContent?.trim().slice(0, 100) }));

  return { styles, buttons, toggles, rootHtml: root?.outerHTML?.slice(0, 35000) || null, titleFound: !!titleEl };
});

fs.writeFileSync('tools/acsb-capture2.json', JSON.stringify({ triggers, data }, null, 2));
if (data.rootHtml) fs.writeFileSync('tools/acsb-panel.html', data.rootHtml);
await page.screenshot({ path: 'tools/accessibility-panel.png' });
await browser.close();
console.log('triggers', triggers.length, 'title', data.titleFound, 'html', !!data.rootHtml);