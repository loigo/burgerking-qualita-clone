/**
 * Pagina /prodotti — griglia, categorie, filtri ingredienti, load more
 */
(function () {
  'use strict';

  const catalog = window.BK_PRODOTTI_CATALOG;
  if (!catalog) return;

  const PAGE_SIZE = 18;
  let selectedCategory = '';
  let activeFilters = [];
  let currentPage = 1;
  let filteredProducts = [];

  function getInitialCategory() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cat')) return params.get('cat');
    const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    const idx = parts.indexOf('prodotti');
    if (idx >= 0 && parts[idx + 1]) {
      const cat = decodeURIComponent(parts[idx + 1].replace(/\.html$/, ''));
      if (cat !== 'dettaglio' && !parts[idx + 2]) return cat;
    }
    return '';
  }

  function productHref(slug) {
    const cat = selectedCategory || 'dettaglio';
    return '/prodotti/' + cat + '/' + slug + '.html';
  }

  function collectProducts() {
    const seen = new Set();
    const list = [];
    catalog.categories.forEach(function (cat) {
      if (selectedCategory && cat.key !== selectedCategory) return;
      cat.products.forEach(function (p) {
        if (seen.has(p.slug)) return;
        seen.add(p.slug);
        list.push({ ...p, category: cat.key });
      });
    });
    return list;
  }

  function matchesFilters(product) {
    if (!activeFilters.length) return true;
    const ings = product.ingredienti || [];
    return activeFilters.every(function (f) { return ings.includes(f); });
  }

  function applyFilters() {
    filteredProducts = collectProducts().filter(matchesFilters);
    currentPage = 1;
    renderGrid(false);
    updateCounts();
    updateLoadMore();
    updateCategoryDescription();
    if (typeof window.BK_optimizeImages === 'function') window.BK_optimizeImages();
  }

  function cardHtml(product) {
    return (
      '<div class="col-prodotto" id="prodotto-' + product.slug + '">' +
        '<a href="' + productHref(product.slug) + '" class="no-decoration">' +
          '<div class="card-prod text-center" data-prod="' + product.slug + '">' +
            '<div class="div-img-card-prod aspect-square">' +
              '<img src="' + product.thumb + '" alt="' + product.title + '" class="img-card-prod" loading="lazy" decoding="async">' +
            '</div>' +
            '<div class="card-prod-title">' + product.title + '</div>' +
          '</div>' +
        '</a>' +
      '</div>'
    );
  }

  function renderGrid(append) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const end = currentPage * PAGE_SIZE;
    const chunk = filteredProducts.slice(append ? (currentPage - 1) * PAGE_SIZE : 0, end);
    const html = chunk.map(cardHtml).join('');
    if (append) grid.insertAdjacentHTML('beforeend', html);
    else grid.innerHTML = html;
  }

  function updateCounts() {
    const total = document.getElementById('card-total');
    const count = document.getElementById('card-count');
    const shown = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);
    if (total) total.textContent = filteredProducts.length;
    if (count) count.textContent = shown;
  }

  function updateLoadMore() {
    const btn = document.getElementById('load-more');
    if (!btn) return;
    btn.style.display = currentPage * PAGE_SIZE >= filteredProducts.length ? 'none' : '';
  }

  function updateCategoryDescription() {
    const row = document.getElementById('riga-desc-categoria');
    const col = document.getElementById('col-desc-categoria');
    if (!row || !col) return;
    if (!selectedCategory) {
      row.classList.add('hidden');
      return;
    }
    const cat = catalog.categories.find(function (c) { return c.key === selectedCategory; });
    if (cat && cat.description) {
      col.innerHTML = cat.description;
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  }

  function setActiveCategory(cat) {
    selectedCategory = cat;
    document.querySelectorAll('#carousel-categorie-prod .link-categoria-prod').forEach(function (link) {
      const item = link.querySelector('[data-cat]');
      link.classList.toggle('is-active', item && item.dataset.cat === cat);
    });
    if (cat) {
      const track = document.getElementById('carousel-categorie-prod');
      const active = document.querySelector('#carousel-categorie-prod [data-cat="' + cat + '"]');
      if (track && active) {
        const link = active.closest('.category-carousel-item');
        if (link) link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
    applyFilters();
  }

  function renderCategoryCarousel() {
    const track = document.getElementById('carousel-categorie-prod');
    if (!track) return;
    track.innerHTML = catalog.categories.map(function (cat, index) {
      const href = cat.key === 'bk_cafe' ? '/bk-cafe.html' : '/prodotti/' + cat.key + '.html';
      return (
        '<a href="' + href + '" class="category-carousel-item link-categoria-prod flex-shrink-0 text-center no-underline' + (selectedCategory === cat.key ? ' is-active' : '') + '">' +
          '<div data-cat="' + cat.key + '" data-index="' + index + '">' +
            '<img src="' + cat.image + '" class="img-carousel-prod" alt="">' +
            '<div class="title">' + cat.title + '</div>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  function renderIngredientFilters() {
    const sidebar = document.getElementById('sidebar-filtri-prod');
    const modal = document.getElementById('modal-filtri-body');
    if (!catalog.ingredientFilters.length) return;

    const btnHtml = catalog.ingredientFilters.map(function (ing) {
      const icon = ing.image ? '<img src="' + ing.image + '" class="svg-brown filter-ing-icon" alt="">' : '';
      return '<button type="button" class="btn-tag-outline btn-filtro-prod" data-value="' + ing.value + '">' + icon + ing.label + '</button>';
    }).join('<br>');

    if (sidebar) {
      sidebar.querySelector('.sidebar-filtri-buttons').innerHTML = btnHtml;
    }
    if (modal) modal.innerHTML = btnHtml;
  }

  function bindFilters() {
    function toggle(btn) {
      btn.classList.toggle('active');
      activeFilters = [...document.querySelectorAll('.btn-filtro-prod.active')].map(function (b) { return b.dataset.value; });
      const badge = document.querySelector('.filter-badge-count');
      if (badge) {
        badge.textContent = activeFilters.length;
        badge.classList.toggle('hidden', activeFilters.length === 0);
      }
      applyFilters();
    }

    document.querySelectorAll('.btn-filtro-prod').forEach(function (btn) {
      btn.addEventListener('click', function () { toggle(btn); });
    });
  }

  function initHeroSlider() {
    const slider = document.getElementById('prodotti-hero-slider');
    if (!slider || !catalog.slider.length) return;

    const slides = catalog.slider;
    slider.innerHTML = slides.map(function (slide, i) {
      var active = i === 0;
      var desktop = slide.desktop;
      var mobile = slide.mobile || slide.desktop;
      var desktopAttr = active ? ' src="' + desktop + '" fetchpriority="high" loading="eager"' : ' data-src="' + desktop + '"';
      var mobileAttr = active ? ' src="' + mobile + '" fetchpriority="high" loading="eager"' : ' data-src="' + mobile + '"';
      return (
        '<div class="prodotti-hero-slide' + (active ? ' active' : '') + '">' +
          '<img' + desktopAttr + ' alt="' + (slide.title || '') + '" class="hidden md:block w-full rounded-[25px]" decoding="async">' +
          '<img' + mobileAttr + ' alt="' + (slide.title || '') + '" class="md:hidden w-full rounded-[25px]" decoding="async">' +
        '</div>'
      );
    }).join('');

    if (slides.length < 2) return;
    let idx = 0;
    setInterval(function () {
      idx = (idx + 1) % slides.length;
      slider.querySelectorAll('.prodotti-hero-slide').forEach(function (el, i) {
        el.classList.toggle('active', i === idx);
        if (i === idx && typeof window.BK_loadSlideImage === 'function') {
          window.BK_loadSlideImage(el);
        }
      });
    }, 8000);
  }

  function init() {
    const page = document.getElementById('prodotti-page');
    if (!page || page.dataset.bound) return;
    page.dataset.bound = '1';

    selectedCategory = getInitialCategory();
    renderCategoryCarousel();
    renderIngredientFilters();
    bindFilters();
    initHeroSlider();
    setActiveCategory(selectedCategory);
    if (typeof window.BK_optimizeImages === 'function') window.BK_optimizeImages();

    document.getElementById('load-more')?.addEventListener('click', function () {
      currentPage += 1;
      renderGrid(true);
      updateCounts();
      updateLoadMore();
      if (typeof window.BK_optimizeImages === 'function') window.BK_optimizeImages();
    });

    document.getElementById('btn-open-filtri-mobile')?.addEventListener('click', function () {
      document.getElementById('modal-filtri')?.classList.remove('hidden');
    });
    document.getElementById('btn-close-filtri-mobile')?.addEventListener('click', function () {
      document.getElementById('modal-filtri')?.classList.add('hidden');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('bk-layout-ready', init);
})();