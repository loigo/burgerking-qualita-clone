import fs from 'fs';

const html = fs.readFileSync('source-prodotti.html', 'utf8');
const start = html.indexOf("var dati_pagina = JSON.parse('");
if (start < 0) throw new Error('dati_pagina not found');
let i = start + "var dati_pagina = JSON.parse('".length;
let raw = '';
while (i < html.length) {
  const ch = html[i];
  if (ch === '\\' && html[i + 1] === "'") {
    raw += "'";
    i += 2;
    continue;
  }
  if (ch === "'") break;
  if (ch === '\\' && html[i + 1] === 'u') {
    raw += JSON.parse('"' + html.slice(i, i + 6) + '"');
    i += 6;
    continue;
  }
  if (ch === '\\' && html[i + 1] === '/') {
    raw += '/';
    i += 2;
    continue;
  }
  if (ch === '\\') {
    raw += html[i + 1];
    i += 2;
    continue;
  }
  raw += ch;
  i += 1;
}

const data = JSON.parse(raw);
fs.writeFileSync('tools/prodotti-dati-pagina.json', JSON.stringify(data, null, 2));
console.log('keys:', Object.keys(data));
console.log('prodotti menu items:', data.prodotti?.length || Object.keys(data.prodotti || {}).length);
if (Array.isArray(data.prodotti)) {
  data.prodotti.forEach((cat) => {
    const prods = cat.prodotti ? Object.values(cat.prodotti) : [];
    console.log(cat.chiave || cat.title, prods.length);
  });
}