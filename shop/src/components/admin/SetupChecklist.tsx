import Link from 'next/link';
import type { EnvStatus } from '@/lib/env-status';
import { countReady } from '@/lib/env-status';

type Item = {
  key: string;
  label: string;
  ready: boolean;
  hint: string;
  href?: string;
  optional?: boolean;
};

type Props = {
  env: EnvStatus;
  dbConnected: boolean;
};

export function SetupChecklist({ env, dbConnected }: Props) {
  const items: Item[] = [
    { key: 'db', label: 'SQL Server', ready: dbConnected, hint: 'npm run db:up && npm run db:init', href: '/admin/configuracoes' },
    { key: 'auth', label: 'NextAuth', ready: env.nextauth, hint: 'NEXTAUTH_SECRET + NEXTAUTH_URL' },
    { key: 'stripe', label: 'Stripe', ready: env.stripe, hint: 'sk_test + pk_test', href: '/admin/pagamentos' },
    { key: 'paypal', label: 'PayPal', ready: env.paypal, hint: 'CLIENT_ID + SECRET', href: '/admin/pagamentos' },
    { key: 'satispay', label: 'Satispay', ready: env.satispay, hint: 'KEY_ID + PRIVATE_KEY', href: '/admin/pagamentos' },
    { key: 'meta', label: 'Meta Pixel', ready: env.meta, hint: 'NEXT_PUBLIC_META_PIXEL_ID', href: '/admin/campanhas' },
    { key: 'gtm', label: 'Google Tag Manager', ready: env.gtm, hint: 'NEXT_PUBLIC_GTM_ID', href: '/admin/campanhas' },
    { key: 'ga4', label: 'Google Analytics 4', ready: env.ga4, hint: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID', optional: true },
  ];

  const required = items.filter((i) => !i.optional);
  const readyCount = countReady(env, dbConnected);

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2 className="admin-section-title">Checklist de integração</h2>
        <span className={`admin-status-pill admin-status-pill--${readyCount >= required.length ? 'ok' : 'warn'}`}>
          {readyCount}/{required.length} prontos
        </span>
      </div>

      <div className="admin-status-grid">
        {items.map((item) => (
          <div key={item.key} className="admin-status-item">
            <div>
              <strong>{item.label}</strong>
              {item.optional && (
                <span style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', marginLeft: '0.35rem' }}>
                  opcional
                </span>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginTop: '0.2rem' }}>
                {item.hint}
              </div>
            </div>
            <span className={`admin-status-pill admin-status-pill--${item.ready ? 'ok' : 'neutral'}`}>
              {item.ready ? 'OK' : 'Pendente'}
            </span>
          </div>
        ))}
      </div>

      <div className="admin-quick-links" style={{ marginTop: '1.25rem' }}>
        <Link href="/admin/pagamentos" className="admin-btn admin-btn-primary">
          Configurar pagamentos
        </Link>
        <a href="/prodotti" target="_blank" rel="noreferrer" className="admin-btn admin-btn-secondary">
          Testar loja
        </a>
      </div>
    </section>
  );
}