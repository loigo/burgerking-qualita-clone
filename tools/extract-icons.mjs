import fs from 'fs';
const h = fs.readFileSync('tools/acsw-panel-shadow.html', 'utf8');
const classes = ['profile-seizures', 'profile-vision', 'profile-adhd', 'profile-cognitive', 'profile-motor', 'profile-blind', 'profile-senior'];
const out = {};
for (const cls of classes) {
  const re = new RegExp('class="profile ' + cls + '[^"]*"[^>]*>[\\s\\S]*?profile-content__icon">(<svg[\\s\\S]*?</svg>)');
  const m = h.match(re);
  out[cls] = m ? m[1].slice(0, 1200) : null;
}
fs.writeFileSync('tools/acsw-icons.json', JSON.stringify(out, null, 2));
console.log(Object.keys(out).map((k) => k + ':' + (out[k]?.length || 0)).join('\n'));