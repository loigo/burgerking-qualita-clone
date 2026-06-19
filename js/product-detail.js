/**
 * Pagina dettaglio prodotto /prodotti/dettaglio/slug o /prodotti/cat/slug
 */
(function () {
  'use strict';

  const catalog = window.BK_PRODOTTI_CATALOG;
  if (!catalog) return;

  function getSlugFromPath() {
    const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    const prodIdx = parts.indexOf('prodotti');
    if (prodIdx < 0) return null;
    const after = parts.slice(prodIdx + 1).map(function (p) { return p.replace(/\.html$/, ''); });
    if (!after.length) return null;
    if (after[0] === 'dettaglio' && after[1]) return after[1];
    if (after.length >= 2) return after[after.length - 1];
    return null;
  }

  function ingredientIcon(name) {
    return catalog.ingredientIcons?.[name] || null;
  }

  function render(product) {
    document.title = 'Prodotti Burger King: Hamburger e Snack | Burger King Italia - ' + product.title;
    const titleEl = document.getElementById('product-title');
    const imgEl = document.getElementById('product-hero-img');
    const descEl = document.getElementById('product-description');
    const track = document.getElementById('ingredienti-track');

    if (titleEl) titleEl.textContent = product.title;
    if (imgEl) {
      imgEl.src = product.main || product.thumb;
      imgEl.alt = product.title;
    }
    if (descEl) {
      descEl.innerHTML = product.description || '';
    }

    if (track) {
      track.innerHTML = (product.ingredienti || []).map(function (name) {
        const icon = ingredientIcon(name);
        const iconHtml = icon
          ? '<img src="' + icon + '" class="img-carousel-ingredienti svg-brown" alt="">'
          : '<span class="ingrediente-placeholder"></span>';
        return (
          '<div class="ingrediente-item flex-shrink-0 text-center w-[120px]">' +
            iconHtml +
            '<div class="ingrediente-title">' + name + '</div>' +
          '</div>'
        );
      }).join('');
    }

    const allergeniSection = document.getElementById('allergeni-section');
    const allergeniGrid = document.getElementById('allergeni-grid');
    if (product.allergeni && product.allergeni.length && allergeniGrid) {
      allergeniSection?.classList.remove('hidden');
      allergeniGrid.innerHTML = product.allergeni.map(function (a) {
        return (
          '<div class="allergene-item text-center">' +
            '<img src="' + a.image + '" alt="' + a.label + '" class="allergene-img">' +
            '<div class="allergene-label">' + a.label + '</div>' +
          '</div>'
        );
      }).join('');
    }
  }

  function init() {
    const page = document.getElementById('product-detail-page');
    if (!page || page.dataset.bound) return;
    page.dataset.bound = '1';

    const slug = getSlugFromPath() || new URLSearchParams(window.location.search).get('slug');
    const product = slug ? catalog.productsBySlug[slug] : null;

    if (!product) {
      if (page.querySelector('main')) {
        document.getElementById('product-title').textContent = 'Prodotto non trovato';
      }
      return;
    }

    render(product);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('bk-layout-ready', init);
})();