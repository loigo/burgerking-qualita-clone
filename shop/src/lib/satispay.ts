import crypto from 'crypto';

const SANDBOX_HOST = 'staging.authservices.satispay.com';
const PROD_HOST = 'authservices.satispay.com';
const API_BASE = '/g_business/v1';

export type SatispayPayment = {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'CANCELED' | 'AUTHORIZED';
  amount_unit: number;
  currency: string;
  external_code?: string;
  redirect_url?: string;
  metadata?: Record<string, string>;
};

function getHost() {
  return process.env.SATISPAY_MODE === 'production' ? PROD_HOST : SANDBOX_HOST;
}

export function isSatispayConfigured() {
  return Boolean(process.env.SATISPAY_KEY_ID && process.env.SATISPAY_PRIVATE_KEY);
}

function normalizePem(key: string) {
  return key.replace(/\\n/g, '\n').trim();
}

function createDigest(body: string) {
  const hash = crypto.createHash('sha256').update(body).digest('base64');
  return `SHA-256=${hash}`;
}

function buildSignedHeaders(method: string, path: string, body: string) {
  const host = getHost();
  const digest = createDigest(body);
  const date = new Date().toUTCString();
  const message = `(request-target): ${method.toLowerCase()} ${path}\nhost: ${host}\ndate: ${date}\ndigest: ${digest}`;
  const privateKey = normalizePem(process.env.SATISPAY_PRIVATE_KEY!);
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  const signature = sign.sign(privateKey, 'base64');
  const keyId = process.env.SATISPAY_KEY_ID!;
  const authorization = `Signature keyId="${keyId}", algorithm="rsa-sha256", headers="(request-target) host date digest", signature="${signature}"`;
  return { host, digest, date, authorization };
}

async function satispayRequest<T>(method: 'GET' | 'POST', path: string, bodyObj?: object): Promise<T> {
  const body = bodyObj ? JSON.stringify(bodyObj) : '';
  const { host, digest, date, authorization } = buildSignedHeaders(method, path, body);
  const url = `https://${host}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Host: host,
      Date: date,
      Digest: digest,
      Authorization: authorization,
      'Content-Type': 'application/json',
      'x-satispay-devicetype': 'ECOMMERCE_PLUGIN',
      'x-satispay-appn': 'Burger King Italia Shop',
      'x-satispay-appv': '2.0.0',
    },
    body: method === 'POST' ? body : undefined,
  });
  const text = await res.text();
  let data: T;
  try {
    data = text ? JSON.parse(text) : ({} as T);
  } catch {
    throw new Error(`Satispay API error: ${text}`);
  }
  if (!res.ok) {
    throw new Error(`Satispay ${res.status}: ${text}`);
  }
  return data;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export async function createSatispayPayment(amountCents: number, orderNumber: string) {
  const appUrl = getAppUrl();
  const payload = {
    flow: 'MATCH_CODE',
    amount_unit: amountCents,
    currency: 'EUR',
    external_code: orderNumber.slice(0, 50),
    callback_url: `${appUrl}/api/webhooks/satispay?payment_id={uuid}`,
    redirect_url: `${appUrl}/ordine/confermato?order=${encodeURIComponent(orderNumber)}&provider=satispay`,
    metadata: {
      order_number: orderNumber,
    },
  };
  return satispayRequest<SatispayPayment>('POST', `${API_BASE}/payments`, payload);
}

export async function getSatispayPayment(paymentId: string) {
  return satispayRequest<SatispayPayment>('GET', `${API_BASE}/payments/${paymentId}`);
}

/** One-time setup: exchange activation token for key_id (no signing required) */
export async function authenticateSatispayToken(activationToken: string, publicKeyPem: string) {
  const host = getHost();
  const publicKey = publicKeyPem
    .trim()
    .split('\n')
    .join('\\n')
    .replace(/\r/g, '');
  const res = await fetch(`https://${host}${API_BASE}/authentication_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: publicKey, token: activationToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data as { key_id: string };
}

export function generateRsaKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}