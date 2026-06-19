import Link from 'next/link';
import { adminListProducts } from '@/lib/db';
import { getDbStatus } from '@/lib/db-status';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DbStatusBanner } from '@/components/admin/DbStatusBanner';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export default async function AdminProdottiPage() {
  const [products, dbStatus] = await Promise.all([adminListProducts(), getDbStatus()]);

  return (
    <div>
      <AdminPageHeader
        title="Prodotti"
        subtitle={`${products.length} produtos no catálogo · ${products.filter((p) => p.is_active).length} ativos`}
        actions={
          <Link href="/admin/prodotti/nuovo" className="admin-btn admin-btn-primary">
            + Novo produto
          </Link>
        }
      />

      {!dbStatus.connected && <DbStatusBanner status={dbStatus} />}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Slug</th>
              <th>Preço</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td><code>{p.slug}</code></td>
                <td>{formatPrice(p.price_cents)}</td>
                <td>
                  <span className={`admin-badge ${p.is_active ? 'on' : 'off'}`}>
                    {p.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/prodotti/${p.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}