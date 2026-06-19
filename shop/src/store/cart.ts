'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/tracking/events';
import { syncAbandonedCart } from '@/lib/cart-sync';

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
  totalCents: () => number;
  itemCount: () => number;
};

function afterCartChange(items: CartItem[]) {
  syncAbandonedCart(items);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const items = existing
            ? state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
              )
            : [...state.items, { ...item, quantity: qty }];
          trackAddToCart({
            id: String(item.productId),
            name: item.title,
            price: item.unit_price_cents / 100,
            quantity: qty,
          });
          afterCartChange(items);
          return { items };
        });
      },
      removeItem: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item) trackRemoveFromCart({ id: String(productId), name: item.title });
        set((state) => {
          const items = state.items.filter((i) => i.productId !== productId);
          afterCartChange(items);
          return { items };
        });
      },
      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => {
          const items = state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
          afterCartChange(items);
          return { items };
        });
      },
      clear: () => set({ items: [] }),
      totalCents: () => get().items.reduce((s, i) => s + i.unit_price_cents * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'bk-cart',
      onRehydrateStorage: () => (state) => {
        if (state?.items?.length) afterCartChange(state.items);
      },
    }
  )
);