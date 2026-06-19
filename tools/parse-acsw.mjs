import fs from 'fs';
const h = fs.readFileSync('tools/acsw-panel-shadow.html', 'utf8');
const profiles = [...h.matchAll(/class="profile profile-([^"]+)"/g)].map((m) => m[1]);
const names = [...h.matchAll(/profile-content__name">([^<]+)/g)].map((m) => m[1]);
const descs = [...h.matchAll(/profile-content__text">([^<]+)/g)].map((m) => m[1]);
console.log(JSON.stringify({ profiles, names, descs }, null, 2));