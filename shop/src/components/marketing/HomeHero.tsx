'use client';

import { useEffect, useState } from 'react';
import { HOME_SLIDES } from '@/lib/marketing-data';

export function HomeHero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % HOME_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setActive((a) => (a - 1 + HOME_SLIDES.length) % HOME_SLIDES.length);
  const next = () => setActive((a) => (a + 1) % HOME_SLIDES.length);

  return (
    <div className="max-w-1600 mx-auto px-0 md:px-6 xl:px-12 mb-8">
      <div id="hero-slider" className="hero-slider relative">
        {HOME_SLIDES.map((slide, i) => (
          <div key={slide.src} className={`hero-slide${i === active ? ' active' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center p-4 md:p-8 gap-4">
              <div className="order-2 md:order-1 flex justify-center">
                <img src={slide.src} alt={slide.alt} className="slider-image" />
              </div>
              <div className="order-1 md:order-2 text-center text-bk-avana px-4 py-6">
                <p className="font-flame text-[1.5rem] pb-2">
                  {i === 2 ? <strong>{slide.eyebrow}</strong> : slide.eyebrow}
                </p>
                {i === 0 ? (
                  <h1 className="font-flamebold text-[5rem] leading-[4.9rem] pb-4">
                    NUOVO ITALIAN
                    <br />
                    SUMMER KING
                  </h1>
                ) : (
                  <h2 className="font-flamebold text-[5rem] leading-[4.9rem] pb-4 whitespace-pre-line">
                    {slide.title}
                  </h2>
                )}
                <p className="text-[2.4rem] leading-[2.6rem] whitespace-pre-line">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="slider-nav-btn hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Precedente"
          onClick={prev}
        >
          <svg viewBox="0 0 16 16">
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="slider-nav-btn hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Successivo"
          onClick={next}
        >
          <svg viewBox="0 0 16 16">
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>

        <div className="hero-dots md:hidden">
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