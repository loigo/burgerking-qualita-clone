'use client';

type Item = { id: string; name: string; price?: number; quantity?: number };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackPageView() {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', 'PageView');
  window.dataLayer?.push({ event: 'page_view' });
}

export function trackViewContent(product: { id: string; name: string; price: number }) {
  window.fbq?.('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'EUR',
  });
  window.dataLayer?.push({
    event: 'view_item',
    ecommerce: {
      currency: 'EUR',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    },
  });
}

export function trackAddToCart(product: Item) {
  window.fbq?.('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: (product.price || 0) * (product.quantity || 1),
    currency: 'EUR',
  });
  window.dataLayer?.push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'EUR',
      value: (product.price || 0) * (product.quantity || 1),
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
      }],
    },
  });
}

export function trackRemoveFromCart(product: Pick<Item, 'id' | 'name'>) {
  window.dataLayer?.push({
    event: 'remove_from_cart',
    ecommerce: { items: [{ item_id: product.id, item_name: product.name }] },
  });
}

export function trackInitiateCheckout(value: number, items: Item[]) {
  window.fbq?.('track', 'InitiateCheckout', { value, currency: 'EUR', num_items: items.length });
  window.dataLayer?.push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'EUR',
      value,
      items: items.map((i) => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    },
  });
}

export function trackPurchase(order: {
  orderId: string;
  value: number;
  items: Item[];
}) {
  window.fbq?.('track', 'Purchase', {
    value: order.value,
    currency: 'EUR',
    content_ids: order.items.map((i) => i.id),
    content_type: 'product',
    num_items: order.items.reduce((s, i) => s + (i.quantity || 1), 0),
  });
  window.dataLayer?.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: order.orderId,
      currency: 'EUR',
      value: order.value,
      items: order.items.map((i) => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    },
  });
}