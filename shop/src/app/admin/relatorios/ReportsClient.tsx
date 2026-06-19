'use client';

import { useEffect, useState } from 'react';
import { SalesChart, ProductChart } from '@/components/admin/AdminCharts';

type ReportData = {
  byDay: Array<{ day: string; revenue_cents: number; order_count: number }>;
  byProduct: Array<{ product_title: string; revenue_cents: number; qty_sold: number }>;
};

export function ReportsClient() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch('/api/admin/reports').then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return <p className="admin-page-sub">Carregando relatórios…</p>;
  }

  return (
    <div className="admin-charts-grid">
      <section className="admin-section">
        <h2 className="admin-section-title">Vendas por dia</h2>
        <SalesChart data={data.byDay} />
      </section>
      <section className="admin-section">
        <h2 className="admin-section-title">Produtos mais vendidos</h2>
        <ProductChart data={data.byProduct} />
      </section>
    </div>
  );
}