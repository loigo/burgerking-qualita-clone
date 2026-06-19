import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from './auth';
import { requireAdminApi } from './security/api-guard';

export async function requireAdmin(
  req?: Request,
  audit?: { action: string; entity: string; entity_id?: string }
) {
  if (req) return requireAdminApi(req, audit ? { audit } : undefined);

  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return { session: null, error: Response.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { session, error: null };
}