import { listProducts } from '@/lib/db';
import { ProductCard } from '@/components/shop/ProductCard';
import { AppBanner } from '@/components/marketing/AppBanner';

export const metadata = {
  title: 'Prodotti Burger King: Hamburger e Snack | Burger King Italia',
  description:
    'Hamburger 100% carne di manzo, verdure fresche e partner controllati per assicurarti prodotti sani e gustosi.',
};

const CATEGORIES = [
  { key: '', label: 'Tutti' },
  { key: 'best_seller', label: 'Best Seller' },
  { key: 'italian_kings', label: 'Italian Kings' },
  { key: 'manzo', label: 'Manzo' },
  { key: 'pollo', label: 'Pollo' },
  { key: 'insalate_&_wrap', label: 'Insalate & Wrap' },
  { key: 'king_junior_meal', label: 'King Junior Meal' },
];

export default async function ProdottiPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const cat = searchParams.cat || '';
  const products = await listProducts(cat || undefined);

  return (
    <div className="container-1600 py-8">
      <h1 className="titolo-section text-center mb-8">Prodotti</h1>
      <div className="category-filters">
        {CATEGORIES.map((c) => (
          <a
            key={c.key || 'all'}
            href={c.key ? `/prodotti?cat=${encodeURIComponent(c.key)}` : '/prodotti'}
            className={`btn-tag ${cat === c.key || (!cat && !c.key) ? 'active' : ''}`}
            style={{
              borderRadius: 18,
              padding: '6px 16px',
              border: '2px solid #502314',
              textDecoration: 'none',
              color: cat === c.key || (!cat && !c.key) ? '#F5EBDC' : '#502314',
              background: cat === c.key || (!cat && !c.key) ? '#502314' : 'transparent',
              fontWeight: 600,
            }}
          >
            {c.label}
          </a>
        ))}
      </div>
      <div className="product-grid-prodotti">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <AppBanner />
    </div>
  );
}