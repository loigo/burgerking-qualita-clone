'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/store/cart';
import { trackViewContent } from '@/lib/tracking/events';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const meta = product.metadata_json ? JSON.parse(product.metadata_json) : {};

  useEffect(() => {
    trackViewContent({
      id: String(product.id),
      name: product.title,
      price: product.price_cents / 100,
    });
  }, [product]);

  return (
    <>
      <div className="testata-scheda-wrap">
        <div className="container-1600 product-detail-hero">
          <h1 className="testata-title">{product.title}</h1>
          <div className="text-center">
            <img
              src={product.main_image_url || product.thumb_url || ''}
              alt={product.title}
              className="product-hero-img mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container-1600 py-8 max-w-3xl mx-auto text-center">
        <p className="text-xl mb-4" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
        <p className="text-2xl font-bold text-bk-red mb-6">{formatPrice(product.price_cents)}</p>
        <button
          type="button"
          className="btn-main"
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
      {meta.ingredienti?.length > 0 && (
        <section className="container-1600 pb-10">
          <h2 className="text-center text-2xl font-bold mb-6">Ingredienti</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {meta.ingredienti.map((ing: string) => (
              <div key={ing} className="text-center w-28">
                <div className="font-semibold text-sm">{ing}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      {meta.allergeni?.length > 0 && (
        <section className="container-1600 pb-12">
          <h2 className="text-center text-2xl font-bold mb-6">Allergeni</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {meta.allergeni.map((a: { label: string; image: string }) => (
              <div key={a.label} className="text-center">
                <img src={a.image} alt={a.label} width={48} height={48} />
                <div className="text-sm mt-1">{a.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}