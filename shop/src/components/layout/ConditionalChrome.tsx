'use client';

import { usePathname } from 'next/navigation';
import { BkSiteHeader } from './BkSiteHeader';
import { BkSiteFooter } from './BkSiteFooter';
import { BkMobileBar } from './BkMobileBar';
import { PresenceHeartbeat } from './PresenceHeartbeat';

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/auth/login');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PresenceHeartbeat />
      <BkSiteHeader />
      <main className="flex-grow">{children}</main>
      <BkSiteFooter />
      <BkMobileBar />
    </>
  );
}