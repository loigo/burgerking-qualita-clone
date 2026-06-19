/**
 * Rate limiter em memória (sliding window).
 * PEN-TEST: Mitiga brute-force em /api/auth e abuso de API (OWASP API4).
 * Produção: substituir por Redis/Upstash ou Cloudflare Rate Limiting na edge.
 */
type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  if (entry.count > maxRequests) return true;
  return false;
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    '127.0.0.1'
  );
}

/** Limpa entradas expiradas periodicamente (evita memory leak) */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (now > v.resetAt) store.delete(k);
    }
  }, 60_000);
}