import { PROMOS } from '@/lib/marketing-data';
import { PromoGrid } from '@/components/marketing/PromoGrid';
import { AppBanner } from '@/components/marketing/AppBanner';

export const metadata = {
  title: 'BURGER KING® Italia - Promozioni',
  description:
    'Raddoppia gusto e soddisfazione: scopri tutte le offerte che abbiamo pensato per te.',
};

export default function PromoPage() {
  return (
    <main className="container-news">
      <div className="container-1600 px-0">
        <section className="testata-promo">
          <h1 className="font-flamebold testata-promo-title">Promozioni</h1>
        </section>
      </div>

      <section className="main-news">
        <PromoGrid items={PROMOS} />
      </section>

      <AppBanner />
    </main>
  );
}