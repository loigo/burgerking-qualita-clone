import { is2faEnabled, generateTotpSecret, getTotpUri } from '@/lib/security/totp';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { SecurityClient } from './SecurityClient';

export default function SegurancaPage() {
  const twoFaOn = is2faEnabled();
  const demoSecret = generateTotpSecret();
  const totpUri = getTotpUri(demoSecret, 'admin@burgerking.it');

  return (
    <div>
      <AdminPageHeader
        title="Segurança"
        subtitle="Proteções ativas, 2FA e audit log de ações administrativas."
      />
      <SecurityClient twoFaOn={twoFaOn} demoSecret={demoSecret} totpUri={totpUri} />
    </div>
  );
}