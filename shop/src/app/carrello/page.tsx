'use client';

import Link from 'next/link';
import { useCart } from '@/store/cart';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export default function CarrelloPage() {
  const items = useCart((s) => s.items);
  const totalCents = useCart((s) => s.totalCents());
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <div className="container-1600 py-8">
      <h1 className="titolo-section text-center mb-8">Carrello</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p>Il carrello è vuoto.</p>
          <Link href="/prodotti" className="btn-main mt-6">Scopri i prodotti</Link>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              {item.thumb_url && <img src={item.thumb_url} alt={item.title} />}
              <div className="flex-grow">
                <Link href={`/prodotti/${item.slug}`} className="font-bold text-bk-brown">
                  {item.title}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    className="btn-main-outline"
                    style={{ padding: '0.25rem 0.6rem' }}
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="btn-main-outline"
                    style={{ padding: '0.25rem 0.6rem' }}
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="text-bk-red ml-2"
                    style={{ background: 'none', border: 0, cursor: 'pointer' }}
                    onClick={() => removeItem(item.productId)}
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
              <div className="font-bold">{formatPrice(item.unit_price_cents * item.quantity)}</div>
            </div>
          ))}
          <div className="text-right mt-6">
            <p className="text-2xl font-bold">Totale: {formatPrice(totalCents)}</p>
            <Link href="/checkout" className="btn-main mt-4">
              Procedi al checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}