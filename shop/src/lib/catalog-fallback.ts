/**
 * Catálogo offline (166 produtos) quando Azure SQL não está configurado.
 * Fonte: ../js/prodotti-catalog.js do clone Fase 1
 */
import type { Product } from './types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const path = require('path');

let cache: Product[] | null = null;

function loadCatalog(): Product[] {
  if (cache) return cache;
  try {
    const p = path.join(process.cwd(), '..', 'js', 'prodotti-catalog.js');
    const raw = fs.readFileSync(p, 'utf8');
    const json = raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '');
    const catalog = JSON.parse(json);
    const bySlug = new Map<string, Product>();
    let id = 1;
    const prices: Record<string, number> = {
      italian_summer_king: 899,
      bacon_king: 899,
      crazy_cheese_chicken_bbq: 849,
    };
    catalog.categories.forEach((cat: { key: string; products: Array<Record<string, string>> }) => {
      cat.products.forEach((p) => {
        if (!bySlug.has(p.slug)) {
          bySlug.set(p.slug, {
            id: id++,
            slug: p.slug,
            title: p.title,
            description: p.description || null,
            thumb_url: p.thumb,
            main_image_url: p.main,
            hero_image_url: p.hero,
            price_cents: prices[p.slug] || 699,
            currency: 'EUR',
            is_active: true,
            is_featured: ['italian_summer_king', 'bacon_king', 'crazy_cheese_chicken_bbq'].includes(p.slug),
            metadata_json: JSON.stringify({ ingredienti: p.ingredienti, allergeni: p.allergeni }),
            categories: [cat.key],
          });
        } else {
          const ex = bySlug.get(p.slug)!;
          if (!ex.categories?.includes(cat.key)) ex.categories!.push(cat.key);
        }
      });
    });
    cache = [...bySlug.values()];
    return cache;
  } catch {
    cache = [];
    return cache;
  }
}

export function getFallbackProducts(category?: string): Product[] {
  const all = loadCatalog();
  if (!category) return all.filter((p) => p.is_active);
  return all.filter((p) => p.is_active && p.categories?.includes(category));
}

export function getFallbackProduct(slug: string): Product | null {
  return loadCatalog().find((p) => p.slug === slug) || null;
}