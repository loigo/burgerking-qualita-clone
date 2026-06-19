import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bk-footer">
      <div className="bk-footer-lines">
        <div className="bk-footer-line orange" />
        <div className="bk-footer-line red" />
      </div>
      <div className="bk-footer-content">
        <p className="bk-footer-title">FLAME GRILLING SINCE 1954</p>
        <p className="bk-footer-copy">
          Burger King Restaurants Italia S.p.A. — Loja virtual Fase 2 (demo acadêmica)
        </p>
        <div className="bk-footer-links">
          <Link href="/qualita">Qualità BK</Link>
          <Link href="/prodotti">Prodotti</Link>
          <Link href="/promo">Promo</Link>
          <Link href="/novita">Novità</Link>
          <Link href="/carrello">Carrello</Link>
        </div>
      </div>
    </footer>
  );
}