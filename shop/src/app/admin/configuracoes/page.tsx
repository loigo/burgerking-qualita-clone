import { QuickSettings } from '@/components/admin/QuickSettings';
import { SetupChecklist } from '@/components/admin/SetupChecklist';
import { EnvTemplate } from '@/components/admin/EnvTemplate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DbStatusBanner } from '@/components/admin/DbStatusBanner';
import { getDbStatus } from '@/lib/db-status';
import { getEnvStatus } from '@/lib/env-status';

export default async function ConfiguracoesPage() {
  const dbStatus = await getDbStatus();
  const env = getEnvStatus();

  return (
    <div>
      <AdminPageHeader
        title="Configurações"
        subtitle="Banco de dados, credenciais sandbox e preparação para apresentação."
      />

      <DbStatusBanner status={dbStatus} />

      <SetupChecklist env={env} dbConnected={dbStatus.connected} />

      <QuickSettings />

      <EnvTemplate />

      <section className="admin-section">
        <h2 className="admin-section-title">Comandos úteis</h2>
        <pre className="admin-code-block">{`cd shop
npm run db:up      # SQL Server (Docker)
npm run db:init    # Schema + seed
npm run build && npm run start

Login: admin@burgerking.it / admin`}</pre>
      </section>
    </div>
  );
}