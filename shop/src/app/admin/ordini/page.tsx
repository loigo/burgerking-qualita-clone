import Link from 'next/link';
import { formatEur, getDashboardStats } from '@/lib/admin-stats';
import { getDbStatus } from '@/lib/db-status';
import { listOrders } from '@/lib/db';
import { getMemoryOrders } from '@/lib/orders';
import { orderStatusClass, orderStatusLabel } from '@/lib/order-status';
import { OrderStatusActions } from '@/components/admin/OrderStatusActions';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DbStatusBanner } from '@/components/admin/DbStatusBanner';

function formatDate(d: string | Date) {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(d));
}

export default async function OrdiniPage() {
  const [stats, dbStatus] = await Promise.all([getDashboardStats(), getDbStatus()]);
  let orders: Array<Record<string, unknown>> = [];

  if (dbStatus.connected) {
    try {
      orders = await listOrders(100);
    } catch {
      orders = [];
    }
  } else {
    orders = getMemoryOrders().map((o) => ({
      id: o.id,
      order_number: o.order_number,
      email: o.email,
      status: o.status,
      total_cents: o.total_cents,
      currency: 'EUR',
      payment_provider: o.payment_provider,
      created_at: o.created_at,
      paid_at: o.paid_at || null,
      item_count: o.items.length,
    }));
  }

  return (
    <div>
      <AdminPageHeader
        title="Ordini"
        subtitle={`${stats.ordersMonth} pedidos este mês · ${formatEur(stats.salesMonthCents)} em vendas`}
        actions={
          <Link href="/checkout" target="_blank" className="admin-btn admin-btn-secondary">
            Novo checkout teste
          </Link>
        }
      />

      {!dbStatus.connected && <DbStatusBanner status={dbStatus} />}

      {orders.length === 0 ? (
        <div className="admin-section admin-empty">
          <p>Nenhum pedido ainda.</p>
          <Link href="/checkout" target="_blank" className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }}>
            Fazer checkout de teste
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Email</th>
                <th>Total</th>
                <th>Pagamento</th>
                <th>Itens</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={String(o.id)}>
                  <td><code>{String(o.order_number)}</code></td>
                  <td>{String(o.email)}</td>
                  <td>{formatEur(Number(o.total_cents), String(o.currency || 'EUR'))}</td>
                  <td>{String(o.payment_provider || '—')}</td>
                  <td>{Number(o.item_count ?? 0)}</td>
                  <td>
                    <OrderStatusActions orderId={String(o.id)} status={String(o.status)} />
                  </td>
                  <td>{formatDate(String(o.paid_at || o.created_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="admin-section" style={{ marginTop: '1.25rem' }}>
        <h2 className="admin-section-title">Legenda</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(['pending', 'paid', 'shipped', 'failed'] as const).map((s) => (
            <span key={s} className={`admin-badge ${orderStatusClass(s)}`}>
              {orderStatusLabel(s)}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}