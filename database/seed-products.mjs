/**
 * Seed produtos a partir do catálogo burgerking.it (js/prodotti-catalog.js)
 * Uso: node database/seed-products.mjs > database/seed-data.sql
 * Ou com DATABASE_URL: node database/seed-products.mjs --execute
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, '../js/prodotti-catalog.js');
const raw = fs.readFileSync(catalogPath, 'utf8');
const json = raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '');
const catalog = JSON.parse(json);

const DEFAULT_PRICES = {
  italian_summer_king: 899,
  the_parmigiano_reggiano_burger_: 949,
  bacon_king_compact: 799,
  bacon_king: 899,
  crazy_cheese_chicken_bbq: 849,
  chicken_krispper: 799,
};

function esc(s) {
  return (s || '').replace(/'/g, "''");
}

function priceFor(slug) {
  return DEFAULT_PRICES[slug] || 699 + (slug.length % 5) * 50;
}

const lines = ['-- Auto-generated seed', 'BEGIN TRANSACTION;', ''];

catalog.categories.forEach((cat, i) => {
  lines.push(
    `IF NOT EXISTS (SELECT 1 FROM categories WHERE [key] = N'${esc(cat.key)}')` +
    ` INSERT INTO categories ([key], title, description, image_url, sort_order) VALUES` +
    ` (N'${esc(cat.key)}', N'${esc(cat.title)}', N'${esc(cat.description)}', N'${esc(cat.image)}', ${i});`
  );
});

const seen = new Set();
catalog.categories.forEach((cat) => {
  cat.products.forEach((p) => {
    if (seen.has(p.slug)) return;
    seen.add(p.slug);
    const meta = JSON.stringify({
      ingredienti: p.ingredienti || [],
      allergeni: p.allergeni || [],
    }).replace(/'/g, "''");
    const featured = ['italian_summer_king', 'bacon_king', 'crazy_cheese_chicken_bbq'].includes(p.slug) ? 1 : 0;
    lines.push(
      `IF NOT EXISTS (SELECT 1 FROM products WHERE slug = N'${esc(p.slug)}')` +
      ` INSERT INTO products (slug, title, description, thumb_url, main_image_url, hero_image_url, price_cents, is_featured, metadata_json)` +
      ` VALUES (N'${esc(p.slug)}', N'${esc(p.title)}', N'${esc(p.description)}', N'${esc(p.thumb)}', N'${esc(p.main)}', N'${esc(p.hero)}', ${priceFor(p.slug)}, ${featured}, N'${meta}');`
    );
  });
});

catalog.categories.forEach((cat) => {
  cat.products.forEach((p) => {
    lines.push(
      `INSERT INTO product_categories (product_id, category_id)` +
      ` SELECT p.id, c.id FROM products p, categories c` +
      ` WHERE p.slug = N'${esc(p.slug)}' AND c.[key] = N'${esc(cat.key)}'` +
      ` AND NOT EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id AND pc.category_id = c.id);`
    );
  });
});

lines.push('COMMIT;', '');
const sql = lines.join('\n');
fs.writeFileSync(path.join(__dirname, 'seed-data.sql'), sql);
console.log('-- Written database/seed-data.sql');
console.log('-- Products:', seen.size, '| Categories:', catalog.categories.length);

if (process.argv.includes('--execute') && process.env.DATABASE_URL) {
  const sqlModule = await import('mssql');
  const pool = await sqlModule.default.connect(process.env.DATABASE_URL);
  await pool.request().batch(sql);
  console.log('Seed executed on Azure SQL');
  await pool.close();
}