import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { PromocoesClient } from './PromocoesClient';

export default function PromocoesPage() {
  return (
    <div>
      <AdminPageHeader
        title="Promoções"
        subtitle="Códigos de desconto e campanhas promocionais."
        actions={
          <Link href="/admin/campanhas" className="admin-btn admin-btn-secondary">
            Campanhas
          </Link>
        }
      />
      <PromocoesClient />
    </div>
  );
}