/**
 * Componentes compartilhados — Header, Footer, Mobile Bar
 * Navegação interna completa do clone BK Italia
 */
(function () {
  'use strict';

  window.BK_ASSETS = 'https://www.burgerking.it';

  function getPages() {
    const b = window.BK_BASE || '';
    return {
      home: `${b}index.html`,
      qualita: `${b}qualita-bk.html`,
      prodotti: `${b}prodotti.html`,
      novita: `${b}novita.html`,
      promo: `${b}promo.html`,
      bkcafe: `${b}bk-cafe.html`,
      loyalty: `${b}loyalty.html`,
      aboutUs: `${b}about-us.html`,
      pressRoom: `${b}press-room.html`,
      contatti: `${b}contatti.html`,
      storeLocator: `${b}trova-un-ristorante.html`,
      franchising: `${b}franchising.html`,
      accessibilita: `${b}accessibilita.html`,
      promoBigKing: `${b}promo/big_king__bibita_small__snack_small/`,
    };
  }

  window.BK_PAGES = getPages();

  function isActive(page, current) {
    return page === current ? ' active' : '';
  }

  function renderHeader(currentPage) {
    const P = getPages();
    const A = window.BK_ASSETS;
    const tuttoActive = ['about', 'press'].includes(currentPage) ? ' active' : '';

    return `
    <header id="header" class="bg-bk-avana text-bk-brown sticky top-0 z-[5000] font-flame text-[1.6rem] leading-[1.9rem]">
      <div class="max-w-1600 mx-auto px-6 xl:px-12">
        <div class="flex items-center py-2">
          <div class="header-col1 flex items-center w-[46%]">
            <a href="${P.storeLocator}" class="flex items-center hover:text-bk-orange transition-colors no-underline text-bk-brown${isActive('store-locator', currentPage)}">
              <img src="${A}/assets/images/icon-store-locator.svg?v=1709305347" alt="" class="svg-brown w-5 h-5 mr-2.5" aria-hidden="true">
              <span class="hidden sm:inline">Trova un ristorante</span>
              <span class="sm:hidden">Trova</span>
            </a>
            <a href="${P.franchising}" class="hidden xl:flex items-center hover:text-bk-orange transition-colors no-underline text-bk-brown header-col1-link${isActive('franchising', currentPage)}">
              <img src="${A}/assets/images/icon-ristornati.svg?v=1709305347" alt="" class="svg-brown w-5 h-5 mr-2.5" aria-hidden="true">
              <span>Diventa Franchisee</span>
            </a>
          </div>
          <div class="w-[8%] flex justify-center py-4">
            <a href="${P.home}" class="block" aria-label="Burger King Italia">
              <img src="${A}/assets/images/logo_color.svg?v=1709305347" alt="Burger King Italia" class="w-full max-w-[68px] min-w-[44px]">
            </a>
          </div>
          <div class="w-[46%] flex justify-end items-center">
            <nav class="hidden xl:flex items-center" aria-label="Menu principale">
              <ul class="flex items-center gap-3 2xl:gap-6 list-none m-0 p-0">
                <li><a href="${P.qualita}" class="nav-link${isActive('qualita', currentPage)}">Qualità BK</a></li>
                <li><a href="${P.prodotti}" class="nav-link${isActive('prodotti', currentPage)}">Prodotti</a></li>
                <li><a href="${P.novita}" class="nav-link${isActive('novita', currentPage)}">Novità</a></li>
                <li><a href="${P.promo}" class="nav-link${isActive('promo', currentPage)}">Promo</a></li>
                <li><a href="${P.bkcafe}" class="nav-link${isActive('bkcafe', currentPage)}">BK Café</a></li>
                <li><a href="${P.loyalty}" class="nav-link${isActive('loyalty', currentPage)}">Loyalty</a></li>
                <li class="relative">
                  <button id="dropdown-toggle" class="nav-link dropdown-toggle bg-transparent border-0 cursor-pointer font-flame${tuttoActive}" aria-expanded="false">Tutto su di noi</button>
                  <ul id="dropdown-menu" class="dropdown-menu hidden absolute right-0 top-full mt-1 list-none m-0 p-0 z-50">
                    <li><a href="${P.aboutUs}" class="dropdown-item${isActive('about', currentPage)}">About us</a></li>
                    <li><a href="${P.pressRoom}" class="dropdown-item${isActive('press', currentPage)}">Press room</a></li>
                    <li><a href="https://careers.qsrp.com/" target="_blank" rel="noopener" class="dropdown-item">Careers</a></li>
                  </ul>
                </li>
                <li><a href="${P.contatti}" class="nav-link${isActive('contatti', currentPage)}">Contatti</a></li>
              </ul>
            </nav>
            <button id="menu-open" class="navbar-toggler xl:hidden border-0 bg-transparent p-2 cursor-pointer" aria-label="Apri menu">
              <span class="block w-[2.6rem] h-[1.9rem] bg-no-repeat bg-center bg-contain" style="background-image:url('${A}/assets/images/menu.svg'); filter:invert(15%) sepia(16%) saturate(3503%) hue-rotate(338deg) brightness(96%) contrast(93%);"></span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div id="menu-overlay" class="hidden fixed inset-0 bg-black/40 z-[6000]"></div>

    <aside id="mobile-menu" class="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-bk-brown z-[7000] overflow-y-auto">
      <div class="flex items-center justify-between px-8 py-4">
        <img src="${A}/assets/images/logo_white.svg?v=1709305347" alt="Burger King Italia" class="max-w-[44px]">
        <button id="menu-close" class="border-0 bg-transparent cursor-pointer p-2" aria-label="Chiudi menu">
          <span class="block w-8 h-8 bg-no-repeat bg-center bg-contain svg-orange" style="background-image:url('${A}/assets/images/icon-close.svg');"></span>
        </button>
      </div>
      <nav class="font-flame" aria-label="Menu mobile">
        <ul class="list-none m-0 p-0">
          <li class="nav-item"><a href="${P.storeLocator}" class="nav-link flex items-center px-12 py-4 text-bk-avana no-underline${isActive('store-locator', currentPage) ? ' !text-bk-orange' : ''}"><img src="${A}/assets/images/icon-store-locator.svg?v=1709305347" class="svg-avana w-5 h-5 mr-4" alt="">Trova un ristorante</a></li>
          <li class="nav-item"><a href="${P.franchising}" class="nav-link flex items-center px-12 py-4 text-bk-avana no-underline${isActive('franchising', currentPage) ? ' !text-bk-orange' : ''}"><img src="${A}/assets/images/icon-ristornati.svg?v=1709305347" class="svg-avana w-5 h-5 mr-4" alt="">Diventa Franchisee</a></li>
          <li class="nav-item"><a href="${P.qualita}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('qualita', currentPage) ? ' !text-bk-orange' : ''}">Qualità BK</a></li>
          <li class="nav-item"><a href="${P.prodotti}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('prodotti', currentPage) ? ' !text-bk-orange' : ''}">Prodotti</a></li>
          <li class="nav-item"><a href="${P.novita}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('novita', currentPage) ? ' !text-bk-orange' : ''}">Novità</a></li>
          <li class="nav-item"><a href="${P.promo}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('promo', currentPage) ? ' !text-bk-orange' : ''}">Promo</a></li>
          <li class="nav-item"><a href="${P.bkcafe}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('bkcafe', currentPage) ? ' !text-bk-orange' : ''}">BK Café</a></li>
          <li class="nav-item"><a href="${P.loyalty}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('loyalty', currentPage) ? ' !text-bk-orange' : ''}">Loyalty</a></li>
          <li class="nav-item">
            <button id="mobile-dropdown-toggle" class="nav-link block w-full text-left px-12 py-4 bg-transparent border-0 cursor-pointer font-flame text-bk-avana">Tutto su di noi</button>
            <ul id="mobile-dropdown-menu" class="hidden list-none m-0 px-12 pb-2">
              <li><a href="${P.aboutUs}" class="dropdown-item">About us</a></li>
              <li><a href="${P.pressRoom}" class="dropdown-item">Press room</a></li>
              <li><a href="https://careers.qsrp.com/" target="_blank" rel="noopener" class="dropdown-item">Careers</a></li>
            </ul>
          </li>
          <li class="nav-item"><a href="${P.contatti}" class="nav-link block px-12 py-4 text-bk-avana no-underline${isActive('contatti', currentPage) ? ' !text-bk-orange' : ''}">Contatti</a></li>
        </ul>
        <div class="offcanvas-banner">
          <img src="${A}/assets/img/console/appUser/banner/332_desktop_it.png?v=1710414846" alt="" class="offcanvas-banner-img">
          <div class="p-4 text-bk-avana">
            <div class="text-[1.6rem] font-flame">SCARICA LA NOSTRA APP</div>
            <div class="text-[1.2rem] font-flame-sans">E goditi dei vantaggi da vero King!</div>
          </div>
        </div>
      </nav>
    </aside>`;
  }

  function renderFooter() {
    const P = getPages();
    const A = window.BK_ASSETS;
    return `
    <footer class="mt-auto">
      <div class="footer-container max-w-1600 mx-auto">
        <div class="footer-line-1"></div>
        <div class="footer-line-2"></div>
        <div class="footer-content grid grid-cols-1 sm:grid-cols-12 gap-4 px-8 md:px-12 pt-12 pb-4 text-center sm:text-left">
          <div class="sm:col-span-7 xl:col-span-6 p-4">
            <p class="text-[2.4rem] leading-[2.3rem] text-bk-orange pb-4 font-flame">FLAME GRILLING SINCE 1954</p>
            <p class="subtitle text-[1.2rem] leading-[1.5rem] pb-8 text-bk-avana">
              Burger King Restaurants Italia S.p.A. (Società a Socio Unico).<br>
              Sottoposta a direzione e coordinamento di Burger King SEE S.A. ai sensi degli articoli 2497 e ss. del c.c.<br>
              Strada 1 Palazzo F4-F5, 20057, Assago Milanofiori (MI).<br>
              Numero d'Iscrizione al Registro delle Imprese di Milano 08876390967.<br>
              Capitale sociale di Euro 5.000.000,00 i.v.<br>
              Per informazioni o reclami scrivere all' indirizzo: reclami_complimenti@burgerking.it
            </p>
            <div class="footer-social flex justify-center sm:justify-start">
              <a href="https://www.facebook.com/BurgerKingItalia/" target="_blank" rel="noopener" class="icon-social" aria-label="Facebook"><img src="${A}/assets/images/icon-fb.svg?v=1709305347" class="icon-social-img svg-avana w-6 h-6" alt=""></a>
              <a href="https://www.youtube.com/user/BurgerKingItalia" target="_blank" rel="noopener" class="icon-social" aria-label="YouTube"><img src="${A}/assets/images/Icon-youtube.svg?v=1709305347" class="icon-social-img svg-avana w-6 h-6" alt=""></a>
              <a href="https://www.instagram.com/burgerking_it/" target="_blank" rel="noopener" class="icon-social" aria-label="Instagram"><img src="${A}/assets/images/Icon-instagram.svg?v=1709305347" class="icon-social-img svg-avana w-6 h-6" alt=""></a>
              <a href="https://it.linkedin.com/company/burger-king-restaurants-italia" target="_blank" rel="noopener" class="icon-social" aria-label="LinkedIn"><img src="${A}/assets/images/Icon-linkedin.svg?v=1709305347" class="icon-social-img svg-avana w-6 h-6" alt=""></a>
            </div>
          </div>
          <div class="sm:col-span-5 xl:col-span-6 p-4">
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <ul class="footer-menu list-none m-0 p-0">
                <li class="pb-2"><a href="#" class="footer-menu-item">Modello D.lgs 231 e Codici Etici</a></li>
                <li class="pb-2"><a href="#" class="footer-menu-item">Cookie Policy</a></li>
                <li class="pb-2"><a href="#" class="footer-menu-item">Privacy Policy</a></li>
                <li class="pb-2"><a href="#" class="footer-menu-item">Informativa Privacy selezione candidati</a></li>
              </ul>
              <ul class="footer-menu list-none m-0 p-0">
                <li class="pb-2"><a href="${P.pressRoom}" class="footer-menu-item">Press</a></li>
                <li class="pb-2"><a href="#" class="footer-menu-item">Terms and conditions</a></li>
                <li class="pb-2"><a href="#" class="footer-menu-item">Regolamenti</a></li>
                <li class="pb-2"><a href="#" class="footer-menu-item">Regolamento Premi On Fire Club</a></li>
              </ul>
              <ul class="footer-menu list-none m-0 p-0">
                <li class="pb-2"><a href="#" class="footer-menu-item">Allergeni</a></li>
                <li class="pb-2"><a href="${P.accessibilita}" class="footer-menu-item">Accessibilità</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-tm text-center text-bk-avana text-[1.2rem] leading-[1.5rem] px-8 md:px-12 py-4 border-t border-bk-avana/18 bg-bk-brown">
          TM &amp; ©2025 Burger King Company LLC, Utilizzato in conformità o licenza. Tutti i diritti riservati.
        </div>
      </div>
    </footer>`;
  }

  function renderMobileBar(currentPage) {
    const P = getPages();
    const A = window.BK_ASSETS;
    return `
    <div id="mobile-bar" class="fixed bottom-0 left-0 w-full bg-white z-[900] md:hidden border-t border-gray-200">
      <div class="grid grid-cols-3 text-center">
        <a href="${P.prodotti}" class="mobile-bar-item no-underline py-4 flex flex-col items-center${isActive('prodotti', currentPage) ? ' text-bk-orange' : ' text-bk-brown'}">
          <img src="${A}/assets/images/icon-product.svg?v=1709305347" class="svg-brown w-5 h-5 mb-1" alt="">
          <span class="text-[0.8rem] leading-[1rem] font-flame-sans">Prodotti</span>
        </a>
        <a href="${P.promo}" class="mobile-bar-item no-underline py-4 flex flex-col items-center${isActive('promo', currentPage) ? ' text-bk-orange' : ' text-bk-brown'}">
          <img src="${A}/assets/images/icon-promo.svg?v=1709305347" class="svg-brown w-5 h-5 mb-1" alt="">
          <span class="text-[0.8rem] leading-[1rem] font-flame-sans">Promo</span>
        </a>
        <a href="${P.storeLocator}" class="mobile-bar-item no-underline py-4 flex flex-col items-center${isActive('store-locator', currentPage) ? ' text-bk-orange' : ' text-bk-brown'}">
          <img src="${A}/assets/images/icon-store-locator.svg?v=1709305347" class="svg-brown w-5 h-5 mb-1" alt="">
          <span class="text-[0.8rem] leading-[1rem] font-flame-sans">Store Locator</span>
        </a>
      </div>
    </div>`;
  }

  window.renderAppBanner = function () {
    const A = window.BK_ASSETS;
    return `
    <section class="pb-12">
      <div class="max-w-screen-xl mx-auto div-app-banner mx-4 md:mx-auto rounded-xl overflow-hidden" style="background-color:#D62300;">
        <div class="grid grid-cols-1 md:grid-cols-12 items-center">
          <div class="md:col-span-4 flex justify-center p-6">
            <img src="${A}/assets/img/console/appUser/banner/331_desktop_it.png?v=1710414705" alt="SCARICA LA NOSTRA APP" class="w-[70%] max-w-xs">
          </div>
          <div class="md:col-span-5 text-center text-bk-avana p-6">
            <div class="font-flamebold text-[3.5rem] leading-[3.4rem] pb-4">SCARICA LA NOSTRA APP</div>
            <div class="font-flame text-[2.4rem] leading-[2.6rem]">E goditi dei vantaggi da vero King!</div>
          </div>
          <div class="md:col-span-3 hidden md:flex justify-center p-6">
            <img src="${A}/assets/img/console/appUser/banner/703_desktop_it.jpg?v=1779286122" alt="" class="max-w-[300px] rounded-lg">
          </div>
        </div>
      </div>
    </section>`;
  };

  function renderCookieLevel(name, id, checked, disabled) {
    const disabledClass = disabled ? ' CybotCookiebotDialogBodyLevelButtonSliderWrapperDisabled' : '';
    const inputClass = disabled
      ? 'CybotCookiebotDialogBodyLevelButton CybotCookiebotDialogBodyLevelButtonDisabled'
      : 'CybotCookiebotDialogBodyLevelButton CybotCookiebotDialogBodyLevelConsentCheckbox';
    const disabledAttr = disabled ? ' disabled' : '';
    const checkedAttr = checked ? ' checked' : '';
    const roleAttr = disabled ? '' : ' role="switch" tabindex="0"';
    return `
      <div class="CybotCookiebotDialogBodyLevelButtonWrapper">
        <label class="CybotCookiebotDialogBodyLevelButtonLabel" for="${id}">
          <strong class="CybotCookiebotDialogBodyLevelButtonDescription">${name}</strong>
        </label>
        <div class="CybotCookiebotDialogBodyLevelButtonSliderWrapper${disabledClass}">
          <input type="checkbox" id="${id}" class="${inputClass}"${checkedAttr}${disabledAttr}${roleAttr}>
          <span class="CybotCookiebotDialogBodyLevelButtonSlider"></span>
        </div>
      </div>`;
  }

  function renderCookieBanner() {
    const base = window.BK_BASE || '';
    return `
    <div id="CybotCookiebotDialog" data-template="bottom" class="CybotEdge CybotMultilevel cookie-banner-hidden" role="dialog" aria-modal="true" aria-labelledby="CybotCookiebotDialogBodyContentTitle" aria-hidden="true" lang="it">
      <div class="CybotCookiebotDialogEdgeBorder" aria-hidden="true"><span></span><span></span></div>
      <div class="CybotCookiebotDialogContentWrapper">
        <div id="CybotCookiebotDialogHeader">
          <div id="CybotCookiebotDialogHeaderLogosWrapper">
            <a href="https://www.cookiebot.com/it/" target="_blank" rel="noopener nofollow" id="CybotCookiebotDialogPoweredbyCybot" aria-label="Cookiebot di Usercentrics">
              <img src="${base}assets/cookiebot-powered.svg" alt="Cookiebot by Usercentrics" width="175" height="19">
            </a>
          </div>
        </div>
        <div id="CybotCookiebotDialogTabContent">
          <div id="CybotCookiebotDialogBody" class="CybotCookiebotDialogTabPanel">
            <div class="CybotCookiebotDialogMainRow">
              <div id="CybotCookiebotDialogBodyContent" class="CybotCookiebotScrollArea">
                <div id="CybotCookiebotDialogBodyContentTitle" class="CybotCookiebotDialogBodyContentHeading" role="heading" aria-level="2">Questo sito web utilizza i cookie</div>
                <div id="CybotCookiebotDialogBodyContentText">Utilizziamo i cookie per personalizzare contenuti ed annunci, per fornire funzionalità dei social media e per analizzare il nostro traffico. Condividiamo inoltre informazioni sul modo in cui utilizzi il nostro sito con i nostri partner che si occupano di analisi dei dati web, pubblicità e social media, i quali potrebbero combinarle con altre informazioni che hai fornito loro o che hanno raccolto dal tuo utilizzo dei loro servizi.</div>
              </div>
              <div id="CybotCookiebotDialogFooter" class="CybotCookiebotScrollContainer">
                <div id="CybotCookiebotDialogBodyButtons">
                  <div id="CybotCookiebotDialogBodyButtonsWrapper">
                    <button type="button" id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll" class="CybotCookiebotDialogBodyButton CybotCookiebotDialogBodyButtonAccept">Accetta tutti</button>
                    <button type="button" id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection" class="CybotCookiebotDialogBodyButton CybotCookiebotDialogBodyButtonSelection">Accetta selezionati</button>
                    <button type="button" id="CybotCookiebotDialogBodyButtonDecline" class="CybotCookiebotDialogBodyButton CybotCookiebotDialogBodyButtonDecline">Rifiuta</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="CybotCookiebotDialogBodyBottomWrapper">
              <div id="CybotCookiebotDialogBodyLevelWrapper">
                <div id="CybotCookiebotDialogBodyLevelButtons">
                  <div id="CybotCookiebotDialogBodyLevelButtonsRow">
                    <div id="CybotCookiebotDialogBodyFieldsetInnerContainer" role="group" aria-label="Selezione del consenso">
                      ${renderCookieLevel('Necessari', 'CybotCookiebotDialogBodyLevelButtonNecessary', true, true)}
                      ${renderCookieLevel('Preferenze', 'CybotCookiebotDialogBodyLevelButtonPreferences', false, false)}
                      ${renderCookieLevel('Statistiche', 'CybotCookiebotDialogBodyLevelButtonStatistics', false, false)}
                      ${renderCookieLevel('Marketing', 'CybotCookiebotDialogBodyLevelButtonMarketing', false, false)}
                    </div>
                  </div>
                </div>
              </div>
              <div id="CybotCookiebotDialogBodyEdgeMoreDetails">
                <a href="#" id="CybotCookiebotDialogBodyEdgeMoreDetailsLink">Mostra dettagli</a>
              </div>
            </div>
            <div id="CybotCookiebotDialogDetailExpanded" class="CybotCookiebotDialogHide" hidden>
              <p class="CybotCookiebotDialogDetailText">I cookie necessari aiutano a rendere fruttifero un sito web abilitando funzioni di base come la navigazione della pagina e l'accesso alle aree protette del sito web. I cookie di preferenza consentono a un sito web di ricordare informazioni che cambiano il modo in cui il sito web si comporta o si presenta. I cookie statistici aiutano i proprietari del sito web a capire come i visitatori interagiscono con i siti web raccogliendo e riportando informazioni in forma anonima. I cookie di marketing vengono utilizzati per tracciare i visitatori sui siti web al fine di mostrare annunci pertinenti e coinvolgenti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function acswIcon(name) {
    const profileIcons = window.ACSW_PROFILE_ICONS || {};
    if (profileIcons[name]) return profileIcons[name];

    const icons = {
      trigger: '<svg viewBox="0 0 100 131.3" aria-hidden="true"><path fill="currentColor" d="M71.6 131.3c1 0 2.1-.3 3.1-.8 3.9-1.8 5.5-6.2 3.6-10.1 0 0-14.3-32.7-16.9-44.7-1-4.2-1.6-15.3-1.8-20.5 0-1.8 1-3.4 2.6-3.9l32-9.6c3.9-1 6.2-5.5 5.2-9.4s-5.5-6.2-9.4-5.2c0 0-29.6 9.6-40.3 9.6-10.4 0-39.8-9.4-39.8-9.4-3.9-1-8.3.8-9.6 4.7-1.3 4.2 1 8.6 5.2 9.6l32 9.6c1.6.5 2.9 2.1 2.6 3.9-.3 5.2-.8 16.4-1.8 20.5-2.6 12-16.9 44.7-16.9 44.7-1.8 3.9 0 8.3 3.6 10.1 1 .5 2.1.8 3.1.8 2.9 0 5.7-1.6 6.8-4.4l15.3-31.2L64.8 127c1.3 2.7 3.9 4.3 6.8 4.3"/><circle cx="50.3" cy="14.6" r="14.6" fill="#fff"/></svg>',
      reset: '<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M768.435 65.442c-20.383-19.598-52.797-18.961-72.392 1.423-19.599 20.384-18.964 52.796 1.423 72.394l93.993 90.373h-535.46c-141.388 0-256 114.629-256 256.01v26.259c0 28.275 22.923 51.249 51.2 51.249s51.2-22.922 51.2-51.199v-26.309c0-84.834 68.772-153.61 153.6-153.61h535.46l-93.993 90.373c-20.388 19.598-21.023 52.01-1.423 72.394 19.594 20.382 52.009 21.022 72.392 1.423l185.641-178.481a51.203 51.203 0 0 0 0-73.818zm-512.87 893.017c20.384 19.599 52.796 18.959 72.394-1.423s18.961-52.797-1.423-72.392l-93.997-90.373H768c141.389 0 256-114.632 256-256.01v-26.26c0-28.277-22.922-51.25-51.2-51.25s-51.2 22.923-51.2 51.2v26.31c0 84.833-68.772 153.61-153.6 153.61H232.539l93.997-90.373c20.384-19.599 21.021-52.009 1.423-72.397-19.598-20.382-52.009-21.019-72.394-1.423L69.927 706.161a51.197 51.197 0 0 0 0 73.815z"/></svg>',
      statement: '<svg viewBox="0 0 1075 1024" aria-hidden="true"><path fill="currentColor" d="M179.2 51.15H896c84.833 0 153.6 68.769 153.6 153.6v309.851c0 80.886-47.606 154.194-121.503 187.095L742.4 784.374v212.982c0 22.676-29.317 34.913-48.297 20.152l-118.42-92.083c-21.914-17.044-54.252-17.044-76.163 0l-118.422 92.083c-18.978 14.761-48.297 2.524-48.297-20.152V784.374l-185.699-82.678C73.209 668.795 25.601 595.487 25.601 514.601V204.75c0-84.831 68.769-153.6 153.6-153.6zm563.2 621.132 144.051-64.133c36.946-16.451 60.749-53.105 60.749-93.548V204.75c0-28.277-22.922-51.2-51.2-51.2H179.2c-28.277 0-51.2 22.923-51.2 51.2v309.851c0 40.443 23.804 77.097 60.75 93.548l144.05 64.133V511.95c0-56.554 45.846-102.4 102.4-102.4H640c56.556 0 102.4 45.846 102.4 102.4z"/></svg>',
      hide: '<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M993.167 103.192c19.994-19.995 19.994-52.413 0-72.408s-52.413-19.995-72.407 0L773.714 177.83c-75.407-47.375-208.338-80.229-347.192-53.821C272.253 153.348 111.929 255.316 9.448 484.494a51.2 51.2 0 0 0 4.188 49.374c21.122 31.565 57.575 80.538 99.542 126.73 27.144 29.88 58.931 61.251 92.117 85.647L30.834 920.709c-19.995 19.994-19.995 52.413 0 72.407s52.413 19.994 72.408 0zM445.653 224.605c102.458-19.485 196.963 1.448 252.797 28.489l-92.698 92.699c-68.065-31.082-151.168-17.592-205.824 39.517-52.718 55.084-63.734 134.826-33.904 200.208l-87.174 87.173c-26.827-17.224-58.301-46.188-89.88-80.947-28.74-31.636-54.785-64.927-73.879-91.374 88.851-180.491 215.482-253.879 330.561-275.765zm473.239 92.206c-19.476-20.501-51.881-21.332-72.381-1.856-20.506 19.475-21.335 51.883-1.859 72.383 26.639 28.043 45.384 59.887 57.539 85.33a360 360 0 0 1 9.708 22.175C810.83 670.969 633.632 784.275 432.806 745.563c-27.766-5.356-54.614 12.815-59.966 40.581s12.817 54.615 40.583 59.965c265.47 51.174 486.654-109.087 599.653-322.724a51.2 51.2 0 0 0 3.978-37.969l-49.239 14.031c49.239-14.031 49.244-14.018 49.239-14.031l-.015-.052-.056-.202-.108-.373-.328-1.097c-.266-.884-.635-2.071-1.106-3.536a338 338 0 0 0-4.116-11.96c-3.625-9.942-9.103-23.693-16.737-39.668-15.135-31.685-39.414-73.527-75.694-111.718z"/></svg>',
      close: '<svg viewBox="0 0 1075 1024" aria-hidden="true"><path fill="currentColor" d="M64.557 892.892c-29.992 29.993-29.992 78.623 0 108.616 29.992 29.988 78.62 29.988 108.612 0l380.893-380.897 380.897 380.897c29.993 29.988 78.618 29.988 108.611 0 29.993-29.993 29.993-78.623 0-108.616L662.678 512l380.892-380.894c29.993-29.992 29.993-78.619 0-108.612s-78.618-29.992-108.611 0L554.062 403.388 173.169 22.494c-29.992-29.992-78.619-29.992-108.612 0s-29.992 78.619 0 108.612L445.451 512z"/></svg>',
      search: '<svg viewBox="0 0 1075 1024" aria-hidden="true"><path fill="currentColor" d="M461.977 103.143c-174.948 0-316.771 141.823-316.771 316.771s141.823 316.772 316.771 316.772c174.946 0 316.77-141.824 316.77-316.772s-141.824-316.771-316.77-316.771M42.062 419.914C42.062 188.002 230.064 0 461.976 0s419.913 188.002 419.913 419.914c0 97.37-33.137 187-88.755 258.225l257.823 257.823c20.142 20.142 20.142 52.792 0 72.934-20.137 20.137-52.792 20.137-72.934 0L720.2 751.073c-71.224 55.613-160.855 88.755-258.223 88.755-231.912 0-419.914-188.001-419.914-419.914z"/></svg>',
      chevron: '<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M62.81 243.189c29.279-27.831 75.575-26.658 103.406 2.621l361.461 380.259L889.139 245.81c27.833-29.279 74.128-30.452 103.409-2.621 29.277 27.831 30.452 74.128 2.619 103.406L580.691 782.628c-13.804 14.526-32.973 22.747-53.014 22.747s-39.205-8.221-53.012-22.747L60.189 346.595c-27.831-29.279-26.658-75.575 2.621-103.406"/></svg>',
      flagIt: '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCA1MCAzMy41Ij48cGF0aCBmaWxsPSIjMUQ5MjUzIiBkPSJNMCAwaDE2LjY0NnYzMy41SDB6Ii8+PHBhdGggZmlsbD0iI0ZBRkFGQSIgZD0iTTE2LjY0NiAwaDE2LjcwOHYzMy41SDE2LjY0NnoiLz48cGF0aCBmaWxsPSIjQ0UyQjM3IiBkPSJNMzMuMzU0IDBINTB2MzMuNUgzMy4zNTR6Ii8+PC9zdmc+" alt="" aria-hidden="true">',
    };
    return icons[name] || '';
  }

  function renderAccessibilityWidget() {
    const profiles = [
      { id: 'epilepsy', cls: 'seizures', icon: 'seizures', title: 'Sicurezza epilessia', desc: 'Riduce il movimento e i trigger visivi' },
      { id: 'lowvision', cls: 'vision', icon: 'vision', title: 'Supporto per ipovisione', desc: 'Migliora chiarezza e contrasto' },
      { id: 'adhd', cls: 'adhd', icon: 'adhd', title: 'ADHD Friendly', desc: 'Supporta la concentrazione e riduce le distrazioni' },
      { id: 'cognitive', cls: 'cognitive', icon: 'cognitive', title: 'Supporto alla lettura e cognitivo', desc: 'Semplifica lettura e navigazione' },
      { id: 'keyboard', cls: 'motor', icon: 'motor', title: 'Navigazione da tastiera', desc: 'Usa il sito web con la tastiera' },
      { id: 'screenreader', cls: 'blind', icon: 'blind', title: 'Compatibilità con il lettore di schermo', desc: 'Ottimizza per gli screen-reader' },
      { id: 'elderly', cls: 'senior', icon: 'senior', title: 'Persone anziane', desc: 'Migliora la visibilità e il comfort di lettura' },
    ];
    const rows = profiles.map(function (p) {
      return `
        <button type="button" role="switch" class="acsw-profile acsw-profile-${p.cls}" data-profile="${p.id}" aria-checked="false" aria-label="${p.title}">
          <div class="acsw-profile-toggle">
            <div class="acsw-toggle" aria-hidden="true">
              <span class="acsw-toggle__option">NO</span>
              <span class="acsw-toggle__option acsw-toggle__option--on">SÌ</span>
            </div>
          </div>
          <div class="acsw-profile-content">
            <span class="acsw-profile-content__name">${p.title}</span>
            <span class="acsw-profile-content__text">${p.desc}</span>
            <div class="acsw-profile-content__icon">${acswIcon(p.icon)}</div>
          </div>
        </button>`;
    }).join('');

    return `
    <div id="acsw-root" lang="it">
      <button type="button" id="acsw-trigger" class="acsw-trigger" aria-label="Opzioni di accessibilità aperte, dichiarazione e aiuto" title="Regolazioni per l'accessibilità">
        <span class="acsw-trigger-icon">${acswIcon('trigger')}</span>
      </button>
      <div id="acsw-overlay" class="acsw-overlay" aria-hidden="true"></div>
      <div id="acsw-panel" class="acsw-widget-container" aria-hidden="true">
        <div class="acsw-panel-dialog" role="dialog" aria-modal="true" aria-labelledby="acsw-panel-title">
          <div class="acsw-panel-main">
            <div class="acsw-top">
              <div class="acsw-header">
                <button type="button" id="acsw-btn-close" class="acsw-close-button" aria-label="Chiudi l'interfaccia di accessibilità">${acswIcon('close')}</button>
                <div class="acsw-header-right">
                  <button type="button" class="acsw-language-selector" aria-label="Italiano">
                    <span class="acsw-language-flag">${acswIcon('flagIt')}</span>
                    <span class="acsw-language-text">Italiano</span>
                    <span class="acsw-language-chevron">${acswIcon('chevron')}</span>
                  </button>
                </div>
              </div>
              <div class="acsw-hero">
                <span id="acsw-panel-title" class="acsw-title">Regolazioni per l'accessibilità</span>
                <div class="acsw-actions">
                  <button type="button" id="acsw-btn-reset" class="acsw-hero-button" title="Reset impostazioni">${acswIcon('reset')}<span>Reset impostaz.</span></button>
                  <button type="button" id="acsw-btn-declaration" class="acsw-hero-button" title="Dichiarazione">${acswIcon('statement')}<span>Dichiarazione</span></button>
                  <button type="button" id="acsw-btn-hide" class="acsw-hero-button" title="Nascondi interfaccia">${acswIcon('hide')}<span>Nascon. interf.</span></button>
                </div>
              </div>
              <div class="acsw-search">
                <div class="acsw-search-form">
                  <span class="acsw-search-prepended">${acswIcon('search')}</span>
                  <input type="text" id="acsw-search" class="acsw-search-input" name="acsb_search" autocomplete="off" placeholder="Contenuto poco chiaro? Cerca nel dizionario" aria-label="Contenuto poco chiaro? Cerca nel dizionario">
                  <span class="acsw-search-appended">${acswIcon('chevron')}</span>
                </div>
              </div>
            </div>
            <div class="acsw-main-options">
              <div class="acsw-action-section">
                <div class="acsw-action-section__header">
                  <span class="acsw-action-section__title">Personalizza la tua esperienza di navigazione</span>
                </div>
                <div class="acsw-action-section__content">
                  <div class="acsw-profiles">${rows}</div>
                </div>
              </div>
              <div class="acsw-action-section acsw-action-section--stub">
                <div class="acsw-action-section__header">
                  <span class="acsw-action-section__title">Regolazioni dei contenuti</span>
                </div>
              </div>
            </div>
          </div>
          <footer class="acsw-widget-footer">
            <a href="https://www.accessiway.com/it/home/" target="_blank" rel="noopener">AccessiWay. The Web Accessibility Solution</a>
          </footer>
        </div>
      </div>
    </div>`;
  }

  window.initBKLayout = function (currentPage) {
    window.BK_PAGES = getPages();
    const headerEl = document.getElementById('bk-header');
    const footerEl = document.getElementById('bk-footer');
    const mobileBarEl = document.getElementById('bk-mobile-bar');
    const appBannerEl = document.getElementById('bk-app-banner');

    if (headerEl) headerEl.innerHTML = renderHeader(currentPage);
    if (footerEl) footerEl.innerHTML = renderFooter();
    if (mobileBarEl) mobileBarEl.innerHTML = renderMobileBar(currentPage);
    if (appBannerEl && window.renderAppBanner) appBannerEl.innerHTML = window.renderAppBanner();

    if (!document.getElementById('CybotCookiebotDialog')) {
      const tmp = document.createElement('div');
      tmp.innerHTML = renderCookieBanner();
      document.body.appendChild(tmp.firstElementChild);
    }

    if (!document.getElementById('acsw-root')) {
      const tmpA11y = document.createElement('div');
      tmpA11y.innerHTML = renderAccessibilityWidget();
      document.body.appendChild(tmpA11y.firstElementChild);
    }
  };
})();