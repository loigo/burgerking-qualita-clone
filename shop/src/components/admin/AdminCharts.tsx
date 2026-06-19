'use client';

type DayPoint = { day: string; revenue_cents: number; order_count: number };
type ProductPoint = { product_title: string; revenue_cents: number; qty_sold: number };

function formatEur(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100);
}

export function SalesChart({ data }: { data: DayPoint[] }) {
  const max = Math.max(...data.map((d) => d.revenue_cents), 1);
  if (data.length === 0) {
    return <p className="admin-chart-empty">Nessun dato vendite — effettua un checkout di test.</p>;
  }
  return (
    <div className="admin-chart-bars">
      {data.map((d) => (
        <div key={d.day} className="admin-chart-bar-col" title={`${d.day}: ${formatEur(d.revenue_cents)}`}>
          <div
            className="admin-chart-bar"
            style={{ height: `${Math.max(8, (d.revenue_cents / max) * 100)}%` }}
          />
          <span className="admin-chart-label">{d.day.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductChart({ data }: { data: ProductPoint[] }) {
  const max = Math.max(...data.map((d) => d.revenue_cents), 1);
  if (data.length === 0) {
    return <p className="admin-chart-empty">Nessun prodotto venduto ancora.</p>;
  }
  return (
    <div className="admin-product-chart">
      {data.map((d) => (
        <div key={d.product_title} className="admin-product-row">
          <span className="admin-product-name">{d.product_title}</span>
          <div className="admin-product-bar-wrap">
            <div
              className="admin-product-bar"
              style={{ width: `${(d.revenue_cents / max) * 100}%` }}
            />
          </div>
          <span className="admin-product-val">{formatEur(d.revenue_cents)}</span>
        </div>
      ))}
    </div>
  );
}