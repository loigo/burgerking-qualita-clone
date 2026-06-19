import { getDashboardStats } from '@/lib/admin-stats';
import { CampanhasClient } from './CampanhasClient';

export default async function CampanhasPage() {
  const stats = await getDashboardStats();
  return (
    <CampanhasClient
      metaActive={stats.metaPixelActive}
      gtmActive={stats.gtmActive}
      ga4Active={stats.ga4Active}
    />
  );
}