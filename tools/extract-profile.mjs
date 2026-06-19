import fs from 'fs';
const h = fs.readFileSync('tools/acsw-panel-shadow.html', 'utf8');
const idx = h.indexOf('profile-seizures');
console.log(h.slice(idx - 50, idx + 2500));
const footerIdx = h.indexOf('footer');
console.log('\n---FOOTER---\n', h.slice(footerIdx, footerIdx + 1500));