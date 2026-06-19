import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ReportsClient } from './ReportsClient';

export default function RelatoriosPage() {
  return (
    <div>
      <AdminPageHeader
        title="Relatórios"
        subtitle="Vendas por dia e desempenho por produto — últimos 14 dias."
      />
      <ReportsClient />
    </div>
  );
}