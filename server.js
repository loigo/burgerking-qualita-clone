const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

const ALIASES = {
  '/franchising': 'franchising.html',
  '/franchising/franchising-di-successo': 'franchising/franchising-di-successo/index.html',
  '/franchising/come-aprire': 'franchising/come-aprire/index.html',
  '/franchising/investire-nel-franchising': 'franchising/investire-nel-franchising/index.html',
  '/franchising/diventare-franchisee': 'franchising/diventare-franchisee/index.html',
  '/franchising/cultura-aziendale': 'franchising/cultura-aziendale/index.html',
  '/franchising/faq': 'franchising/faq/index.html',
  '/franchising/contattaci': 'franchising/contattaci/index.html',
  '/franchising/manda-application': 'franchising/manda-application/index.html',
  '/franchising/perche-burger-king-e-competitivo': 'franchising/perche-burger-king-e-competitivo/index.html',
  '/franchising/processo-selezione-franchisee': 'franchising/processo-selezione-franchisee/index.html',
  '/franchising/eventi-informativi': 'franchising/eventi-informativi/index.html',
  '/franchising/migliori-franchisee': 'franchising/migliori-franchisee/index.html',
  '/franchising/migliori-franchisee/maria_anna_melis_rosa_falcone': 'franchising/migliori-franchisee/maria_anna_melis_rosa_falcone/index.html',
  '/franchising/migliori-franchisee/alessandro_carcione': 'franchising/migliori-franchisee/alessandro_carcione/index.html',
  '/franchising/migliori-franchisee/federico_arsego': 'franchising/migliori-franchisee/federico_arsego/index.html',
  '/franchising/franchising-ristorazione': 'franchising/franchising-ristorazione/index.html',
  '/trova-un-ristorante': 'trova-un-ristorante.html',
  '/accessibilita': 'accessibilita.html',
  '/prodotti': 'prodotti.html',
};

function resolveFile(urlPath) {
  let clean = urlPath.split('?')[0];
  if (clean === '/' || clean === '') return path.join(ROOT, 'index.html');

  if (ALIASES[clean]) {
    return path.join(ROOT, ALIASES[clean]);
  }

  if (clean.startsWith('/prodotti/')) {
    const parts = clean.split('/').filter(Boolean);
    if (parts[0] === 'prodotti') {
      if (parts[1] === 'dettaglio' && parts[2]) {
        return path.join(ROOT, 'prodotti', 'dettaglio.html');
      }
      if (parts.length >= 3) {
        return path.join(ROOT, 'prodotti', 'dettaglio.html');
      }
      return path.join(ROOT, 'prodotti.html');
    }
  }

  let filePath = path.join(ROOT, clean);

  if (clean.endsWith('/')) {
    return path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    return path.join(filePath, 'index.html');
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});