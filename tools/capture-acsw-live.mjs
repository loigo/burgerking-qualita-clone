import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(12000);

// Accept cookies if present
await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(2000);

const data = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Click acsb trigger
  const trigger = document.querySelector('.acsb-trigger');
  if (trigger) trigger.click();
  await wait(4000);

  function walkShadow(root, depth = 0, out = []) {
    if (!root || depth > 8) return out;
    const els = root.querySelectorAll ? [...root.querySelectorAll('*')] : [];
    for (const el of els) {
      const text = (el.textContent || '').trim();
      const cls = typeof el.className === 'string' ? el.className : '';
      if (/Regolazioni|Reset impostazioni|Personalizza|Sicurezza epilessia|AccessiWay|Nascondi interf/i.test(text + cls)) {
        const cs = getComputedStyle(el);
        out.push({
          tag: el.tagName,
          class: cls.slice(0, 120),
          text: text.slice(0, 80),
          bg: cs.backgroundColor,
          color: cs.color,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          padding: cs.padding,
          borderRadius: cs.borderRadius,
          width: cs.width,
          height: cs.height,
        });
      }
      if (el.shadowRoot) walkShadow(el.shadowRoot, depth + 1, out);
    }
    return out;
  }

  const hosts = [...document.querySelectorAll('*')].filter((el) => el.shadowRoot);
  const shadowInfo = hosts.map((h) => ({
    tag: h.tagName,
    class: h.className,
    html: h.shadowRoot?.innerHTML?.slice(0, 8000) || '',
  }));

  const acsbWidget = document.querySelector('.acsb-widget:not(.acsb-trigger), .acsb-app, [class*="acsb-"]');
  const allAcsb = [...document.querySelectorAll('[class*="acsb"]')].map((el) => ({
    class: el.className,
    rect: el.getBoundingClientRect(),
    display: getComputedStyle(el).display,
    html: el.outerHTML?.slice(0, 2000),
  }));

  const titleEl = [...document.querySelectorAll('*')].find((el) => (el.textContent || '').trim() === "Regolazioni per l'accessibilità");
  let titleStyles = null;
  if (titleEl) {
    const cs = getComputedStyle(titleEl);
    titleStyles = { tag: titleEl.tagName, class: titleEl.className, bg: cs.backgroundColor, color: cs.color, fontSize: cs.fontSize, fontWeight: cs.fontWeight, padding: cs.padding };
  }

  return {
    trigger: trigger ? { class: trigger.className, rect: trigger.getBoundingClientRect(), bg: getComputedStyle(trigger).backgroundColor } : null,
    titleFound: !!titleEl,
    titleStyles,
    shadowHosts: shadowInfo.length,
    shadowInfo: shadowInfo.slice(0, 4),
    walkResults: walkShadow(document).slice(0, 40),
    allAcsb: allAcsb.slice(0, 15),
    acsbKeys: Object.keys(window).filter((k) => /acs|access/i.test(k)),
  };
});

fs.writeFileSync('tools/acsw-live.json', JSON.stringify(data, null, 2));
await page.screenshot({ path: 'tools/accessibility-live-open.png', fullPage: false });
await browser.close();
console.log(JSON.stringify({ titleFound: data.titleFound, shadowHosts: data.shadowHosts, walk: data.walkResults?.length }, null, 2));