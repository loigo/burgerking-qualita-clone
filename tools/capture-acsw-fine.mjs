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
  if (!main) return { err: 'no main' };

  function s(el) {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: (el.childNodes.length <= 2 ? el.textContent : '')?.trim().slice(0, 80),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      color: cs.color,
      bg: cs.backgroundColor,
      padding: cs.padding,
      margin: cs.margin,
      gap: cs.gap,
      borderRadius: cs.borderRadius,
      width: Math.round(r.width),
      height: Math.round(r.height),
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
    };
  }

  const heroBtns = [...main.querySelectorAll('.hero-button')].map((b) => ({
    text: b.textContent?.trim(),
    ...s(b),
    iconW: b.querySelector('svg')?.getBoundingClientRect().width,
  }));

  const profiles = [...main.querySelectorAll('.profile')].slice(0, 7).map((p) => ({
    name: p.querySelector('.profile-content__name')?.textContent?.trim(),
    desc: p.querySelector('.profile-content__text')?.textContent?.trim(),
    toggle: s(p.querySelector('.toggle')),
    toggleNo: s(p.querySelector('.toggle__option:not(.toggle__option--on)')),
    toggleSi: s(p.querySelector('.toggle__option--on')),
    icon: s(p.querySelector('.profile-content__icon')),
    row: s(p),
  }));

  // click first profile to get active toggle styles
  const first = main.querySelector('.profile');
  if (first) first.click();

  const activeProfile = main.querySelector('.profile[aria-checked="true"], .profile.is-active');
  const activeToggle = activeProfile ? {
    toggleNo: s(activeProfile.querySelector('.toggle__option:not(.toggle__option--on)')),
    toggleSi: s(activeProfile.querySelector('.toggle__option--on')),
  } : null;

  return {
    heroBtns,
    profiles,
    activeToggle,
    footer: s(main.querySelector('.widget-footer')),
    footerLink: s(main.querySelector('.widget-footer a')),
    search: s(main.querySelector('.search .input')),
    sectionTitle: s(main.querySelector('.action-section__title')),
    close: s(main.querySelector('.close_button')),
    lang: s(main.querySelector('.language-selector')),
    container: s(main),
    widgetPos: s(main.closest('.widget-container__trap') || main),
  };
});

fs.writeFileSync('tools/acsw-fine.json', JSON.stringify(data, null, 2));
await page.screenshot({ path: 'tools/accessibility-original-fine.png', fullPage: false });
await browser.close();
console.log(JSON.stringify(data, null, 2).slice(0, 6000));