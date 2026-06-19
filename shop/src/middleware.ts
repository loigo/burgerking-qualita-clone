import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit, getClientIp } from '@/lib/security/rate-limit';
import { applySecurityHeaders } from '@/lib/security/headers';

/**
 * Middleware global — PEN-TEST:
 * - Rate limiting (anti-DDoS / brute-force) em /api/*
 * - AuthZ admin em /admin/*
 * - Security headers em todas as respostas
 */
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/api/')) {
    const ip = getClientIp(req.headers);
    const isAuth = path.startsWith('/api/auth');
    const bucket = isAuth ? `auth:${ip}` : `api:${ip}`;
    const max = isAuth ? 20 : 150;
    if (rateLimit(bucket, max, 60_000)) {
      const res = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      return applySecurityHeaders(res);
    }
  }

  if (path.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token?.role !== 'admin') {
      const login = new URL('/auth/login', req.url);
      login.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(login);
    }
    // PEN-TEST: gate 2FA — admin pages bloqueadas até TOTP verificado
    const twoFaOn =
      process.env.ADMIN_2FA_ENABLED === 'true' && Boolean(process.env.ADMIN_TOTP_SECRET);
    if (twoFaOn && !token?.twoFactorVerified) {
      const login = new URL('/auth/login', req.url);
      login.searchParams.set('callbackUrl', path);
      login.searchParams.set('step', '2fa');
      return NextResponse.redirect(login);
    }
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};