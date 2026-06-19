import type { Metadata } from 'next';
import './globals.css';
import { ConditionalChrome } from '@/components/layout/ConditionalChrome';
import { TailwindSetup } from '@/components/layout/TailwindSetup';
import { MetaPixel } from '@/components/tracking/MetaPixel';
import { GoogleTagManager } from '@/components/tracking/GoogleTagManager';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Burger King Italia | Hamburger e Fast Food',
  description:
    'Entra e scopri tutti i menu, gli hamburger, gli snack Burger King® e le promozioni che abbiamo pensato per te.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body className="flex flex-col min-h-screen bg-bk-avana has-mobile-bar">
        <TailwindSetup />
        <SessionProvider>
          <GoogleTagManager />
          <MetaPixel />
          <ConditionalChrome>{children}</ConditionalChrome>
        </SessionProvider>
      </body>
    </html>
  );
}