'use client';

import { useState } from 'react';

type Props = {
  metaActive: boolean;
  gtmActive: boolean;
  ga4Active: boolean;
};

export function MarketingPanel({ metaActive, gtmActive, ga4Active }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="admin-section">
        <h2 className="admin-section-title">Marketing &amp; Campanhas</h2>
        <div className="admin-status-grid">
          <div className="admin-status-item">
            <div>
              <strong>Meta Pixel</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>Facebook Ads</div>
            </div>
            <span className={`admin-badge ${metaActive ? 'on' : 'off'}`}>
              {metaActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <div className="admin-status-item">
            <div>
              <strong>Google Tag Manager</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>GTM + GA4</div>
            </div>
            <span className={`admin-badge ${gtmActive ? 'on' : 'off'}`}>
              {gtmActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <div className="admin-status-item">
            <div>
              <strong>GA4 Ecommerce</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>purchase, add_to_cart</div>
            </div>
            <span className={`admin-badge ${ga4Active ? 'on' : 'off'}`}>
              {ga4Active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
        <p style={{ color: 'var(--adm-muted)', fontSize: '0.85rem', margin: '1rem 0 0' }}>
          {!metaActive && !gtmActive
            ? 'Pendente: cole NEXT_PUBLIC_META_PIXEL_ID e NEXT_PUBLIC_GTM_ID no .env.local'
            : 'Eventos AddToCart e Purchase disparam automaticamente na loja.'}
        </p>
        <div style={{ marginTop: '1rem' }}>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setModalOpen(true)}>
            Configurar Campanha Teste
          </button>
        </div>
      </section>

      {modalOpen && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <h3>Campanha de Teste — Meta + GTM</h3>
            <p>Configuração pronta para campanhas sandbox:</p>
            <ul>
              <li>Meta Pixel: eventos PageView, AddToCart, InitiateCheckout, Purchase</li>
              <li>GTM: dataLayer ecommerce (view_item, add_to_cart, purchase)</li>
              <li>GA4: conversões de venda ligadas ao GTM</li>
            </ul>
            <p>
              Define <code>NEXT_PUBLIC_META_PIXEL_ID</code> e <code>NEXT_PUBLIC_GTM_ID</code> no
              .env.local e reinicia o servidor.
            </p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => setModalOpen(false)}>
                Entendido
              </button>
              <a href="/admin/campanhas" className="admin-btn admin-btn-secondary">
                Ver Campanhas
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}