'use client';

import { useEffect, useState } from 'react';

type OrderData = {
  order_number: string;
  email: string;
  status: string;
  total_cents: number;
  currency: string;
  payment_provider: string;
  created_at: string;
  paid_at: string | null;
  items: Array<{
    title: string;
    slug: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
  }>;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'In attesa di pagamento',
  paid: 'Pagato',
  shipped: 'Inviato',
  failed: 'Pagamento fallito',
};

function formatPrice(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(cents / 100);
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('it-IT', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(d));
}

export function OrderDetails({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <p className="mt-4 text-sm">Caricamento dettagli ordine...</p>;
  if (notFound || !order) return null;

  return (
    <div className="order-details max-w-lg mx-auto mt-8 text-left">
      <div className="order-details-header">
        <p><strong>Numero:</strong> <code>{order.order_number}</code></p>
        <p><strong>Stato:</strong> {STATUS_LABELS[order.status] || order.status}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Pagamento:</strong> {order.payment_provider || '—'}</p>
        <p><strong>Data:</strong> {formatDate(order.paid_at || order.created_at)}</p>
      </div>
      <table className="order-details-table mt-4 w-full">
        <thead>
          <tr>
            <th className="text-left">Prodotto</th>
            <th>Qty</th>
            <th className="text-right">Totale</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.slug}>
              <td>{item.title}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">{formatPrice(item.line_total_cents, order.currency)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="font-bold pt-2">Totale</td>
            <td className="text-right font-bold pt-2">{formatPrice(order.total_cents, order.currency)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}