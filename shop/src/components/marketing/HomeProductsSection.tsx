'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HOME_CATEGORIES, HOME_PRODUCTS } from '@/lib/home-data';
import { CarouselNav } from './CarouselNav';

export function HomeProductsSection() {
  const [cat, setCat] = useState('best_seller');
  const products = HOME_PRODUCTS[cat] || [];

  return (
    <section id="products-home-section" className="section-pari py-8">
      <div className="max-w-1600 mx-auto">
        <div className="div-titolo-section pl-6 md:pl-[4.5rem] pb-4 flex items-baseline flex-wrap">
          <span className="titolo-section">I nostri prodotti</span>
          <Link href="/prodotti" className="link-view-all ps-2">
            Vedi tutti
          </Link>
        </div>
        <div
          id="carousel-categorie-home"
          className="element-section scrollbar-custom2 pl-6 md:pl-[4.5rem] pb-4 flex flex-wrap gap-2"
        >
          {HOME_CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`btn-tag-outline btn-filtro-prod btn-filtro-categoria${cat === c.key ? ' active' : ''}`}
              onClick={() => setCat(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative mt-2">
          <div
            id="products-home-track"
            className="h-track carousel-home-prod flex gap-4 overflow-x-auto pl-6 md:pl-[4.5rem] pr-6 pb-4"
          >
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/prodotti/${p.slug}`}
                className="product-card home-product-card flex-shrink-0 w-[180px] no-underline"
              >
                <div className="news-card">
                  <div
                    className="div-img-news aspect-square"
                    style={{ backgroundImage: `url('${p.img}')` }}
                  />
                  <div className="div-content-news">
                    <div className="news-title text-[1.5rem] text-center">{p.title}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <CarouselNav trackId="products-home-track" />
        </div>
      </div>
    </section>
  );
}