import type { CartItem } from './types';
import { getOrCreateSessionId } from './session-id';

let timer: ReturnType<typeof setTimeout> | null = null;

export function syncAbandonedCart(items: CartItem[], email?: string) {
  if (typeof window === 'undefined' || items.length === 0) return;

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const total = items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0);
    fetch('/api/cart/abandoned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getOrCreateSessionId(),
        email,
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          quantity: i.quantity,
          unit_price_cents: i.unit_price_cents,
        })),
        total_cents: total,
      }),
    }).catch(() => {});
  }, 1500);
}