import type { NextResponse } from 'next/server';

/**
 * Headers de segurança — PEN-TEST checklist:
 * - CSP: mitiga XSS (injection de scripts)
 * - HSTS: força HTTPS em produção
 * - X-Frame-Options: clickjacking
 * - Referrer-Policy: vazamento de URLs
 */
export function applySecurityHeaders(response: NextResponse) {
  const isProd = process.env.NODE_ENV === 'production';
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://www.paypal.com https://*.satispay.com https://www.google-analytics.com",
      "frame-src https://js.stripe.com https://www.paypal.com https://hooks.stripe.com",
    ].join('; ')
  );
  if (isProd) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  response.headers.delete('x-powered-by');
  return response;
}