'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const A = 'https://www.burgerking.it';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BkSiteHeader() {
  const pathname = usePathname() || '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLink = (href: string, label: string) => (
    <Link href={href} className={`nav-link${isActive(pathname, href) ? ' active' : ''}`}>
      {label}
    </Link>
  );

  return (
    <>
      <header
        id="header"
        className="bg-bk-avana text-bk-brown sticky top-0 z-[5000] font-flame text-[1.6rem] leading-[1.9rem]"
      >
        <div className="max-w-1600 mx-auto px-6 xl:px-12">
          <div className="flex items-center py-2">
            <div className="header-col1 flex items-center w-[46%]">
              <Link
                href="/#store-locator"
                className={`flex items-center hover:text-bk-orange transition-colors no-underline text-bk-brown${pathname === '/' ? '' : ''}`}
              >
                <img
                  src={`${A}/assets/images/icon-store-locator.svg?v=1709305347`}
                  alt=""
                  className="svg-brown w-5 h-5 mr-2.5"
                  aria-hidden
                />
                <span className="hidden sm:inline">Trova un ristorante</span>
                <span className="sm:hidden">Trova</span>
              </Link>
              <span className="hidden xl:flex items-center text-bk-brown opacity-60 ml-6 text-[1.4rem]">
                <img
                  src={`${A}/assets/images/icon-ristornati.svg?v=1709305347`}
                  alt=""
                  className="svg-brown w-5 h-5 mr-2.5"
                  aria-hidden
                />
                <span>Diventa Franchisee</span>
              </span>
            </div>
            <div className="w-[8%] flex justify-center py-4">
              <Link href="/" className="block" aria-label="Burger King Italia">
                <img
                  src={`${A}/assets/images/logo_color.svg?v=1709305347`}
                  alt="Burger King Italia"
                  className="w-full max-w-[68px] min-w-[44px]"
                />
              </Link>
            </div>
            <div className="w-[46%] flex justify-end items-center">
              <nav className="hidden xl:flex items-center" aria-label="Menu principale">
                <ul className="flex items-center gap-3 2xl:gap-6 list-none m-0 p-0">
                  <li>{navLink('/qualita', 'Qualità BK')}</li>
                  <li>{navLink('/prodotti', 'Prodotti')}</li>
                  <li>{navLink('/novita', 'Novità')}</li>
                  <li>{navLink('/promo', 'Promo')}</li>
                  <li>{navLink('/novita', 'BK Café')}</li>
                  <li>{navLink('/novita', 'Loyalty')}</li>
                  <li className="relative">
                    <button
                      type="button"
                      className={`nav-link dropdown-toggle bg-transparent border-0 cursor-pointer font-flame${dropdownOpen ? ' active' : ''}`}
                      aria-expanded={dropdownOpen}
                      onClick={() => setDropdownOpen((o) => !o)}
                    >
                      Tutto su di noi
                    </button>
                    <ul
                      className={`dropdown-menu ${dropdownOpen ? '' : 'hidden'} absolute right-0 top-full mt-1 list-none m-0 p-0 z-50`}
                    >
                      <li>
                        <span className="dropdown-item">About us</span>
                      </li>
                      <li>
                        <span className="dropdown-item">Press room</span>
                      </li>
                      <li>
                        <a
                          href="https://careers.qsrp.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dropdown-item"
                        >
                          Careers
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="nav-link">Contatti</span>
                  </li>
                </ul>
              </nav>
              <button
                type="button"
                className="navbar-toggler xl:hidden border-0 bg-transparent p-2 cursor-pointer"
                aria-label="Apri menu"
                onClick={() => setMenuOpen(true)}
              >
                <span
                  className="block w-[2.6rem] h-[1.9rem] bg-no-repeat bg-center bg-contain"
                  style={{
                    backgroundImage: `url('${A}/assets/images/menu.svg')`,
                    filter:
                      'invert(15%) sepia(16%) saturate(3503%) hue-rotate(338deg) brightness(96%) contrast(93%)',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`${menuOpen ? '' : 'hidden'} fixed inset-0 bg-black/40 z-[6000]`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <aside
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-bk-brown z-[7000] overflow-y-auto${menuOpen ? '' : ' hidden'}`}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <img
            src={`${A}/assets/images/logo_white.svg?v=1709305347`}
            alt="Burger King Italia"
            className="max-w-[44px]"
          />
          <button
            type="button"
            className="border-0 bg-transparent cursor-pointer p-2"
            aria-label="Chiudi menu"
            onClick={() => setMenuOpen(false)}
          >
            <span
              className="block w-8 h-8 bg-no-repeat bg-center bg-contain svg-orange"
              style={{ backgroundImage: `url('${A}/assets/images/icon-close.svg')` }}
            />
          </button>
        </div>
        <nav className="font-flame" aria-label="Menu mobile">
          <ul className="list-none m-0 p-0">
            {[
              ['Trova un ristorante', '/#store-locator'],
              ['Qualità BK', '/qualita'],
              ['Prodotti', '/prodotti'],
              ['Novità', '/novita'],
              ['Promo', '/promo'],
              ['BK Café', '/novita'],
              ['Loyalty', '/novita'],
              ['Carrello', '/carrello'],
            ].map(([label, href]) => (
              <li key={href} className="nav-item">
                <Link
                  href={href}
                  className={`nav-link block px-12 py-4 text-bk-avana no-underline${isActive(pathname, href.replace('/#store-locator', '/')) ? ' !text-bk-orange' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link block w-full text-left px-12 py-4 bg-transparent border-0 cursor-pointer font-flame text-bk-avana"
                onClick={() => setMobileDropdownOpen((o) => !o)}
              >
                Tutto su di noi
              </button>
              <ul className={`${mobileDropdownOpen ? '' : 'hidden'} list-none m-0 px-12 pb-2`}>
                <li>
                  <span className="dropdown-item">About us</span>
                </li>
                <li>
                  <span className="dropdown-item">Press room</span>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link
                href="/admin"
                className="nav-link block px-12 py-4 text-bk-avana no-underline"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            </li>
          </ul>
          <div className="offcanvas-banner">
            <img
              src={`${A}/assets/img/console/appUser/banner/332_desktop_it.png?v=1710414846`}
              alt=""
              className="offcanvas-banner-img"
            />
            <div className="p-4 text-bk-avana">
              <div className="text-[1.6rem] font-flame">SCARICA LA NOSTRA APP</div>
              <div className="text-[1.2rem] font-flame-sans">
                E goditi dei vantaggi da vero King!
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}