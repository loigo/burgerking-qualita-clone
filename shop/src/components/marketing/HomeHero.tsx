'use client';

import { useEffect, useState } from 'react';
import { HOME_SLIDES } from '@/lib/marketing-data';

export function HomeHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % HOME_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container-1600 home-hero-wrap">
      <div className="hero-slider">
        {HOME_SLIDES.map((slide, i) => (
          <div key={slide.src} className={`hero-slide${i === active ? ' active' : ''}`}>
            <img src={slide.src} alt={slide.alt} className="slider-image" />
          </div>
        ))}
        <div className="hero-dots">
          {HOME_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-dot${i === active ? ' active' : ''}`}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}