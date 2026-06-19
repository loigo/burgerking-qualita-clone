'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const A = 'https://www.burgerking.it';

export function BkMobileBar() {
  const pathname = usePathname() || '/';

  const itemClass = (match: string) => {
    const active = pathname === match || pathname.startsWith(`${match}/`);
    return `mobile-bar-item no-underline py-4 flex flex-col items-center${active ? ' text-bk-orange' : ' text-bk-brown'}`;
  };

  return (
    <div
      id="mobile-bar"
      className="fixed bottom-0 left-0 w-full bg-white z-[900] md:hidden border-t border-gray-200"
    >
      <div className="grid grid-cols-3 text-center">
        <Link href="/prodotti" className={itemClass('/prodotti')}>
          <img
            src={`${A}/assets/images/icon-product.svg?v=1709305347`}
            className="svg-brown w-5 h-5 mb-1"
            alt=""
          />
          <span className="text-[0.8rem] leading-[1rem] font-flame-sans">Prodotti</span>
        </Link>
        <Link href="/promo" className={itemClass('/promo')}>
          <img
            src={`${A}/assets/images/icon-promo.svg?v=1709305347`}
            className="svg-brown w-5 h-5 mb-1"
            alt=""
          />
          <span className="text-[0.8rem] leading-[1rem] font-flame-sans">Promo</span>
        </Link>
        <Link href="/#store-locator" className={itemClass('/store')}>
          <img
            src={`${A}/assets/images/icon-store-locator.svg?v=1709305347`}
            className="svg-brown w-5 h-5 mb-1"
            alt=""
          />
          <span className="text-[0.8rem] leading-[1rem] font-flame-sans">Store Locator</span>
        </Link>
      </div>
    </div>
  );
}