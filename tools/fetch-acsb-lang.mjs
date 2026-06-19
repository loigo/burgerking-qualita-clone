import https from 'https';
import fs from 'fs';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

const app = await get('https://eu.acsbapp.com/apps/app/dist/js/app.js');
fs.writeFileSync('tools/acsb-app.js', app);
const urls = [...app.matchAll(/https?:\/\/[^"'`\s]+/g)].map((m) => m[0]).filter((u) => /lang|locale|it|translation|i18n/i.test(u));
console.log('candidate urls', urls.slice(0, 30));

for (const needle of ['Regolazioni', 'epilessia', 'ipovisione', 'Reset', 'Dichiarazione', 'Nascondi', 'Personalizza', 'dizionario', 'AccessiWay', 'anziane', 'ADHD']) {
  const i = app.indexOf(needle);
  console.log(needle, i);
}

// try common locale endpoints
const candidates = [
  'https://eu.acsbapp.com/apps/app/dist/locales/it.json',
  'https://eu.acsbapp.com/apps/app/dist/lang/it.json',
  'https://eu.acsbapp.com/apps/app/dist/i18n/it.json',
  'https://eu.acsbapp.com/apps/app/locales/it.json',
];
for (const u of candidates) {
  try {
    const body = await get(u);
    if (body.length > 100 && !body.includes('<!DOCTYPE')) {
      fs.writeFileSync('tools/acsb-it.json', body);
      console.log('saved', u, body.length);
      break;
    }
  } catch (_) {}
}