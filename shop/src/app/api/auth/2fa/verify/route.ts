import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyTotp, is2faEnabled, getAdminTotpSecret } from '@/lib/security/totp';
import { rateLimit, getClientIp } from '@/lib/security/rate-limit';
import { writeAuditLog } from '@/lib/security/audit';

const schema = z.object({ token: z.string().length(6) });

/** PEN-TEST: endpoint separado evita bypass de 2FA no login principal */
export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  if (rateLimit(`2fa:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  }

  if (!is2faEnabled()) {
    return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = schema.parse(await req.json());
  if (!verifyTotp(getAdminTotpSecret(), body.token)) {
    await writeAuditLog({ user_id: session.user.email, action: '2fa_failed', entity: 'auth' });
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  await writeAuditLog({ user_id: session.user.email, action: '2fa_success', entity: 'auth' });
  return NextResponse.json({ ok: true, message: 'Use session.update({ twoFactorVerified: true }) on client' });
}