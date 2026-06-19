'use client';

import { useState } from 'react';
import { orderStatusClass, orderStatusLabel } from '@/lib/order-status';

type Props = {
  orderId: string;
  status: string;
};

export function OrderStatusActions({ orderId, status: initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function markShipped() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shipped' }),
      });
      if (res.ok) setStatus('shipped');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`admin-badge ${orderStatusClass(status)}`}>
        {orderStatusLabel(status)}
      </span>
      {status === 'paid' && (
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          onClick={markShipped}
          disabled={loading}
        >
          {loading ? '...' : 'Segna Inviato'}
        </button>
      )}
    </div>
  );
}