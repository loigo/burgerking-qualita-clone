/**
 * AccessiWay widget clone — Regolazioni per l'accessibilità (burgerking.it)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'bk_accessibility_settings';
  const HIDDEN_KEY = 'bk_accessibility_hidden';

  const PROFILES = [
    { id: 'epilepsy', bodyClass: 'a11y-epilepsy' },
    { id: 'lowvision', bodyClass: 'a11y-lowvision' },
    { id: 'adhd', bodyClass: 'a11y-adhd' },
    { id: 'cognitive', bodyClass: 'a11y-cognitive' },
    { id: 'keyboard', bodyClass: 'a11y-keyboard' },
    { id: 'screenreader', bodyClass: 'a11y-screenreader' },
    { id: 'elderly', bodyClass: 'a11y-elderly' },
  ];

  function getBase() {
    return window.BK_BASE || '';
  }

  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function applySettings(settings) {
    PROFILES.forEach(function (p) {
      document.body.classList.toggle(p.bodyClass, !!settings[p.id]);
      const btn = document.querySelector('.acsw-profile[data-profile="' + p.id + '"]');
      if (btn) {
        const on = !!settings[p.id];
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
        const toggle = btn.querySelector('.acsw-toggle');
        if (toggle) toggle.classList.toggle('acsw-toggle--active', on);
      }
    });
  }

  function openPanel() {
    const panel = document.getElementById('acsw-panel');
    const overlay = document.getElementById('acsw-overlay');
    if (!panel || !overlay) return;
    panel.classList.add('is-open');
    overlay.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('acsw-panel-open');
    document.getElementById('acsw-search')?.focus();
  }

  function closePanel() {
    const panel = document.getElementById('acsw-panel');
    const overlay = document.getElementById('acsw-overlay');
    if (!panel || !overlay) return;
    panel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('acsw-panel-open');
  }

  function hideInterface() {
    localStorage.setItem(HIDDEN_KEY, '1');
    const trigger = document.getElementById('acsw-trigger');
    if (trigger) trigger.classList.add('is-hidden');
    closePanel();
  }

  function showInterface() {
    localStorage.removeItem(HIDDEN_KEY);
    const trigger = document.getElementById('acsw-trigger');
    if (trigger) trigger.classList.remove('is-hidden');
  }

  function resetSettings() {
    const empty = {};
    saveSettings(empty);
    applySettings(empty);
    const search = document.getElementById('acsw-search');
    if (search) search.value = '';
    filterProfiles('');
  }

  function setProfile(id, on) {
    const settings = getSettings();
    if (on) settings[id] = true;
    else delete settings[id];
    saveSettings(settings);
    applySettings(settings);
  }

  function filterProfiles(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('.acsw-profile').forEach(function (row) {
      const text = row.textContent.toLowerCase();
      row.classList.toggle('is-filtered-out', q.length > 0 && !text.includes(q));
    });
  }

  function bindProfile(btn) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      const on = !btn.classList.contains('is-active');
      setProfile(btn.dataset.profile, on);
    });
  }

  function initAccessibilityWidget() {
    const root = document.getElementById('acsw-root');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';

    if (localStorage.getItem(HIDDEN_KEY)) {
      document.getElementById('acsw-trigger')?.classList.add('is-hidden');
    }

    applySettings(getSettings());

    document.getElementById('acsw-trigger')?.addEventListener('click', openPanel);
    document.getElementById('acsw-overlay')?.addEventListener('click', closePanel);
    document.getElementById('acsw-btn-close')?.addEventListener('click', closePanel);
    document.getElementById('acsw-btn-reset')?.addEventListener('click', resetSettings);
    document.getElementById('acsw-btn-hide')?.addEventListener('click', hideInterface);

    const decl = document.getElementById('acsw-btn-declaration');
    if (decl) {
      decl.addEventListener('click', function () {
        window.location.href = getBase() + 'accessibilita.html';
      });
    }

    document.getElementById('acsw-search')?.addEventListener('input', function (e) {
      filterProfiles(e.target.value);
    });

    document.querySelectorAll('.acsw-profile').forEach(bindProfile);

    document.querySelectorAll('[data-acsw-open]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showInterface();
        openPanel();
      });
    });
  }

  window.BK_openAccessibilityPanel = function () {
    showInterface();
    openPanel();
  };

  window.BK_resetAccessibility = resetSettings;

  function boot() {
    initAccessibilityWidget();
  }

  window.BK_initAccessibilityWidget = initAccessibilityWidget;
  document.addEventListener('bk-layout-ready', boot);
  if (document.readyState !== 'loading') boot();
})();