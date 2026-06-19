import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UsersClient } from './UsersClient';

export default function ClientiPage() {
  return (
    <div>
      <AdminPageHeader
        title="Clienti"
        subtitle="Clientes que fizeram pedidos — dados agregados por email."
      />
      <UsersClient />
    </div>
  );
}