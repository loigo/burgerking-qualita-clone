import Link from 'next/link';

const A = 'https://www.burgerking.it';

export function BkSiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="footer-container max-w-1600 mx-auto">
        <div className="footer-line-1" />
        <div className="footer-line-2" />
        <div className="footer-content grid grid-cols-1 sm:grid-cols-12 gap-4 px-8 md:px-12 pt-12 pb-4 text-center sm:text-left">
          <div className="sm:col-span-7 xl:col-span-6 p-4">
            <p className="text-[2.4rem] leading-[2.3rem] text-bk-orange pb-4 font-flame">
              FLAME GRILLING SINCE 1954
            </p>
            <p className="subtitle text-[1.2rem] leading-[1.5rem] pb-8 text-bk-avana">
              Burger King Restaurants Italia S.p.A. (Società a Socio Unico).
              <br />
              Sottoposta a direzione e coordinamento di Burger King SEE S.A.
              <br />
              Strada 1 Palazzo F4-F5, 20057, Assago Milanofiori (MI).
              <br />
              Per informazioni o reclami: reclami_complimenti@burgerking.it
            </p>
            <div className="footer-social flex justify-center sm:justify-start">
              <a
                href="https://www.facebook.com/BurgerKingItalia/"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-social"
                aria-label="Facebook"
              >
                <img
                  src={`${A}/assets/images/icon-fb.svg?v=1709305347`}
                  className="icon-social-img svg-avana w-6 h-6"
                  alt=""
                />
              </a>
              <a
                href="https://www.instagram.com/burgerking_it/"
                target="_blank"
                rel="noopener noreferrer"
                className="icon-social"
                aria-label="Instagram"
              >
                <img
                  src={`${A}/assets/images/Icon-instagram.svg?v=1709305347`}
                  className="icon-social-img svg-avana w-6 h-6"
                  alt=""
                />
              </a>
            </div>
          </div>
          <div className="sm:col-span-5 xl:col-span-6 p-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <ul className="footer-menu list-none m-0 p-0">
                <li className="pb-2">
                  <span className="footer-menu-item">Cookie Policy</span>
                </li>
                <li className="pb-2">
                  <span className="footer-menu-item">Privacy Policy</span>
                </li>
              </ul>
              <ul className="footer-menu list-none m-0 p-0">
                <li className="pb-2">
                  <Link href="/novita" className="footer-menu-item">
                    Novità
                  </Link>
                </li>
                <li className="pb-2">
                  <Link href="/qualita" className="footer-menu-item">
                    Qualità BK
                  </Link>
                </li>
              </ul>
              <ul className="footer-menu list-none m-0 p-0">
                <li className="pb-2">
                  <Link href="/prodotti" className="footer-menu-item">
                    Prodotti
                  </Link>
                </li>
                <li className="pb-2">
                  <Link href="/promo" className="footer-menu-item">
                    Promo
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-tm text-center text-bk-avana text-[1.2rem] leading-[1.5rem] px-8 md:px-12 py-4 border-t border-bk-avana/18 bg-bk-brown">
          TM &amp; ©2026 Burger King Company LLC. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}