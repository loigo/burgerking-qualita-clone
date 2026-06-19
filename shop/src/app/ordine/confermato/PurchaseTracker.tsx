'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/tracking/events';

export function PurchaseTracker({ orderNumber }: { orderNumber: string }) {
  useEffect(() => {
    if (!orderNumber) return;
    const stored = sessionStorage.getItem('bk-last-purchase');
    if (!stored) {
      trackPurchase({ orderId: orderNumber, value: 0, items: [] });
      sessionStorage.setItem('bk-last-purchase', orderNumber);
    }
  }, [orderNumber]);

  return null;
}