'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
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
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}