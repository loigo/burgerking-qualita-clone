import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.burgerking.it/franchising', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(5000);

const data = await page.evaluate(() => {
  const dialog = document.getElementById('CybotCookiebotDialog');
  if (!dialog) return null;

  const pick = (sel) => {
    const el = dialog.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      text: el.textContent?.trim().slice(0, 80),
      color: cs.color,
      background: cs.backgroundColor,
      border: cs.border,
      borderTop: cs.borderTop,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      padding: cs.padding,
      margin: cs.margin,
      width: cs.width,
      height: cs.height,
      display: cs.display,
      flexDirection: cs.flexDirection,
      gap: cs.gap,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      position: cs.position,
      bottom: cs.bottom,
    };
  };

  const rules = [];
  for (const sheet of [...document.styleSheets]) {
    try {
      for (const rule of [...sheet.cssRules]) {
        if (rule.cssText && /CybotCookiebot/.test(rule.cssText)) rules.push(rule.cssText);
      }
    } catch (_) {}
  }

  return {
    dialog: pick('#CybotCookiebotDialog'),
    title: pick('#CybotCookiebotDialogBodyContentTitle'),
    text: pick('#CybotCookiebotDialogBodyContentText'),
    acceptAll: pick('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'),
    acceptSel: pick('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection'),
    decline: pick('#CybotCookiebotDialogBodyButtonDecline'),
    moreDetails: pick('#CybotCookiebotDialogBodyEdgeMoreDetailsLink'),
    poweredBy: pick('#CybotCookiebotDialogPoweredbyCybot'),
    slider: pick('.CybotCookiebotDialogBodyLevelButtonSlider'),
    sliderOn: (() => {
      const el = dialog.querySelector('input:checked + .CybotCookiebotDialogBodyLevelButtonSlider');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { background: cs.backgroundColor };
    })(),
    edge: pick('.CybotEdge'),
    wrapper: pick('.CybotCookiebotDialogContentWrapper'),
    bodyButtons: pick('#CybotCookiebotDialogBodyButtonsWrapper'),
    levelRow: pick('#CybotCookiebotDialogBodyLevelButtonsRow'),
    rules: rules.join('\n'),
    html: dialog.outerHTML.slice(0, 25000),
  };
});

fs.writeFileSync('tools/cookiebot-styles.json', JSON.stringify(data, null, 2));
if (data?.rules) fs.writeFileSync('tools/cookiebot-original-css.txt', data.rules);
await page.screenshot({ path: 'tools/cookiebot-original-visible.png' });
await browser.close();
console.log('done', data ? Object.keys(data) : 'no dialog');