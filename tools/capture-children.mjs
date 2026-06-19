import { chromium } from 'playwright';

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

const data = await page.evaluate(() => {
  function findMain() {
    function walk(root) {
      for (const el of root.querySelectorAll ? [...root.querySelectorAll('*')] : []) {
        if (el.classList?.contains('widget-container__main')) return el;
        if (el.shadowRoot) { const f = walk(el.shadowRoot); if (f) return f; }
      }
      return null;
    }
    return walk(document);
  }
  const main = findMain();
  const children = [...main.children].map((c) => {
    const cs = getComputedStyle(c);
    return { tag: c.tagName, class: c.className, text: c.textContent?.trim().slice(0, 100), bg: cs.backgroundColor, position: cs.position, z: cs.zIndex, h: cs.height };
  });
  const footer = main.querySelector('.widget-footer');
  const footerCs = footer ? getComputedStyle(footer) : null;
  const toggleActive = main.querySelector('.profile.is-active .toggle__option--on, .profile[aria-checked=true] .toggle__option--on');
  return {
    children,
    footer: footer ? { class: footer.className, html: footer.outerHTML.slice(0, 500), bg: footerCs.backgroundColor, position: footerCs.position, top: footerCs.top, h: footerCs.height } : null,
    activeToggle: toggleActive ? getComputedStyle(toggleActive) : null,
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();