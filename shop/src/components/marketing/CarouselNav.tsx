'use client';

function PrevBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="slider-nav-btn hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10"
      aria-label="Precedente"
      onClick={onClick}
    >
      <svg viewBox="0 0 16 16">
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
    </button>
  );
}

function NextBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="slider-nav-btn hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10"
      aria-label="Successivo"
      onClick={onClick}
    >
      <svg viewBox="0 0 16 16">
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </button>
  );
}

export function CarouselNav({ trackId }: { trackId: string }) {
  const scroll = (dir: number) => {
    const el = document.getElementById(trackId);
    if (el) el.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <>
      <PrevBtn onClick={() => scroll(-1)} />
      <NextBtn onClick={() => scroll(1)} />
    </>
  );
}