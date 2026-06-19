'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  orderNumber: string;
  provider?: string;
};

export function OrderConfirmPoller({ orderNumber, provider }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState('Verifica pagamento in corso...');

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = provider === 'satispay' ? 30 : 10;

    async function poll() {
      if (cancelled || attempts >= maxAttempts) {
        if (!cancelled && attempts >= maxAttempts) {
          setMessage('Pagamento in elaborazione. Controlla la email o riprova tra poco.');
        }
        return;
      }
      attempts++;
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'paid') {
          setMessage('');
          router.refresh();
          return;
        }
        if (data.status === 'failed') {
          router.push(`/ordine/fallito?order=${encodeURIComponent(orderNumber)}`);
          return;
        }
        const paymentId = sessionStorage.getItem(`bk-satispay-${orderNumber}`);
        if (provider === 'satispay' && paymentId) {
          await fetch('/api/checkout/satispay/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_id: paymentId }),
          });
        }
      } catch {
        // retry
      }
      setTimeout(poll, 2000);
    }

    poll();
    return () => { cancelled = true; };
  }, [orderNumber, provider, router]);

  if (!message) return null;
  return <p className="mt-4 text-sm text-gray-600">{message}</p>;
}