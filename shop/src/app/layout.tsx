import type { Metadata } from 'next';
import './globals.css';
import { ConditionalChrome } from '@/components/layout/ConditionalChrome';
import { MetaPixel } from '@/components/tracking/MetaPixel';
import { GoogleTagManager } from '@/components/tracking/GoogleTagManager';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Burger King Italia | Loja Virtual',
  description: 'Ordina i tuoi burger preferiti — Italian Summer King, Bacon King e molto altro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SessionProvider>
          <GoogleTagManager />
          <MetaPixel />
          <ConditionalChrome>{children}</ConditionalChrome>
        </SessionProvider>
      </body>
    </html>
  );
}