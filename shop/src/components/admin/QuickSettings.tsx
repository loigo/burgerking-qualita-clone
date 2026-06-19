'use client';

import { useEffect, useState } from 'react';

type SiteSettings = {
  site_name: string;
  currency: string;
  logo_url: string;
  support_email: string;
};

const DEFAULTS: SiteSettings = {
  site_name: 'Burger King Italia',
  currency: 'EUR',
  logo_url: 'https://www.burgerking.it/assets/images/logo-bk.svg',
  support_email: 'ordini@burgerking.it',
};

export function QuickSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSettings({ ...DEFAULTS, ...data });
      })
      .catch(() => setError('Erro ao carregar configurações'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Erro ao salvar');
      return;
    }
    setSettings({ ...DEFAULTS, ...data });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <p style={{ color: 'var(--adm-muted)' }}>Carregando configurações...</p>;

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">Configurações Rápidas do Site</h2>
      <p style={{ color: 'var(--adm-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Salvas na tabela <code>site_settings</code> do SQL Server.
      </p>
      {error && <p className="admin-error">{error}</p>}
      <form className="admin-form-dark admin-settings-grid" onSubmit={handleSave}>
        <label>
          Nome do site
          <input
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
          />
        </label>
        <label>
          Moeda
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </label>
        <label>
          URL do logo
          <input
            value={settings.logo_url}
            onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
          />
        </label>
        <label>
          Email de suporte
          <input
            type="email"
            value={settings.support_email}
            onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
          />
        </label>
        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary">
            Salvar no banco de dados
          </button>
          {saved && <span style={{ color: 'var(--adm-green)', fontSize: '0.9rem' }}>✓ Salvo no SQL</span>}
        </div>
      </form>
    </section>
  );
}