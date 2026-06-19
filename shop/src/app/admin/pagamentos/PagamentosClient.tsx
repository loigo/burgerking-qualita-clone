'use client';

import { useEffect, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

type Gateway = 'stripe' | 'paypal' | 'satispay';
type ConnStatus = 'connected' | 'pending' | 'error';

type EnvStatus = {
  stripe: { configured: boolean; pk: string; sk: string; webhook: string };
  paypal: { configured: boolean; clientId: string; secret: string; publicClientId: string; mode: string };
  satispay: { configured: boolean; keyId: string; privateKey: string; mode: string };
};

type TestResult = {
  ok: boolean;
  gateway: Gateway;
  message: string;
  detail?: string;
  latencyMs?: number;
};

const INITIAL = {
  stripe: { pk: '', sk: '', webhook: '' },
  paypal: { clientId: '', secret: '' },
  satispay: { keyId: '', privateKey: '' },
};

const GATEWAYS: Array<{ id: Gateway; name: string; logo: string }> = [
  { id: 'stripe', name: 'Stripe', logo: 'Stripe' },
  { id: 'paypal', name: 'PayPal', logo: 'PayPal' },
  { id: 'satispay', name: 'Satispay', logo: 'Satispay' },
];

function statusLabel(s: ConnStatus) {
  if (s === 'connected') return 'Conectado';
  if (s === 'error') return 'Erro';
  return 'Pendente';
}

function statusClass(s: ConnStatus) {
  if (s === 'connected') return 'ok';
  if (s === 'error') return 'err';
  return 'neutral';
}

export function PagamentosClient() {
  const [config, setConfig] = useState(INITIAL);
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [testing, setTesting] = useState<Gateway | null>(null);
  const [results, setResults] = useState<Partial<Record<Gateway, TestResult>>>({});

  useEffect(() => {
    fetch('/api/admin/payments/status')
      .then((r) => r.json())
      .then(setEnvStatus)
      .catch(() => {});
  }, []);

  function getConnStatus(gateway: Gateway): ConnStatus {
    const configured = envStatus?.[gateway]?.configured;
    const result = results[gateway];
    if (result) return result.ok ? 'connected' : 'error';
    return configured ? 'pending' : 'pending';
  }

  function configuredHint(gateway: Gateway) {
    if (!envStatus) return null;
    if (gateway === 'stripe' && envStatus.stripe.configured) {
      return `Env: ${envStatus.stripe.pk} · ${envStatus.stripe.sk}`;
    }
    if (gateway === 'paypal' && envStatus.paypal.configured) {
      return `Env: ${envStatus.paypal.clientId} · ${envStatus.paypal.mode}`;
    }
    if (gateway === 'satispay' && envStatus.satispay.configured) {
      return `Env: ${envStatus.satispay.keyId} · ${envStatus.satispay.mode}`;
    }
    return null;
  }

  async function testarConexao(gateway: Gateway) {
    setTesting(gateway);

    const body: Record<string, unknown> = { gateway };
    if (gateway === 'stripe' && (config.stripe.pk || config.stripe.sk)) body.stripe = config.stripe;
    if (gateway === 'paypal' && (config.paypal.clientId || config.paypal.secret)) body.paypal = config.paypal;
    if (gateway === 'satispay' && (config.satispay.keyId || config.satispay.privateKey)) {
      body.satispay = config.satispay;
    }

    try {
      const res = await fetch('/api/admin/payments/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as TestResult;
      setResults((r) => ({ ...r, [gateway]: data }));
    } catch {
      setResults((r) => ({
        ...r,
        [gateway]: { ok: false, gateway, message: 'Erro de rede' },
      }));
    } finally {
      setTesting(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Pagamentos"
        subtitle="Configure e teste Stripe, PayPal e Satispay. Credenciais são salvas em shop/.env.local."
      />

      <div className="admin-payment-hint">
        Cole as chaves em <code>shop/.env.local</code> e reinicie o servidor. Os campos abaixo
        servem para testar credenciais antes de salvar — nada é persistido pelo painel.
      </div>

      <div className="admin-payment-grid">
        {GATEWAYS.map(({ id, name, logo }) => {
          const conn = getConnStatus(id);
          const result = results[id];
          return (
            <article key={id} className="admin-payment-card">
              <div className="admin-payment-card-head">
                <div>
                  <span className="admin-payment-logo">{logo}</span>
                  <h2>{name}</h2>
                </div>
                <span className={`admin-status-pill admin-status-pill--${statusClass(conn)}`}>
                  {statusLabel(conn)}
                </span>
              </div>

              {configuredHint(id) && (
                <p className="admin-payment-masked">{configuredHint(id)}</p>
              )}

              <div className="admin-form-dark admin-payment-fields">
                {id === 'stripe' && (
                  <>
                    <label>
                      Publishable Key
                      <input
                        type="text"
                        placeholder="pk_test_…"
                        value={config.stripe.pk}
                        onChange={(e) => setConfig((c) => ({ ...c, stripe: { ...c.stripe, pk: e.target.value } }))}
                      />
                    </label>
                    <label>
                      Secret Key
                      <input
                        type="password"
                        placeholder="sk_test_…"
                        value={config.stripe.sk}
                        onChange={(e) => setConfig((c) => ({ ...c, stripe: { ...c.stripe, sk: e.target.value } }))}
                      />
                    </label>
                    <label>
                      Webhook Secret
                      <input
                        type="text"
                        placeholder="whsec_…"
                        value={config.stripe.webhook}
                        onChange={(e) => setConfig((c) => ({ ...c, stripe: { ...c.stripe, webhook: e.target.value } }))}
                      />
                    </label>
                  </>
                )}
                {id === 'paypal' && (
                  <>
                    <label>
                      Client ID
                      <input
                        type="text"
                        placeholder="Sandbox Client ID"
                        value={config.paypal.clientId}
                        onChange={(e) => setConfig((c) => ({ ...c, paypal: { ...c.paypal, clientId: e.target.value } }))}
                      />
                    </label>
                    <label>
                      Secret
                      <input
                        type="password"
                        placeholder="Sandbox Secret"
                        value={config.paypal.secret}
                        onChange={(e) => setConfig((c) => ({ ...c, paypal: { ...c.paypal, secret: e.target.value } }))}
                      />
                    </label>
                  </>
                )}
                {id === 'satispay' && (
                  <>
                    <label>
                      Key ID
                      <input
                        type="text"
                        placeholder="Key ID"
                        value={config.satispay.keyId}
                        onChange={(e) => setConfig((c) => ({ ...c, satispay: { ...c.satispay, keyId: e.target.value } }))}
                      />
                    </label>
                    <label>
                      Private Key
                      <textarea
                        rows={4}
                        placeholder="-----BEGIN PRIVATE KEY-----"
                        value={config.satispay.privateKey}
                        onChange={(e) => setConfig((c) => ({ ...c, satispay: { ...c.satispay, privateKey: e.target.value } }))}
                      />
                    </label>
                  </>
                )}
              </div>

              {result && (
                <div className={`admin-payment-result ${result.ok ? 'ok' : 'err'}`}>
                  <strong>{result.message}</strong>
                  {result.latencyMs != null && <span> · {result.latencyMs}ms</span>}
                  {result.detail && <p>{result.detail}</p>}
                </div>
              )}

              <button
                type="button"
                className="admin-btn admin-btn-primary admin-payment-test"
                onClick={() => testarConexao(id)}
                disabled={testing === id}
              >
                {testing === id ? 'Testando…' : 'Testar Conexão'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}