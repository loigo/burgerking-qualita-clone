'use client';

import { useEffect, useState } from 'react';

type Log = { id?: number; user_id: string; action: string; entity: string; entity_id?: string; created_at: string };

type Props = { twoFaOn: boolean; demoSecret: string; totpUri: string };

export function SecurityClient({ twoFaOn, demoSecret, totpUri }: Props) {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch('/api/admin/audit').then((r) => r.json()).then(setLogs);
  }, []);

  return (
    <div>
      <section className="admin-section">
        <h2 className="admin-section-title">Sicurezza attiva</h2>
        <ul className="admin-security-list">
          <li>Rate limiting su /api/* (anti-DDoS / brute-force)</li>
          <li>SQL parametrizzato (anti SQL Injection — OWASP A03)</li>
          <li>Zod validation su tutti gli input API</li>
          <li>CSP + HSTS + X-Frame-Options (anti XSS / clickjacking)</li>
          <li>CSRF via NextAuth cookies httpOnly</li>
          <li>JWT session 8h + refresh rotation 24h</li>
          <li>2FA TOTP admin {twoFaOn ? '(attivo)' : '(disattivo — configura .env)'}</li>
        </ul>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Configura 2FA</h2>
        <p className="admin-page-sub">Aggiungi in <code>shop/.env.local</code>:</p>
        <pre className="admin-code-block">{`ADMIN_2FA_ENABLED=true
ADMIN_TOTP_SECRET=${demoSecret}`}</pre>
        <p className="text-sm">URI Google Authenticator:</p>
        <code className="admin-code-inline">{totpUri}</code>
      </section>

      <section className="admin-section">
        <h2 className="admin-section-title">Audit Log</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Data</th><th>Utente</th><th>Azione</th><th>Entità</th></tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id ?? i}>
                  <td>{new Date(l.created_at).toLocaleString('it-IT')}</td>
                  <td>{l.user_id}</td>
                  <td><code>{l.action}</code></td>
                  <td>{l.entity}{l.entity_id ? ` #${l.entity_id}` : ''}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={4}>Nessun log — le azioni admin verranno registrate qui.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}