import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '../auth';
import { rateLimit, getClientIp } from './rate-limit';
import { writeAuditLog } from './audit';
import { is2faEnabled } from './totp';

/**
 * Guard unificado para APIs admin — PEN-TEST:
 * - AuthZ: verifica role admin + 2FA
 * - Rate limit por IP
 * - Audit log automático em mutações
 */

export async function requireAdminApi(req: Request, opts?: { audit?: { action: string; entity: string; entity_id?: string } }) {
  const ip = getClientIp(req.headers);
  if (rateLimit(`admin-api:${ip}`, 60, 60_000)) {
    return { session: null, error: Response.json({ error: 'Too many requests' }, { status: 429 }) };
  }

  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return { session: null, error: Response.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const twoFactorVerified = (session as { twoFactorVerified?: boolean })?.twoFactorVerified;
  if (is2faEnabled() && !twoFactorVerified) {
    return { session: null, error: Response.json({ error: '2FA verification required', code: '2FA_REQUIRED' }, { status: 403 }) };
  }

  if (opts?.audit && session?.user?.email) {
    await writeAuditLog({
      user_id: session.user.email,
      action: opts.audit.action,
      entity: opts.audit.entity,
      entity_id: opts.audit.entity_id,
    });
  }

  return { session, error: null };
}