import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BIG_KING_PROMO } from '@/lib/marketing-data';
import { AppBanner } from '@/components/marketing/AppBanner';

const PROMO_DETAILS: Record<string, typeof BIG_KING_PROMO> = {
  [BIG_KING_PROMO.slug]: BIG_KING_PROMO,
};

export function generateStaticParams() {
  return [{ slug: BIG_KING_PROMO.slug }];
}

export default function PromoDetailPage({ params }: { params: { slug: string } }) {
  const promo = PROMO_DETAILS[params.slug];
  if (!promo) notFound();

  return (
    <main className="container-news-dettaglio">
      <div className="container-1600 promo-breadcrumb-wrap">
        <Link href="/promo" className="promo-breadcrumb">
          <img
            src="https://www.burgerking.it/assets/images/Arrow-left.svg?v=1709305347"
            alt=""
            aria-hidden
            className="breadcrumb-arrow"
          />
          Torna alla lista
        </Link>
      </div>

      <div className="container-1600 promo-detail-images">
        <img src={promo.desktopImg} alt={promo.title} className="promo-detail-img-desktop" />
        <img src={promo.mobileImg} alt={promo.title} className="promo-detail-img-mobile" />
      </div>

      <div className="container-1600 promo-detail-text-wrap">
        <div className="div-testo-news">
          <h1 className="font-flamebold promo-detail-title">{promo.title}</h1>
          <div className="promo-description">
            {promo.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <AppBanner />
    </main>
  );
}