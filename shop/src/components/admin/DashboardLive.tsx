'use client';

import { useEffect, useState } from 'react';
import type { DashboardStats } from '@/lib/admin-stats-shared';
import { formatEur, pctChange } from '@/lib/admin-stats-shared';
import { SalesChart, ProductChart } from './AdminCharts';

type LiveData = DashboardStats & { onlineUsers: number; timestamp: string };
type Reports = {
  byDay: Array<{ day: string; revenue_cents: number; order_count: number }>;
  byProduct: Array<{ product_title: string; revenue_cents: number; qty_sold: number }>;
};

export function DashboardLive({ initial }: { initial: DashboardStats }) {
  const [live, setLive] = useState<LiveData>({ ...initial, onlineUsers: 0, timestamp: '' });
  const [reports, setReports] = useState<Reports | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const [dashRes, repRes] = await Promise.all([
          fetch('/api/admin/dashboard/live'),
          fetch('/api/admin/reports'),
        ]);
        if (dashRes.ok) setLive(await dashRes.json());
        if (repRes.ok) setReports(await repRes.json());
      } catch {
        // silent
      }
    }
    poll();
    const id = setInterval(poll, 15_000);
    return () => clearInterval(id);
  }, []);

  const change = pctChange(live.salesTodayCents, live.salesYesterdayCents);

  return (
    <>
      <div className="admin-kpi-grid">
        <article className="admin-kpi-card">
          <div className="admin-kpi-card-head">
            <span className="admin-kpi-label">Vendas Hoje</span>
            <span className="admin-live-dot" title="Atualização ao vivo" />
          </div>
          <div className="admin-kpi-value">{formatEur(live.salesTodayCents)}</div>
          <div className={`admin-kpi-meta ${change >= 0 ? 'up' : 'down'}`}>
            {change >= 0 ? '+' : ''}
            {change}% vs ontem · {live.ordersToday} pedidos
          </div>
        </article>

        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Carrinhos Abandonados</span>
          <div className="admin-kpi-value">{live.abandonedCarts}</div>
          <div className="admin-kpi-meta">
            {formatEur(live.abandonedCartsValueCents)} em potencial
          </div>
        </article>

        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Usuários Online</span>
          <div className="admin-kpi-value">{live.onlineUsers}</div>
          <div className="admin-kpi-meta">Últimos 5 minutos</div>
        </article>

        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Vendas do Mês</span>
          <div className="admin-kpi-value">{formatEur(live.salesMonthCents)}</div>
          <div className="admin-kpi-meta">{live.ordersMonth} pedidos</div>
        </article>

        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Produtos Ativos</span>
          <div className="admin-kpi-value">{live.productsActive}</div>
          <div className="admin-kpi-meta">de {live.productsTotal} no catálogo</div>
        </article>

        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Fonte de Dados</span>
          <div className="admin-kpi-value" style={{ fontSize: '1.15rem' }}>
            {live.dbConnected ? 'SQL Server' : 'Memória'}
          </div>
          <div className="admin-kpi-meta">{live.database}</div>
        </article>
      </div>

      {reports && (
        <div className="admin-charts-grid">
          <section className="admin-section">
            <h2 className="admin-section-title">Vendas por dia</h2>
            <SalesChart data={reports.byDay} />
          </section>
          <section className="admin-section">
            <h2 className="admin-section-title">Top produtos</h2>
            <ProductChart data={reports.byProduct} />
          </section>
        </div>
      )}
    </>
  );
}