/**
 * Cookie consent banner — clone visual Cookiebot Edge (burgerking.it)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'bk_cookiebot_consent';
  const DIALOG_ID = 'CybotCookiebotDialog';

  function getDialog() {
    return document.getElementById(DIALOG_ID);
  }

  function getPrefs() {
    return {
      necessary: true,
      preferences: document.getElementById('CybotCookiebotDialogBodyLevelButtonPreferences')?.checked ?? false,
      statistics: document.getElementById('CybotCookiebotDialogBodyLevelButtonStatistics')?.checked ?? false,
      marketing: document.getElementById('CybotCookiebotDialogBodyLevelButtonMarketing')?.checked ?? false,
    };
  }

  function save(choice, prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: choice, prefs: prefs, ts: Date.now() }));
    hideBanner();
  }

  function hideBanner() {
    const banner = getDialog();
    if (banner) {
      banner.classList.add('cookie-banner-hidden');
      banner.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cookie-banner-open');
    }
  }

  function showBanner() {
    const banner = getDialog();
    if (banner) {
      banner.classList.remove('cookie-banner-hidden');
      banner.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cookie-banner-open');
    }
  }

  function setDetailsOpen(open) {
    const panel = document.getElementById('CybotCookiebotDialogDetailExpanded');
    const link = document.getElementById('CybotCookiebotDialogBodyEdgeMoreDetailsLink');
    const dialog = getDialog();
    if (!panel || !link || !dialog) return;
    panel.hidden = !open;
    panel.classList.toggle('CybotCookiebotDialogHide', !open);
    dialog.classList.toggle('CybotCookiebotDialogExpanded', open);
    link.textContent = open ? 'Nascondi dettagli' : 'Mostra dettagli';
  }

  function initCookieConsent() {
    const banner = getDialog();
    if (!banner || banner.dataset.bound) return;
    banner.dataset.bound = '1';

    if (localStorage.getItem(STORAGE_KEY)) {
      hideBanner();
      return;
    }

    showBanner();

    document.getElementById('CybotCookiebotDialogBodyEdgeMoreDetailsLink')?.addEventListener('click', function (e) {
      e.preventDefault();
      const panel = document.getElementById('CybotCookiebotDialogDetailExpanded');
      setDetailsOpen(panel?.hidden !== false);
    });

    document.getElementById('CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')?.addEventListener('click', function () {
      ['CybotCookiebotDialogBodyLevelButtonPreferences', 'CybotCookiebotDialogBodyLevelButtonStatistics', 'CybotCookiebotDialogBodyLevelButtonMarketing'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.checked = true;
      });
      save('all', { necessary: true, preferences: true, statistics: true, marketing: true });
    });

    document.getElementById('CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection')?.addEventListener('click', function () {
      save('selected', getPrefs());
    });

    document.getElementById('CybotCookiebotDialogBodyButtonDecline')?.addEventListener('click', function () {
      ['CybotCookiebotDialogBodyLevelButtonPreferences', 'CybotCookiebotDialogBodyLevelButtonStatistics', 'CybotCookiebotDialogBodyLevelButtonMarketing'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.checked = false;
      });
      save('reject', { necessary: true, preferences: false, statistics: false, marketing: false });
    });
  }

  function boot() {
    initCookieConsent();
  }

  window.BK_initCookieConsent = initCookieConsent;
  window.BK_resetCookieConsent = function () {
    localStorage.removeItem(STORAGE_KEY);
    showBanner();
    const banner = getDialog();
    if (banner) delete banner.dataset.bound;
    setDetailsOpen(false);
    initCookieConsent();
  };

  document.addEventListener('bk-layout-ready', boot);
  if (document.readyState !== 'loading') boot();
  document.addEventListener('DOMContentLoaded', boot);
})();