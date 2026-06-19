/** Script padrão incluído no final de cada página */
(function () {
  const page = document.body.dataset.page || 'home';
  const base = window.BK_BASE || '';
  let pending = 0;

  function dispatchLayoutReady() {
    document.dispatchEvent(new Event('bk-layout-ready'));
    if (typeof window.BK_initCookieConsent === 'function') {
      window.BK_initCookieConsent();
    }
    if (typeof window.BK_initAccessibilityWidget === 'function') {
      window.BK_initAccessibilityWidget();
    }
  }

  function scriptLoaded() {
    pending -= 1;
    if (pending === 0) dispatchLayoutReady();
  }

  function loadWidgetScripts() {
    if (!window.__bkCookieConsentLoaded) {
      window.__bkCookieConsentLoaded = true;
      pending += 1;
      const cookieScript = document.createElement('script');
      cookieScript.src = base + 'js/cookie-consent.js';
      cookieScript.onload = scriptLoaded;
      document.body.appendChild(cookieScript);
    }

    if (!window.__bkAccessibilityLoaded) {
      window.__bkAccessibilityLoaded = true;
      pending += 1;
      const a11yScript = document.createElement('script');
      a11yScript.src = base + 'js/accessibility-widget.js';
      a11yScript.onload = scriptLoaded;
      document.body.appendChild(a11yScript);
    }

    if (pending === 0) {
      dispatchLayoutReady();
    }
  }

  function initLayout() {
    if (typeof initBKLayout === 'function') {
      initBKLayout(page);
    }
    loadWidgetScripts();
  }

  if (!window.ACSW_PROFILE_ICONS) {
    const iconScript = document.createElement('script');
    iconScript.src = base + 'js/acsw-icons-data.js';
    iconScript.onload = initLayout;
    iconScript.onerror = function () {
      console.warn('ACSW icons failed to load; continuing without profile icons.');
      initLayout();
    };
    document.head.appendChild(iconScript);
  } else {
    initLayout();
  }
})();