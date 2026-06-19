import crypto from 'crypto';

/**
 * TOTP RFC 6238 — 2FA para admin.
 * PEN-TEST: mitiga credential stuffing mesmo com password vazada.
 * Ative com ADMIN_2FA_ENABLED=true + ADMIN_TOTP_SECRET (base32).
 */

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(encoded: string): Buffer {
  const cleaned = encoded.replace(/=+$/, '').toUpperCase();
  let bits = '';
  for (const char of cleaned) {
    const val = BASE32.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, '0');
}

export function generateTotpSecret(): string {
  const bytes = crypto.randomBytes(20);
  let secret = '';
  for (let i = 0; i < bytes.length; i += 5) {
    const chunk =
      (bytes[i]! << 24) | (bytes[i + 1]! << 16) | (bytes[i + 2]! << 8) | bytes[i + 3]!;
    for (let j = 0; j < 8; j++) {
      secret += BASE32[(chunk >> (35 - j * 5)) & 31];
    }
  }
  return secret.slice(0, 32);
}

export function verifyTotp(secret: string, token: string, window = 1): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let w = -window; w <= window; w++) {
    if (hotp(key, counter + w) === token) return true;
  }
  return false;
}

export function getTotpUri(secret: string, email: string): string {
  const issuer = encodeURIComponent('BK Admin');
  const account = encodeURIComponent(email);
  return `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;
}

export function is2faEnabled() {
  return process.env.ADMIN_2FA_ENABLED === 'true' && Boolean(process.env.ADMIN_TOTP_SECRET);
}

export function getAdminTotpSecret() {
  return process.env.ADMIN_TOTP_SECRET || '';
}