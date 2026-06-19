import https from 'https';
import fs from 'fs';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        get(new URL(r.headers.location, url).href).then(resolve).catch(reject);
        return;
      }
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => resolve({ status: r.statusCode, body: d, type: r.headers['content-type'] }));
    }).on('error', reject);
  });
}

const urls = [
  'https://eu.acsbapp.com/apps/app/dist/css/app.css',
  'https://eu.acsbapp.com/apps/app/dist/css/main.css',
  'https://eu.acsbapp.com/apps/app/dist/css/acsb.css',
  'https://cdn.acsbapp.com/apps/app/dist/css/app.css',
  'https://embeds.acswapp.com/accessibility/check.js?site=www.burgerking.it',
];
for (const u of urls) {
  try {
    const r = await get(u);
    console.log(u, r.status, r.type, r.body.length);
    if (r.body.length > 500 && r.status === 200) {
      const name = u.split('/').pop().split('?')[0];
      fs.writeFileSync(`tools/${name}`, r.body.slice(0, 200000));
    }
  } catch (e) {
    console.log(u, 'ERR', e.message);
  }
}