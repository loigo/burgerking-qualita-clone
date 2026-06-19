import Link from 'next/link';
import type { DashboardStats } from '@/lib/admin-stats-shared';
import type { DbStatus } from '@/lib/db-status';
import { AdminPageHeader } from './AdminPageHeader';
import { DbStatusBanner } from './DbStatusBanner';
import { DashboardLive } from './DashboardLive';

type Props = { stats: DashboardStats; dbStatus: DbStatus };

export function DashboardView({ stats, dbStatus }: Props) {
  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Visão geral da loja — vendas, carrinhos e tráfego em tempo real."
      />

      <DbStatusBanner status={dbStatus} />

      <DashboardLive initial={stats} />

      <section className="admin-section">
        <div className="admin-section-head">
          <h2 className="admin-section-title">Acesso rápido</h2>
        </div>
        <div className="admin-quick-links">
          <Link href="/admin/prodotti" className="admin-btn admin-btn-secondary">Prodotti</Link>
          <Link href="/admin/ordini" className="admin-btn admin-btn-secondary">Ordini</Link>
          <Link href="/admin/pagamentos" className="admin-btn admin-btn-secondary">Pagamentos</Link>
          <Link href="/admin/campanhas" className="admin-btn admin-btn-secondary">Campanhas</Link>
          <Link href="/admin/relatorios" className="admin-btn admin-btn-secondary">Relatórios</Link>
        </div>
      </section>
    </div>
  );
}