'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

type Props = { metaActive: boolean; gtmActive: boolean; ga4Active: boolean };

const EVENTS = [
  { name: 'PageView', channel: 'Meta + GTM' },
  { name: 'ViewContent', channel: 'Meta + GA4' },
  { name: 'AddToCart', channel: 'Meta + GTM' },
  { name: 'InitiateCheckout', channel: 'Meta + GTM' },
  { name: 'Purchase', channel: 'Meta + GA4' },
];

export function CampanhasClient({ metaActive, gtmActive, ga4Active }: Props) {
  const [testSent, setTestSent] = useState(false);

  function runTest() {
    if (typeof window !== 'undefined') {
      window.fbq?.('track', 'PageView');
      window.dataLayer?.push({ event: 'test_campaign', source: 'bk_admin' });
    }
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  }

  return (
    <div>
      <AdminPageHeader
        title="Campanhas"
        subtitle="Meta Pixel, Google Tag Manager e eventos de conversão."
        actions={
          <Link href="/admin/promocoes" className="admin-btn admin-btn-secondary">
            Promoções
          </Link>
        }
      />

      <section className="admin-section">
        <h2 className="admin-section-title">Integrações</h2>
        <div className="admin-status-grid">
          <div className="admin-status-item">
            <div>
              <strong>Meta Pixel</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>NEXT_PUBLIC_META_PIXEL_ID</div>
            </div>
            <span className={`admin-status-pill admin-status-pill--${metaActive ? 'ok' : 'neutral'}`}>
              {metaActive ? 'Conectado' : 'Pendente'}
            </span>
          </div>
          <div className="admin-status-item">
            <div>
              <strong>Google Tag Manager</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>NEXT_PUBLIC_GTM_ID</div>
            </div>
            <span className={`admin-status-pill admin-status-pill--${gtmActive ? 'ok' : 'neutral'}`}>
              {gtmActive ? 'Conectado' : 'Pendente'}
            </span>
          </div>
          <div className="admin-status-item">
            <div>
              <strong>Google Analytics 4</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)' }}>NEXT_PUBLIC_GA4_MEASUREMENT_ID</div>
            </div>
            <span className={`admin-status-pill admin-status-pill--${ga4Active ? 'ok' : 'neutral'}`}>
              {ga4Active ? 'Conectado' : 'Pendente'}
            </span>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Eventos de conversão</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Canal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((e) => (
                <tr key={e.name}>
                  <td>{e.name}</td>
                  <td>{e.channel}</td>
                  <td><span className="admin-status-pill admin-status-pill--ok">Ativo</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-quick-links" style={{ marginTop: '1.25rem' }}>
          <button type="button" className="admin-btn admin-btn-primary" onClick={runTest}>
            Enviar evento teste
          </button>
          {testSent && (
            <span className="admin-status-pill admin-status-pill--ok">Enviado</span>
          )}
        </div>
      </section>
    </div>
  );
}