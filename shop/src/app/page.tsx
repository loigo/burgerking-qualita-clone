import Link from 'next/link';
import { listProducts } from '@/lib/db';
import { ProductCard } from '@/components/shop/ProductCard';
import { HomeHero } from '@/components/marketing/HomeHero';
import { PROMOS } from '@/lib/marketing-data';

export default async function HomePage() {
  const featured = (await listProducts('best_seller')).filter((p) => p.is_featured).slice(0, 6);
  const homePromos = PROMOS.filter((p) => !p.hidden).slice(0, 6);

  return (
    <>
      <HomeHero />

      <section className="home-section-promo">
        <div className="container-1600 home-section-head">
          <h2 className="titolo-section">Promozioni</h2>
          <Link href="/promo" className="link-view-all">
            Vedi tutti
          </Link>
        </div>
        <div className="home-promo-track">
          {homePromos.map((p) => (
            <Link
              key={p.title}
              href={p.slug ? `/promo/${p.slug}` : '/promo'}
              className="home-promo-card"
            >
              <div className="news-card">
                <div
                  className="div-img-news aspect-square"
                  style={{ backgroundImage: `url('${p.thumb}')` }}
                />
                <div className="div-content-news">
                  <div className="news-title">{p.title}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pari">
        <div className="container-1600 py-10 text-center">
          <p className="font-flame home-welcome">Benvenuto nella tua BK Experience</p>
          <h2 className="titolo-section">I nostri prodotti</h2>
          <Link href="/prodotti" className="btn-main mt-6">
            Vedi tutti i prodotti
          </Link>
        </div>
      </section>

      <section className="container-1600 pb-12">
        <h2 className="titolo-section home-best-title">Best Seller</h2>
        <div className="product-grid-prodotti">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="home-qualita-banner">
        <div
          className="home-qualita-inner"
          style={{
            backgroundImage:
              "url('https://www.burgerking.it/assets/img/console/appUser/banner/311_desktop_it.png?v=1709553877')",
          }}
        >
          <h2 className="font-flamebold home-qualita-title">Ingredienti di qualità</h2>
          <p className="home-qualita-sub">Usiamo solo il meglio per darti tutto il gusto che meriti.</p>
          <Link href="/qualita" className="btn-main">
            Scopri i nostri ingredienti
          </Link>
        </div>
      </section>
    </>
  );
}