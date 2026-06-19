'use client';

import { useEffect, useState } from 'react';

type Promo = {
  id: number;
  code: string;
  title: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  usage_count: number;
};

export function PromocoesClient() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(10);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/admin/promotions');
    if (res.ok) setPromos(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, title, discount_type: 'percent', discount_value: value }),
    });
    setCode('');
    setTitle('');
    await load();
    setLoading(false);
  }

  async function toggle(id: number, active: boolean) {
    await fetch(`/api/admin/promotions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !active }),
    });
    await load();
  }

  return (
    <div>
      <form className="admin-form admin-form-inline" onSubmit={create}>
        <label>Code<input value={code} onChange={(e) => setCode(e.target.value)} required /></label>
        <label>Titolo<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
        <label>% Sconto<input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>Crea</button>
      </form>
      <div className="admin-table-wrap mt-4">
        <table className="admin-table">
          <thead>
            <tr><th>Code</th><th>Titolo</th><th>Sconto</th><th>Usi</th><th>Stato</th><th></th></tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id}>
                <td><code>{p.code}</code></td>
                <td>{p.title}</td>
                <td>{p.discount_type === 'percent' ? `${p.discount_value}%` : `€${p.discount_value / 100}`}</td>
                <td>{p.usage_count}</td>
                <td><span className={`admin-badge ${p.is_active ? 'paid' : 'off'}`}>{p.is_active ? 'Attiva' : 'Off'}</span></td>
                <td>
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => toggle(p.id, p.is_active)}>
                    {p.is_active ? 'Disattiva' : 'Attiva'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}