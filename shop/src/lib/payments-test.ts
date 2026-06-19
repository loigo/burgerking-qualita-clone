import Stripe from 'stripe';
import crypto from 'crypto';

export type PaymentGateway = 'stripe' | 'paypal' | 'satispay';

export type StripeCreds = {
  pk?: string;
  sk?: string;
  webhook?: string;
};

export type PayPalCreds = {
  clientId?: string;
  secret?: string;
  publicClientId?: string;
};

export type SatispayCreds = {
  keyId?: string;
  privateKey?: string;
};

export type TestResult = {
  ok: boolean;
  gateway: PaymentGateway;
  message: string;
  detail?: string;
  latencyMs?: number;
};

function mask(value: string | undefined, visible = 4) {
  if (!value) return '';
  if (value.length <= visible * 2) return '••••';
  return `${value.slice(0, visible)}••••${value.slice(-visible)}`;
}

export function maskPaymentStatus() {
  return {
    stripe: {
      configured: Boolean(
        process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ),
      pk: mask(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      sk: mask(process.env.STRIPE_SECRET_KEY),
      webhook: mask(process.env.STRIPE_WEBHOOK_SECRET),
    },
    paypal: {
      configured: Boolean(
        process.env.PAYPAL_CLIENT_ID &&
          process.env.PAYPAL_CLIENT_SECRET &&
          process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      ),
      clientId: mask(process.env.PAYPAL_CLIENT_ID),
      secret: mask(process.env.PAYPAL_CLIENT_SECRET),
      publicClientId: mask(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID),
      mode: process.env.PAYPAL_MODE || 'sandbox',
    },
    satispay: {
      configured: Boolean(process.env.SATISPAY_KEY_ID && process.env.SATISPAY_PRIVATE_KEY),
      keyId: mask(process.env.SATISPAY_KEY_ID),
      privateKey: process.env.SATISPAY_PRIVATE_KEY ? '•••• configurada' : '',
      mode: process.env.SATISPAY_MODE || 'sandbox',
    },
  };
}

export async function testStripeConnection(creds?: StripeCreds): Promise<TestResult> {
  const sk = creds?.sk?.trim() || process.env.STRIPE_SECRET_KEY;
  if (!sk) {
    return { ok: false, gateway: 'stripe', message: 'Secret Key não configurada' };
  }
  const start = Date.now();
  try {
    const stripe = new Stripe(sk, { apiVersion: '2025-02-24.acacia' });
    const balance = await stripe.balance.retrieve();
    const currency = balance.available[0]?.currency?.toUpperCase() || 'EUR';
    return {
      ok: true,
      gateway: 'stripe',
      message: `Conexão OK — saldo disponível em ${currency}`,
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      ok: false,
      gateway: 'stripe',
      message: 'Falha na autenticação Stripe',
      detail: String(e),
      latencyMs: Date.now() - start,
    };
  }
}

export async function testPayPalConnection(creds?: PayPalCreds): Promise<TestResult> {
  const clientId = creds?.clientId?.trim() || process.env.PAYPAL_CLIENT_ID;
  const secret = creds?.secret?.trim() || process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    return { ok: false, gateway: 'paypal', message: 'Client ID ou Secret não configurados' };
  }
  const api =
    process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  const start = Date.now();
  try {
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    const res = await fetch(`${api}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
      const err = await res.text();
      return {
        ok: false,
        gateway: 'paypal',
        message: 'PayPal rejeitou as credenciais',
        detail: err,
        latencyMs: Date.now() - start,
      };
    }
    const data = await res.json();
    return {
      ok: true,
      gateway: 'paypal',
      message: `Token OAuth obtido (${process.env.PAYPAL_MODE || 'sandbox'})`,
      detail: `scope: ${data.scope || 'n/a'}`,
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      ok: false,
      gateway: 'paypal',
      message: 'Erro de rede PayPal',
      detail: String(e),
      latencyMs: Date.now() - start,
    };
  }
}

async function satispaySignedGet(keyId: string, privateKey: string, path: string) {
  const host =
    process.env.SATISPAY_MODE === 'production'
      ? 'authservices.satispay.com'
      : 'staging.authservices.satispay.com';
  const body = '';
  const hash = crypto.createHash('sha256').update(body).digest('base64');
  const digest = `SHA-256=${hash}`;
  const date = new Date().toUTCString();
  const message = `(request-target): get ${path}\nhost: ${host}\ndate: ${date}\ndigest: ${digest}`;
  const pem = privateKey.replace(/\\n/g, '\n').trim();
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  const signature = sign.sign(pem, 'base64');
  const authorization = `Signature keyId="${keyId}", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="${signature}"`;
  return fetch(`https://${host}${path}`, {
    method: 'GET',
    headers: {
      Host: host,
      Date: date,
      Digest: digest,
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  });
}

export async function testSatispayConnection(creds?: SatispayCreds): Promise<TestResult> {
  const keyId = creds?.keyId?.trim() || process.env.SATISPAY_KEY_ID;
  const privateKey = creds?.privateKey?.trim() || process.env.SATISPAY_PRIVATE_KEY;
  if (!keyId || !privateKey) {
    return { ok: false, gateway: 'satispay', message: 'Key ID ou Private Key não configurados' };
  }
  const start = Date.now();
  try {
    // GET inexistente — 404 prova assinatura válida; 401/403 = credenciais inválidas
    const res = await satispaySignedGet(
      keyId,
      privateKey,
      '/g_business/v1/payments/00000000-0000-0000-0000-000000000000'
    );
    if (res.status === 401 || res.status === 403) {
      const text = await res.text();
      return {
        ok: false,
        gateway: 'satispay',
        message: 'Satispay rejeitou a assinatura',
        detail: text,
        latencyMs: Date.now() - start,
      };
    }
    return {
      ok: true,
      gateway: 'satispay',
      message: `Assinatura válida (${process.env.SATISPAY_MODE || 'sandbox'})`,
      detail: `HTTP ${res.status}`,
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      ok: false,
      gateway: 'satispay',
      message: 'Erro ao testar Satispay',
      detail: String(e),
      latencyMs: Date.now() - start,
    };
  }
}

export async function testPaymentGateway(
  gateway: PaymentGateway,
  creds?: { stripe?: StripeCreds; paypal?: PayPalCreds; satispay?: SatispayCreds }
): Promise<TestResult> {
  switch (gateway) {
    case 'stripe':
      return testStripeConnection(creds?.stripe);
    case 'paypal':
      return testPayPalConnection(creds?.paypal);
    case 'satispay':
      return testSatispayConnection(creds?.satispay);
  }
}