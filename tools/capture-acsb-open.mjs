import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(10000);
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(2000);

const openRes = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 30; i++) {
    if (window.acsbJS) break;
    await wait(500);
  }
  if (!window.acsbJS) return { err: 'no acsbJS', keys: Object.keys(window).filter((k) => /acs|access/i.test(k)) };
  const methods = Object.keys(window.acsbJS).filter((k) => typeof window.acsbJS[k] === 'function');
  try {
    if (typeof window.acsbJS.open === 'function') window.acsbJS.open();
    else if (typeof window.acsbJS.show === 'function') window.acsbJS.show();
    else if (typeof window.acsbJS.openWidget === 'function') window.acsbJS.openWidget();
    else if (typeof window.acsbJS.toggleWidget === 'function') window.acsbJS.toggleWidget(true);
    else document.querySelector('.acsb-trigger')?.click();
  } catch (e) {
    return { err: String(e), methods };
  }
  await wait(3000);
  const widget = document.querySelector('.acsb-widget:not(.acsb-trigger), .acsb-main, [class*="acsb-app"]');
  const title = [...document.querySelectorAll('*')].find((el) => (el.textContent || '').trim() === "Regolazioni per l'accessibilità");
  return {
    methods,
    widgetClass: widget?.className,
    titleFound: !!title,
    html: widget?.outerHTML?.slice(0, 50000) || document.body.innerHTML.match(/class="acsb[^"]*"/g)?.slice(0, 20),
    textHits: [...document.querySelectorAll('*')].filter((el) => /Regolazioni|Reset impostazioni|Personalizza la tua|Sicurezza epilessia|AccessiWay/i.test(el.textContent || '')).slice(0, 15).map((el) => el.textContent?.trim().slice(0, 100)),
  };
});

fs.writeFileSync('tools/acsb-open.json', JSON.stringify(openRes, null, 2));
if (openRes.html && typeof openRes.html === 'string') fs.writeFileSync('tools/acsb-panel-open.html', openRes.html);
await page.screenshot({ path: 'tools/accessibility-panel-open.png' });
await browser.close();
console.log(JSON.stringify(openRes, null, 2).slice(0, 4000));