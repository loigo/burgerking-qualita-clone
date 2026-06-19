/**
 * Burger King Italia Clone — Interações globais
 * Menu mobile, dropdown, carousels horizontais e hero slider
 */
(function () {
  'use strict';

  /* --- Menu mobile --- */
  function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenBtn = document.getElementById('menu-open');
    const menuCloseBtn = document.getElementById('menu-close');
    const menuOverlay = document.getElementById('menu-overlay');
    if (!mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add('open');
      menuOverlay?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuOverlay?.classList.add('hidden');
      document.body.style.overflow = '';
    }

    menuOpenBtn?.addEventListener('click', openMenu);
    menuCloseBtn?.addEventListener('click', closeMenu);
    menuOverlay?.addEventListener('click', closeMenu);

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1280) closeMenu();
    });
  }

  /* --- Dropdown desktop + mobile --- */
  function initDropdown() {
    const toggle = document.getElementById('dropdown-toggle');
    const menu = document.getElementById('dropdown-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const hidden = menu.classList.toggle('hidden');
        toggle.classList.toggle('show', !hidden);
      });

      document.addEventListener('click', function (e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.add('hidden');
          toggle.classList.remove('show');
        }
      });
    }

    const mobileToggle = document.getElementById('mobile-dropdown-toggle');
    const mobileMenu = document.getElementById('mobile-dropdown-menu');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  /* --- Carousel horizontal genérico --- */
  function initHorizontalCarousel(trackId, prevId, nextId) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const prevBtn = prevId ? document.getElementById(prevId) : null;
    const nextBtn = nextId ? document.getElementById(nextId) : null;
    const indicators = track.closest('[data-carousel]')?.querySelectorAll('.slider-indicator') || [];

    function getScrollAmount() {
      const slide = track.querySelector(':scope > *');
      if (!slide) return 300;
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      return slide.offsetWidth + gap;
    }

    function updateState() {
      const max = track.scrollWidth - track.clientWidth;
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 1;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 1;

      const amount = getScrollAmount();
      const idx = amount > 0 ? Math.round(track.scrollLeft / amount) : 0;
      indicators.forEach(function (dot, i) {
        dot.classList.toggle('active', i === idx);
      });
    }

    prevBtn?.addEventListener('click', function () {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', function () {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateState, { passive: true });
    indicators.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        track.scrollTo({ left: getScrollAmount() * i, behavior: 'smooth' });
      });
    });

    window.addEventListener('resize', updateState);
    updateState();
  }

  /* --- Hero slider (home) --- */
  function initHeroSlider() {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let current = 0;
    let timer;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === current);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      timer = setInterval(next, 10000);
    }

    function resetAutoplay() {
      clearInterval(timer);
      startAutoplay();
    }

    prevBtn?.addEventListener('click', function () { prev(); resetAutoplay(); });
    nextBtn?.addEventListener('click', function () { next(); resetAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
    });

    goTo(0);
    startAutoplay();
  }

  /* --- Filtro de categorias (prodotti) --- */
  function initCategoryFilter() {
    const buttons = document.querySelectorAll('.btn-filtro-categoria:not(#products-home-section .btn-filtro-categoria)');
    const cards = document.querySelectorAll('.product-card:not(.home-product-card)');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      if (btn.dataset.boundFilter) return;
      btn.dataset.boundFilter = '1';
      btn.addEventListener('click', function () {
        const cat = btn.dataset.cat;
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        cards.forEach(function (card) {
          const cats = (card.dataset.cat || '').split(/\s+/);
          const show = !cat || cat === 'all' || cats.includes(cat);
          card.classList.toggle('hidden', !show);
          if (show) card.classList.remove('hidden-load');
        });
      });
    });
  }

  /* --- Load more (promo, novità, prodotti BK Café) --- */
  function initLoadMore() {
    const btn = document.getElementById('load-more');
    if (!btn || btn.dataset.bound) return;

    const hidden = document.querySelectorAll('.hidden-load');
    if (!hidden.length) {
      btn.style.display = 'none';
      return;
    }

    btn.dataset.bound = '1';
    let shown = 0;
    const batch = btn.closest('.main-prodotti') ? 18 : 6;

    btn.addEventListener('click', function () {
      const items = document.querySelectorAll('.hidden-load');
      for (let i = 0; i < batch && i < items.length; i++) {
        items[i].classList.remove('hidden-load');
      }
      shown += batch;
      if (!document.querySelectorAll('.hidden-load').length) btn.style.display = 'none';
    });
  }

  /* --- Formulário contatti (burgerking.it/contatti) --- */
  function initContactForm() {
    const option = document.getElementById('option');
    const form = document.getElementById('contact-form');
    if (!option || !form || form.dataset.bound) return;
    form.dataset.bound = '1';

    const storeDiv = document.querySelector('.store-div');
    const candidatura = document.querySelector('.div-candidatura');
    const contact = document.querySelector('.div-contact');
    const apribk = document.querySelector('.div-apribk');
    const location = document.querySelector('.div-location');
    const showStore = ['5', '6', '10'];

    function toggle(el, show) {
      if (!el) return;
      el.classList.toggle('hidden', !show);
    }

    function setSectionFields(section, enabled) {
      if (!section) return;
      section.querySelectorAll('input, select, textarea').forEach(function (field) {
        if (enabled) {
          field.removeAttribute('disabled');
          if (field.classList.contains('required')) field.setAttribute('required', 'required');
        } else {
          if (field.hasAttribute('required')) field.removeAttribute('required');
          field.setAttribute('disabled', 'disabled');
        }
      });
    }

    function manageDivShow(val) {
      toggle(storeDiv, showStore.includes(val));
      if (val === '9') {
        toggle(candidatura, true);
        toggle(contact, false);
      } else {
        toggle(candidatura, false);
        toggle(contact, true);
      }
      toggle(apribk, val === '7');
      toggle(location, val === '11');
      setSectionFields(apribk, val === '7');
      setSectionFields(location, val === '11');
    }

    const label = document.getElementById('option_label');
    option.addEventListener('change', function () {
      if (label) label.value = option.options[option.selectedIndex].text;
      manageDivShow(option.value);
    });

    form.querySelectorAll('.fileupload').forEach(function (input) {
      input.addEventListener('change', function () {
        if (input.files[0] && input.files[0].size > 5200000) {
          alert('Il file è troppo grande. Dimensione massima: 5MB.');
          input.value = '';
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Grazie! Il tuo messaggio è stato registrato (demo clone front-end).');
    });

    manageDivShow(option.value);
  }

  /* --- Ricerca press room --- */
  function initPressSearch() {
    const input = document.getElementById('input-search');
    const cards = document.querySelectorAll('.press-card');
    if (!input || !cards.length) return;

    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = (card.dataset.search || card.textContent || '').toLowerCase();
        card.classList.toggle('hidden', q.length > 0 && !text.includes(q));
      });
    });
  }

  /* --- Inicialização --- */
  function init() {
    initMobileMenu();
    initDropdown();
    initHeroSlider();
    initCategoryFilter();
    initLoadMore();
    initContactForm();
    initPressSearch();

    initHorizontalCarousel('ingredients-track', 'slider-prev', 'slider-next');
    initHorizontalCarousel('about-track', 'about-prev', 'about-next');
    initHorizontalCarousel('promo-track', 'promo-prev', 'promo-next');
    initHorizontalCarousel('products-home-track', 'prod-home-prev', 'prod-home-next');
    initHorizontalCarousel('novita-track', 'novita-prev', 'novita-next');
    initHorizontalCarousel('carousel-categorie-prod', 'cat-prev', 'cat-next');
    initHorizontalCarousel('ingredienti-track', 'ing-prev', 'ing-next');
  }

  /* Aguarda componentes injetados */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-init após layout injetado */
  document.addEventListener('bk-layout-ready', init);
})();