import { chromium } from 'playwright';

const urls = [
  'https://www.burgerking.it/franchising',
  'http://127.0.0.1:8080/franchising.html',
];

for (const url of urls) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    const dialog = await page.$('#CybotCookiebotDialog, #cookie-banner, #CybotCookiebotDialogWrapper');
    const html = dialog ? await dialog.evaluate((el) => el.outerHTML) : 'NO DIALOG';
    const styles = dialog
      ? await dialog.evaluate((el) => {
          const cs = getComputedStyle(el);
          const kids = [...el.querySelectorAll('*')].slice(0, 80).map((node) => ({
            tag: node.tagName,
            id: node.id,
            class: node.className,
          }));
          return {
            display: cs.display,
            position: cs.position,
            bottom: cs.bottom,
            zIndex: cs.zIndex,
            width: cs.width,
            height: cs.height,
            fontFamily: cs.fontFamily,
            background: cs.backgroundColor,
            kids,
          };
        })
      : null;
    await page.screenshot({ path: `tools/cookiebot-${url.includes('127.0.0.1') ? 'clone' : 'original'}.png`, fullPage: false });
    console.log('\n===', url, '===');
    console.log('HTML length:', html.length);
    console.log('Styles:', JSON.stringify(styles, null, 2));
    if (html !== 'NO DIALOG') {
      const fs = await import('fs');
      fs.writeFileSync(`tools/cookiebot-${url.includes('127.0.0.1') ? 'clone' : 'original'}.html`, html);
      // extract inline styles from page
      const cssText = await page.evaluate(() => {
        const rules = [];
        for (const sheet of [...document.styleSheets]) {
          try {
            for (const rule of [...sheet.cssRules]) {
              if (rule.cssText && rule.cssText.includes('CybotCookiebot')) rules.push(rule.cssText);
            }
          } catch (_) {}
        }
        return rules.join('\n');
      });
      if (cssText) fs.writeFileSync(`tools/cookiebot-${url.includes('127.0.0.1') ? 'clone' : 'original'}-css.txt`, cssText);
    }
  } catch (err) {
    console.error(url, err.message);
  }
  await browser.close();
}