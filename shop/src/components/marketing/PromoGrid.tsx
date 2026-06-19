'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PromoItem } from '@/lib/marketing-data';

export function PromoGrid({ items }: { items: PromoItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.filter((p) => !p.hidden);

  return (
    <>
      <div className="promo-grid">
        {visible.map((p, i) => {
          const href = p.slug ? `/promo/${p.slug}` : '/promo';
          return (
            <article key={`${p.title}-${i}`} className="promo-card">
              <Link href={href} className="promo-card-link">
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
            </article>
          );
        })}
      </div>
      {!showAll && items.some((p) => p.hidden) && (
        <div className="text-center pt-8 pb-4">
          <button type="button" className="btn-main-outline" onClick={() => setShowAll(true)}>
            Carica altri
          </button>
        </div>
      )}
    </>
  );
}