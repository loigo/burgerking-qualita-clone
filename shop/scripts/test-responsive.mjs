/**
 * Teste responsivo — múltiplos viewports + overflow + menu mobile
 * Uso: node scripts/test-responsive.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Desktop HD', width: 1280, height: 800 },
  { name: 'Desktop XL', width: 1920, height: 1080 },
];

const PAGES = [
  '/',
  '/qualita',
  '/prodotti',
  '/prodotti/bacon_king',
  '/promo',
  '/promo/big_king__bibita_small__snack_small',
  '/carrello',
  '/checkout',
  '/novita',
];

let passed = 0;
let failed = 0;

function ok(msg) {
  passed++;
  console.log(`  ✅ ${msg}`);
}
function fail(msg) {
  failed++;
  console.log(`  ❌ ${msg}`);
}

async function checkNoOverflow(page, label) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 2;
  });
  if (!overflow) ok(`${label} — sem scroll horizontal`);
  else fail(`${label} — scroll horizontal detectado`);
}

async function checkGridColumns(page, selector, expected, label) {
  const cols = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length;
  }, selector);
  if (cols === expected) ok(`${label} — ${cols} colunas`);
  else fail(`${label} — esperado ${expected} colunas, got ${cols}`);
}

async function main() {
  console.log('══════════════════════════════════════════');
  console.log('  TESTE RESPONSIVO — BURGER KING SHOP');
  console.log(`  ${BASE}`);
  console.log('══════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Verificar servidor
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch {
    console.error('❌ Servidor offline. Inicie: npm run start');
    process.exit(1);
  }
  ok('Servidor online');

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 ${vp.name} (${vp.width}×${vp.height})\n`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const path of PAGES) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await checkNoOverflow(page, path);
    }

    // Grid produtos
    await page.goto(`${BASE}/prodotti`, { waitUntil: 'domcontentloaded' });
    const expectedCols = vp.width >= 1200 ? 4 : vp.width >= 768 ? 3 : 2;
    await checkGridColumns(page, '.product-grid-prodotti', expectedCols, 'Grid prodotti');

    // Header responsivo
    const menuToggle = page.locator('.bk-menu-toggle');
    const navDesktop = await page.evaluate(() => {
      const nav = document.querySelector('.bk-nav');
      if (!nav) return false;
      const style = getComputedStyle(nav);
      return style.position === 'static' || style.display === 'flex';
    });

    if (vp.width < 1200) {
      const visible = await menuToggle.isVisible();
      if (visible) ok('Menu hamburger visível em mobile/tablet');
      else fail('Menu hamburger deveria estar visível');
      await menuToggle.click();
      const open = await page.locator('.bk-nav.bk-nav-open').isVisible();
      if (open) ok('Menu mobile abre ao clicar');
      else fail('Menu mobile não abriu');
      await menuToggle.click();
    } else {
      const toggleHidden = !(await menuToggle.isVisible());
      if (toggleHidden) ok('Menu hamburger oculto em desktop');
      else fail('Hamburger visível em desktop');
      const links = await page.locator('.bk-nav .bk-nav-link').count();
      if (links >= 4) ok(`Nav desktop com ${links} links`);
      else fail('Nav desktop incompleto');
    }

    // Título responsivo (não estoura viewport)
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    const titleOverflow = await page.evaluate(() => {
      const h1 = document.querySelector('.titolo-section');
      if (!h1) return false;
      return h1.getBoundingClientRect().width > window.innerWidth;
    });
    if (!titleOverflow) ok('Título principal cabe na tela');
    else fail('Título principal transborda');
  }

  // Checkout grid (precisa de itens no carrinho)
  console.log('\n🛒 Checkout layout\n');
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem(
      'bk-cart',
      JSON.stringify({
        state: {
          items: [{
            productId: 1,
            slug: 'bacon_king',
            title: 'Bacon King',
            thumb_url: 'https://www.burgerking.it/assets/images/products/bacon-king-thumb.png',
            quantity: 1,
            unit_price_cents: 899,
          }],
        },
        version: 0,
      })
    );
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/checkout`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.checkout-grid', { timeout: 10000 });
  await checkGridColumns(page, '.checkout-grid', 2, 'Checkout desktop');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.checkout-grid', { timeout: 10000 });
  await checkGridColumns(page, '.checkout-grid', 1, 'Checkout mobile');

  await browser.close();

  console.log('\n══════════════════════════════════════════');
  console.log(`  RESULTADO: ${passed} passou | ${failed} falhou`);
  console.log('══════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});