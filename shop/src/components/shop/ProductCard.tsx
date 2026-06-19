'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/store/cart';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <div className="col-prodotto">
      <Link href={`/prodotti/${product.slug}`} className="no-decoration">
        <div className="card-prod text-center">
          <div className="div-img-card-prod">
            {product.thumb_url && (
              <img src={product.thumb_url} alt={product.title} className="img-card-prod" loading="lazy" />
            )}
          </div>
          <div className="card-prod-title">{product.title}</div>
          <div className="card-prod-price">{formatPrice(product.price_cents)}</div>
        </div>
      </Link>
      <button
        type="button"
        className="btn-add-cart"
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            title: product.title,
            thumb_url: product.thumb_url,
            unit_price_cents: product.price_cents,
          })
        }
      >
        Aggiungi al carrello
      </button>
    </div>
  );
}