import fs from 'fs';

const html = fs.readFileSync('tools/cookiebot-original.html', 'utf8');
const m = html.match(/id="CybotCookiebotDialogPoweredbyCybot"[^>]*>(<svg[\s\S]*?<\/svg>)/);
if (m) {
  const svg = m[1].replace('viewBox="0 0 843 248"', 'viewBox="0 0 843 248" width="175" height="19"');
  fs.mkdirSync('assets', { recursive: true });
  fs.writeFileSync('assets/cookiebot-powered.svg', svg);
  console.log('saved', svg.length);
} else {
  console.log('not found');
}