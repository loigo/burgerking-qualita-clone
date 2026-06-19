import fs from 'fs';
const h = fs.readFileSync('tools/acsw-panel-shadow.html', 'utf8');
const map = {
  seizures: 'profile-seizures',
  vision: 'profile-vision',
  adhd: 'profile-adhd',
  cognitive: 'profile-cognitive',
  motor: 'profile-motor',
  blind: 'profile-blind',
  senior: 'profile-senior',
};
const out = {};
for (const [key, cls] of Object.entries(map)) {
  const idx = h.indexOf('class="profile ' + cls);
  if (idx < 0) continue;
  const chunk = h.slice(idx, idx + 3500);
  const m = chunk.match(/profile-content__icon">(<svg[\s\S]*?<\/svg>)/);
  out[key] = m ? m[1].replace(/\s+class="[^"]*"/g, '').replace(/\s+data-testid="[^"]*"/g, '').replace(/\s+style="[^"]*"/g, '').replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"\s*/g, '') : null;
}
fs.writeFileSync('tools/acsw-icons-full.json', JSON.stringify(out, null, 2));
for (const k of Object.keys(out)) console.log(k, out[k]?.length);