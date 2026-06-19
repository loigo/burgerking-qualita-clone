/**
 * Otimização global de imagens — preconnect, lazy load, backgrounds diferidos
 */
(function () {
  'use strict';

  var LAZY_BG = 'bk-lazy-bg';
  var bgObserver = null;

  function isAboveFold(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.85;
  }

  function extractBgUrl(style) {
    if (!style) return null;
    var m = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    return m ? m[1] : null;
  }

  function shouldKeepBgNow(el) {
    if (el.closest('.testata-bg') && isAboveFold(el)) return true;
    if (el.closest('#hero-slider .hero-slide.active')) return true;
    if (el.closest('.prodotti-hero-slide.active')) return true;
    return false;
  }

  function loadBg(el) {
    var url = el.dataset.bgSrc;
    if (!url) return;
    el.style.backgroundImage = "url('" + url + "')";
    el.classList.remove(LAZY_BG);
    delete el.dataset.bgSrc;
  }

  function ensureBgObserver() {
    if (bgObserver || !('IntersectionObserver' in window)) return;
    bgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadBg(entry.target);
          bgObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '250px 0px', threshold: 0.01 });
  }

  function queueLazyBg(el) {
    if (el.dataset.bgOptimized) return;
    var url = extractBgUrl(el.getAttribute('style') || '');
    if (!url) return;
    el.dataset.bgOptimized = '1';
    el.dataset.bgSrc = url;
    el.style.backgroundImage = 'none';
    el.classList.add(LAZY_BG);
    ensureBgObserver();
    if (bgObserver) bgObserver.observe(el);
    else loadBg(el);
  }

  function optimizeImg(img) {
    if (img.dataset.bkOptimized) return;
    img.dataset.bkOptimized = '1';

    if (img.dataset.src && !img.getAttribute('src')) {
      return;
    }

    var isLcp = img.classList.contains('bk-lcp')
      || img.closest('#hero-slider .hero-slide.active .slider-image') === img
      || img.closest('.prodotti-hero-slide.active img') === img;

    if (isLcp) {
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('loading', 'eager');
    } else if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }

    if (!img.getAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  }

  function deferInactiveHeroImages() {
    document.querySelectorAll('#hero-slider .hero-slide:not(.active) .slider-image').forEach(function (img) {
      if (!img.getAttribute('src') || img.dataset.src) return;
      img.dataset.src = img.getAttribute('src');
      img.removeAttribute('src');
    });
  }

  function lazyInlineBackgrounds() {
    document.querySelectorAll('[style*="background-image"]').forEach(function (el) {
      if (shouldKeepBgNow(el)) return;
      queueLazyBg(el);
    });
  }

  function run() {
    document.querySelectorAll('img').forEach(optimizeImg);
    deferInactiveHeroImages();
    lazyInlineBackgrounds();
  }

  window.BK_loadSlideImage = function (slide) {
    if (!slide) return;
    slide.querySelectorAll('img[data-src]').forEach(function (img) {
      if (!img.getAttribute('src')) {
        img.setAttribute('src', img.dataset.src);
        optimizeImg(img);
      }
    });
  };

  window.BK_optimizeImages = run;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  document.addEventListener('bk-layout-ready', run);
})();