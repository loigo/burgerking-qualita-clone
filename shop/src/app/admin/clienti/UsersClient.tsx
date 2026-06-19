'use client';

import { useEffect, useState } from 'react';

type User = {
  email: string;
  order_count: number;
  total_spent_cents: number;
  last_order_at?: string;
};

function formatEur(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = users.reduce((s, u) => s + u.total_spent_cents, 0);

  if (loading) {
    return <p className="admin-page-sub">Carregando clientes…</p>;
  }

  return (
    <>
      <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '1.5rem' }}>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Total de clientes</span>
          <div className="admin-kpi-value">{users.length}</div>
        </article>
        <article className="admin-kpi-card">
          <span className="admin-kpi-label">Valor total gasto</span>
          <div className="admin-kpi-value">{formatEur(totalSpent)}</div>
        </article>
      </div>

      {users.length === 0 ? (
        <div className="admin-section admin-empty">
          Nenhum cliente ainda — faça um checkout de teste na loja.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Pedidos</th>
                <th>Total gasto</th>
                <th>Último pedido</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td>{u.email}</td>
                  <td>{u.order_count}</td>
                  <td>{formatEur(u.total_spent_cents)}</td>
                  <td>
                    {u.last_order_at
                      ? new Date(u.last_order_at).toLocaleDateString('it-IT')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}