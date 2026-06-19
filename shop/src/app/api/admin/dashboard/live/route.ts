import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/security/api-guard';
import { getDashboardStats } from '@/lib/admin-stats';
import { getOnlineCount } from '@/lib/presence';

export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;

  const stats = await getDashboardStats();
  return NextResponse.json({
    ...stats,
    onlineUsers: getOnlineCount(),
    timestamp: new Date().toISOString(),
  });
}