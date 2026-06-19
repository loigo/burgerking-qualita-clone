import { listProducts } from '@/lib/db';
import { ProductCard } from '@/components/shop/ProductCard';

const NOVITA_SLUGS = [
  'italian_summer_king',
  'bacon_king',
  'crazy_cheese_chicken_bbq',
  'big_king_xxl',
  'whopper',
];

export default async function NovitaPage() {
  const all = await listProducts();
  const novita = all.filter((p) => p.is_featured || NOVITA_SLUGS.includes(p.slug));

  return (
    <div className="container-1600 py-8">
      <h1 className="titolo-section text-center mb-4">Novità</h1>
      <p className="text-center text-lg max-w-2xl mx-auto mb-8">
        Scopri le ultime novità Burger King Italia — Italian Summer King, Bacon King e molto altro.
      </p>
      <div className="product-grid-prodotti">
        {novita.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}