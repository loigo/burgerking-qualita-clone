import Link from 'next/link';
import { QUALITA_INGREDIENTS, BIG_KING_PROMO } from '@/lib/marketing-data';
import { AppBanner } from '@/components/marketing/AppBanner';

export const metadata = {
  title: 'Qualità Carne Burger King e Prodotti | Burger King Italia',
  description:
    'Dalla carne a ogni singolo ingrediente del menu, da Burger King® tutti i prodotti sono di prima qualità.',
};

export default function QualitaPage() {
  return (
    <main>
      <div className="container-1600 px-0">
        <section
          className="testata-bg"
          style={{
            backgroundImage:
              "url('https://www.burgerking.it/assets/img/console/appUser/banner/311_desktop_it.png?v=1709553877')",
          }}
        >
          <div className="testata-bg-content">
            <p className="font-flame testata-eyebrow">Qualità</p>
            <h1 className="testata-hero-title font-flamebold">Massima qualità, massimo gusto.</h1>
            <p className="testata-hero-sub">
              Usiamo solo il meglio per darti tutto il gusto che meriti.
            </p>
          </div>
        </section>
      </div>

      <section className="qualita-ingredients">
        <div className="container-1600">
          <h2 className="titolo-section qualita-section-title">Scopri i nostri ingredienti</h2>
          <div className="ingredients-scroll">
            {QUALITA_INGREDIENTS.map((ing) => (
              <article
                key={ing.title}
                className="ingredient-slide"
                style={{ backgroundColor: ing.color }}
              >
                <div className="ingredient-slide-inner">
                  <div
                    className="ingredient-slide-img"
                    style={{ backgroundImage: `url('${ing.image}')` }}
                    role="img"
                    aria-label={ing.title}
                  />
                  <div className="ingredient-slide-text">
                    <h3 className="font-flamebold ingredient-slide-title">{ing.title}</h3>
                    {ing.description && (
                      <p className="ingredient-slide-desc">{ing.description}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-1600 qualita-promo-teaser">
        <h2 className="titolo-section">Promozione del momento</h2>
        <Link href={`/promo/${BIG_KING_PROMO.slug}`} className="promo-teaser-card">
          <div className="promo-teaser-grid">
            <div>
              <img
                src={BIG_KING_PROMO.desktopImg}
                alt={BIG_KING_PROMO.title}
                className="promo-teaser-img-desktop"
              />
              <img
                src={BIG_KING_PROMO.mobileImg}
                alt={BIG_KING_PROMO.title}
                className="promo-teaser-img-mobile"
              />
            </div>
            <div className="promo-teaser-copy">
              <p className="font-flame promo-teaser-label">Promozione</p>
              <h3 className="font-flamebold promo-teaser-title">{BIG_KING_PROMO.title}</h3>
              <p className="promo-teaser-desc">
                Con soli 4,95€ — Big King Menu piccolo con patatine small e bibita small.
              </p>
              <span className="btn-main">Scopri la promo</span>
            </div>
          </div>
        </Link>
      </section>

      <section className="section-pari qualita-passion">
        <div className="container-1600">
          <div className="qualita-passion-grid">
            <div className="qualita-passion-copy">
              <h2 className="font-flamebold qualita-passion-title">
                FARE IL PANINO CHE DESIDERI È LA NOSTRA UNICA PASSIONE
              </h2>
              <p className="qualita-passion-text">
                Quando arriva l&apos;ordine nelle nostre cucine, tutti sanno cosa fare e come farlo
                per consegnartelo proprio come lo vuoi. La nostra lunga storia ci fa creare panini
                insuperabili, ma l&apos;ingrediente segreto rimane sempre quello: la nostra passione
                di offrirti il sapore di una grande esperienza, tutte le volte che vuoi.
              </p>
              <Link href="/prodotti" className="btn-main">
                Scopri come lo prepariamo
              </Link>
            </div>
            <div className="qualita-passion-img-wrap">
              <img
                src="https://www.burgerking.it/assets/img/console/appUser/banner/312_desktop_it.png?v=1709564373"
                alt="Preparazione panino"
                className="qualita-passion-img"
              />
            </div>
          </div>
        </div>
      </section>

      <AppBanner />
    </main>
  );
}