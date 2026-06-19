import Link from 'next/link';
import { HomeHero } from '@/components/marketing/HomeHero';
import { HomeProductsSection } from '@/components/marketing/HomeProductsSection';
import { CarouselNav } from '@/components/marketing/CarouselNav';
import { HOME_PROMOS, HOME_NOVITA } from '@/lib/home-data';

const BK = 'https://www.burgerking.it';

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="section-pari py-8" data-carousel>
        <div className="max-w-1600 mx-auto">
          <div className="div-titolo-section pl-6 md:pl-[4.5rem] pb-6 flex items-baseline flex-wrap">
            <span className="titolo-section">Promozioni</span>
            <Link href="/promo" className="link-view-all ps-2">
              Vedi tutti
            </Link>
          </div>
          <div className="relative">
            <div
              id="promo-track"
              className="h-track flex gap-4 overflow-x-auto pl-6 md:pl-[4.5rem] pr-6 pb-4"
            >
              {HOME_PROMOS.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
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
            <CarouselNav trackId="promo-track" />
          </div>
        </div>
      </section>

      <HomeProductsSection />

      <section id="novita" className="section-dispari py-8" data-carousel>
        <div className="max-w-1600 mx-auto">
          <div className="div-titolo-section pl-6 md:pl-[4.5rem] pb-6 flex flex-wrap items-center justify-between gap-4 pr-6 md:pr-[4.5rem]">
            <span className="titolo-section">Novità</span>
            <Link href="/novita" className="btn-main-outline no-underline">
              Vedi tutte
            </Link>
          </div>
          <div className="relative">
            <div
              id="novita-track"
              className="h-track flex gap-4 overflow-x-auto pl-6 md:pl-[4.5rem] pr-6 pb-4"
            >
              {HOME_NOVITA.map((n) => (
                <Link
                  key={n.title}
                  href="/novita"
                  className="flex-shrink-0 w-[320px] no-underline"
                >
                  <div className="news-card">
                    <div
                      className="div-img-news aspect-video"
                      style={{ backgroundImage: `url('${n.thumb}')` }}
                    />
                    <div className="div-content-news">
                      <div className="news-title text-[2rem]">{n.title}</div>
                      <div className="news-preview hidden md:block text-[1.5rem]">
                        {n.preview}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <CarouselNav trackId="novita-track" />
          </div>
        </div>
      </section>

      <section className="py-8 px-6 md:px-[4.5rem]">
        <div
          className="max-w-1600 mx-auto rounded-xl overflow-hidden"
          style={{
            backgroundImage: `url('${BK}/assets/img/console/appUser/banner/311_desktop_it.png?v=1709553877')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.3)',
            padding: '8rem 2rem',
            borderRadius: '25px',
          }}
        >
          <div className="text-center text-bk-avana max-w-xl mx-auto">
            <p className="font-flame text-[1.5rem] pb-2">Qualità</p>
            <h2 className="font-flamebold text-[4rem] leading-[3.9rem] text-bk-orange uppercase pb-4">
              Massima qualità, massimo gusto.
            </h2>
            <p className="text-[2rem] pb-8">
              Usiamo solo il meglio per darti tutto il gusto che meriti.
            </p>
            <Link href="/qualita" className="btn-main">
              Scopri i nostri ingredienti
            </Link>
          </div>
        </div>
      </section>

      <section id="store-locator" className="py-8 px-6 md:px-[4.5rem]">
        <div
          className="max-w-1600 mx-auto div-banner-storelocator grid grid-cols-1 md:grid-cols-3 items-center p-6 md:p-8"
          style={{ backgroundColor: '#502314' }}
        >
          <div className="flex justify-center">
            <img
              src={`${BK}/assets/img/console/appUser/banner/301_desktop_it.png?v=1709305468`}
              alt=""
              className="banner-image max-w-full"
            />
          </div>
          <div className="text-center md:text-left text-bk-avana py-6">
            <h2 className="font-flamebold text-bk-orange text-[3.5rem] leading-[3.4rem] pb-3">
              Vieni nel tuo regno da King
            </h2>
            <p className="text-[1.5rem] pb-6">
              Trova il ristorante più vicino a te per venire a gustare subito i tuoi burger
              preferiti e vivere un&apos;esperienza da vero king!
            </p>
            <Link href="/prodotti" className="btn-main">
              Trova il regno
            </Link>
          </div>
          <div className="hidden xl:flex justify-center">
            <img
              src={`${BK}/assets/images/img_home_storelocator.png?v=1709305347`}
              alt=""
              className="home-image-locator"
            />
          </div>
        </div>
      </section>
    </>
  );
}