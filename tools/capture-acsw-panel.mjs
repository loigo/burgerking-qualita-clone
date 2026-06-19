import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(15000);
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(2000);

// Click shadow DOM trigger
await page.evaluate(() => {
  const hosts = [...document.querySelectorAll('access-widget-ui')];
  for (const h of hosts) {
    const btn = h.shadowRoot?.querySelector('[data-testid="acsb-trigger"]');
    if (btn) { btn.click(); return true; }
  }
  document.querySelector('.acsb-trigger')?.click();
  return false;
});
await page.waitForTimeout(4000);

const data = await page.evaluate(() => {
  function deepQuery(sel, root = document) {
    const found = [];
    const els = root.querySelectorAll ? [...root.querySelectorAll(sel)] : [];
    found.push(...els);
    const all = root.querySelectorAll ? [...root.querySelectorAll('*')] : [];
    for (const el of all) {
      if (el.shadowRoot) found.push(...deepQuery(sel, el.shadowRoot));
    }
    return found;
  }

  const title = deepQuery('*').find((el) => (el.textContent || '').trim() === "Regolazioni per l'accessibilità");
  const panel = title?.closest('[role="dialog"], [class*="panel"], [class*="widget"], [class*="drawer"], [class*="sidebar"]')
    || title?.parentElement?.parentElement?.parentElement;

  function styleEl(el) {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      class: (typeof el.className === 'string' ? el.className : '').slice(0, 150),
      text: (el.childNodes.length <= 2 ? el.textContent : '')?.trim().slice(0, 100),
      bg: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      borderRadius: cs.borderRadius,
      padding: cs.padding,
      width: Math.round(r.width),
      height: Math.round(r.height),
      top: Math.round(r.top),
      left: Math.round(r.left),
    };
  }

  const rows = deepQuery('*').filter((el) => /Sicurezza epilessia|Supporto per ipovisione|ADHD Friendly|Persone anziane/i.test(el.textContent || '') && el.children.length >= 2);

  const allText = deepQuery('*')
    .filter((el) => /Regolazioni|Reset impostazioni|Personalizza|Sicurezza|AccessiWay|Nascondi|Dichiarazione|Contenuto poco/i.test(el.textContent || ''))
    .map(styleEl)
    .filter((x) => x && x.width > 0);

  const panelHtml = panel?.outerHTML?.slice(0, 30000) || null;

  // Find shadow panel
  let shadowPanel = null;
  for (const h of document.querySelectorAll('access-widget-ui')) {
    const html = h.shadowRoot?.innerHTML || '';
    if (html.includes("Regolazioni")) {
      shadowPanel = html.slice(0, 50000);
      break;
    }
  }

  return {
    titleFound: !!title,
    titleStyle: styleEl(title),
    panelStyle: styleEl(panel),
    rowsCount: rows.length,
    rowStyles: rows.slice(0, 7).map(styleEl),
    allText: allText.slice(0, 30),
    shadowPanelLen: shadowPanel?.length || 0,
    shadowPanel: shadowPanel?.slice(0, 40000) || null,
    panelHtmlLen: panelHtml?.length || 0,
  };
});

fs.writeFileSync('tools/acsw-panel-detail.json', JSON.stringify(data, null, 2));
if (data.shadowPanel) fs.writeFileSync('tools/acsw-panel-shadow.html', data.shadowPanel);
await page.screenshot({ path: 'tools/accessibility-original-panel.png', fullPage: false });
await browser.close();
console.log({ title: data.titleFound, shadow: data.shadowPanelLen, texts: data.allText?.length });