'use client';

import { useState } from 'react';

const TEMPLATE = `# Cole em shop/.env.local antes da apresentação
# Guia: docs/CONFIGURACAO-CREDENCIAIS.md

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=cola-um-secret-aleatorio-32-chars
ADMIN_EMAILS=admin@burgerking.it

# 2FA Admin (opcional — veja /admin/seguranca)
ADMIN_2FA_ENABLED=false
ADMIN_TOTP_SECRET=

# SQL — npm run db:up && npm run db:init
DATABASE_URL=Server=localhost,1433;Database=bk_shop;User Id=sa;Password=BkShop@2026!Strong;Encrypt=true;TrustServerCertificate=true;

# Stripe Sandbox — https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_COLE_AQUI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_COLE_AQUI
STRIPE_WEBHOOK_SECRET=whsec_COLE_AQUI

# PayPal Sandbox — https://developer.paypal.com
PAYPAL_CLIENT_ID=COLE_AQUI
PAYPAL_CLIENT_SECRET=COLE_AQUI
NEXT_PUBLIC_PAYPAL_CLIENT_ID=COLE_AQUI
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=COLE_AQUI_OPCIONAL

# Satispay Sandbox — node scripts/satispay-setup.mjs CODIGO_ATIVACAO
SATISPAY_MODE=sandbox
SATISPAY_KEY_ID=COLE_AQUI
SATISPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCOLE_AQUI\n-----END PRIVATE KEY-----"

# Meta Pixel — https://business.facebook.com/events_manager
NEXT_PUBLIC_META_PIXEL_ID=COLE_AQUI

# GTM + GA4
NEXT_PUBLIC_GTM_ID=GTM-COLE_AQUI
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-COLE_AQUI

# Azure (opcional produção)
# AZURE_STORAGE_CONNECTION_STRING=
# APPLICATIONINSIGHTS_CONNECTION_STRING=
`;

export function EnvTemplate() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">Modelo .env.local (copiar e colar)</h2>
      <p style={{ color: 'var(--adm-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Quando for configurar, copie este modelo para <code>shop/.env.local</code> e substitua os
        valores <code>COLE_AQUI</code>. Reinicie o servidor após salvar.
      </p>
      <pre
        style={{
          background: 'var(--adm-bg)',
          border: '1px solid var(--adm-border)',
          borderRadius: '10px',
          padding: '1rem',
          fontSize: '0.78rem',
          overflow: 'auto',
          color: 'var(--adm-muted)',
          margin: 0,
        }}
      >
        {TEMPLATE}
      </pre>
      <button type="button" className="admin-btn admin-btn-secondary" style={{ marginTop: '1rem' }} onClick={copy}>
        {copied ? '✓ Copiado' : 'Copiar modelo'}
      </button>
    </section>
  );
}