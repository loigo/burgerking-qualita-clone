import { getDashboardStats } from '@/lib/admin-stats';
import { getDbStatus } from '@/lib/db-status';
import { DashboardView } from '@/components/admin/DashboardView';

export default async function AdminDashboardPage() {
  const [stats, dbStatus] = await Promise.all([getDashboardStats(), getDbStatus()]);

  return (
    <DashboardView
      stats={{ ...stats, dbConnected: dbStatus.connected }}
      dbStatus={dbStatus}
    />
  );
}