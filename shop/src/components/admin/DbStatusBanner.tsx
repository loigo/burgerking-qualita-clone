import Link from 'next/link';
import type { DbStatus } from '@/lib/db-status';

type Props = { status: DbStatus };

export function DbStatusBanner({ status }: Props) {
  const pillClass =
    status.mode === 'connected' ? 'ok' : status.mode === 'configured_offline' ? 'warn' : 'neutral';

  return (
    <div className={`admin-db-banner admin-db-banner--${status.mode}`}>
      <div className="admin-db-banner-main">
        <span className={`admin-status-pill admin-status-pill--${pillClass}`}>
          {status.mode === 'connected' && 'Conectado'}
          {status.mode === 'configured_offline' && 'Offline'}
          {status.mode === 'memory' && 'Memória'}
        </span>
        <div>
          <strong className="admin-db-banner-title">{status.label}</strong>
          <p className="admin-db-banner-detail">{status.detail}</p>
        </div>
      </div>
      {status.mode !== 'connected' && (
        <Link href="/admin/configuracoes" className="admin-btn admin-btn-secondary admin-btn-sm">
          Configurar banco
        </Link>
      )}
    </div>
  );
}