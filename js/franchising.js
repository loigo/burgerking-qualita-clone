/**
 * Franchising — accordion e form eventi
 */
(function () {
  'use strict';

  function initAccordion() {
    document.querySelectorAll('[data-franchise-accordion]').forEach(function (root) {
      root.querySelectorAll('.franchise-acc-trigger').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const panel = btn.closest('.franchise-acc-item');
          const body = panel?.querySelector('.franchise-acc-body');
          if (!body) return;
          const open = body.classList.toggle('hidden');
          btn.setAttribute('aria-expanded', open ? 'false' : 'true');
          panel.classList.toggle('is-open', !open);
        });
      });
    });
  }

  function initDemoForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Candidatura inviata (demo clone front-end). Grazie per il tuo interesse!');
      form.reset();
    });
  }

  function init() {
    initAccordion();
    initDemoForm('franchise-eventi-form');
    initDemoForm('franchise-application-form');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('bk-layout-ready', init);
})();