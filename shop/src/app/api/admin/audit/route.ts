import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/security/api-guard';
import { listAuditLogs } from '@/lib/security/audit';

export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;
  const logs = await listAuditLogs(200);
  return NextResponse.json(logs);
}