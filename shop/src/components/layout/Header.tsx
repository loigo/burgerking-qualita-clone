'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/cart';

const NAV = [
  { href: '/qualita', label: 'Qualità BK' },
  { href: '/prodotti', label: 'Prodotti' },
  { href: '/novita', label: 'Novità' },
  { href: '/promo', label: 'Promo' },
];

export function Header() {
  const itemCount = useCart((s) => s.itemCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('https://www.burgerking.it/assets/images/logo-bk.svg');
  const [siteName, setSiteName] = useState('Burger King Italia');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => {
        if (s.logo_url) setLogoUrl(s.logo_url);
        if (s.site_name) setSiteName(s.site_name);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="bk-header">
      <div className="bk-header-inner">
        <Link href="/" className="bk-logo" aria-label={siteName}>
          <img
            src={logoUrl}
            alt={siteName}
            height={36}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://www.burgerking.it/assets/images/logo-bk.svg';
            }}
          />
        </Link>
        <nav className={`bk-nav ${menuOpen ? 'bk-nav-open' : ''}`} aria-label="Menu principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bk-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="bk-header-actions">
          <button
            type="button"
            className="bk-menu-toggle"
            aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
          <Link href="/carrello" className="bk-cart-btn">
            Carrello
            {itemCount > 0 && <span className="bk-cart-badge">{itemCount}</span>}
          </Link>
          <Link href="/admin" className="bk-admin-link">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}