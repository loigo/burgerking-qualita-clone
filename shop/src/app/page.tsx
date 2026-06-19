import Link from 'next/link';
import { listProducts } from '@/lib/db';
import { ProductCard } from '@/components/shop/ProductCard';
import { HomeHero } from '@/components/marketing/HomeHero';
import { PROMOS } from '@/lib/marketing-data';

export default async function HomePage() {
  const featured = (await listProducts('best_seller')).filter((p) => p.is_featured).slice(0, 8);
  const homePromos = PROMOS.filter((p) => !p.hidden).slice(0, 6);

  return (
    <>
      <HomeHero />

      <section className="section-pari py-8">
        <div className="max-w-1600 mx-auto">
          <div className="div-titolo-section pl-6 md:pl-[4.5rem] pb-6 flex items-baseline flex-wrap">
            <span className="titolo-section">Promozioni</span>
            <Link href="/promo" className="link-view-all ps-2">
              Vedi tutti
            </Link>
          </div>
          <div className="relative">
            <div className="h-track flex gap-4 overflow-x-auto pl-6 md:pl-[4.5rem] pr-6 pb-4">
              {homePromos.map((p) => (
                <Link
                  key={p.title}
                  href={p.slug ? `/promo/${p.slug}` : '/promo'}
                  className="flex-shrink-0 w-[260px] no-underline"
                >
                  <div className="news-card">
                    <div
                      className="div-img-news aspect-square"
                      style={{ backgroundImage: `url('${p.thumb}')` }}
                    />
                    <div className="div-content-news">
                      <div className="news-title text-[2rem]">{p.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pari py-8">
        <div className="max-w-1600 mx-auto">
          <div className="div-titolo-section pl-6 md:pl-[4.5rem] pb-4 flex items-baseline flex-wrap">
            <span className="titolo-section">I nostri prodotti</span>
            <Link href="/prodotti" className="link-view-all ps-2">
              Vedi tutti
            </Link>
          </div>
          <div className="relative mt-2">
            <div className="h-track carousel-home-prod flex gap-4 overflow-x-auto pl-6 md:pl-[4.5rem] pr-6 pb-4">
              {featured.map((p) => (
                <div key={p.slug} className="flex-shrink-0 w-[220px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 px-6 md:px-[4.5rem]">
        <div className="max-w-1600 mx-auto">
          <div
            className="testata-bg rounded-[25px] overflow-hidden"
            style={{
              backgroundImage:
                "url('https://www.burgerking.it/assets/img/console/appUser/banner/311_desktop_it.png?v=1709553877')",
            }}
          >
            <div className="testata-bg-content w-full xl:w-1/2 text-center text-bk-avana px-4 py-12 mx-auto">
              <h2 className="font-flamebold testata-title text-[5rem] leading-[4.9rem] text-bk-orange uppercase pb-4">
                Ingredienti di qualità
              </h2>
              <p className="testata-subtitle text-[2.4rem] leading-[2.6rem] pb-8">
                Usiamo solo il meglio per darti tutto il gusto che meriti.
              </p>
              <Link href="/qualita" className="btn-main">
                Scopri i nostri ingredienti
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}