/**
 * Carousel "I nostri prodotti" — home (dati do burgerking.it)
 */
(function () {
  'use strict';

  const BK_IMG = 'https://www.burgerking.it';

  const HOME_PRODUCTS = {
    best_seller: [
      { title: 'Italian Summer King', slug: 'italian_summer_king', img: '/assets/img/console/mo/products/18743_image_it.png?v=1781182017' },
      { title: 'The Parmigiano Reggiano Burger', slug: 'the_parmigiano_reggiano_burger_', img: '/assets/img/console/mo/products/18745_image_it.png?v=1781259296' },
      { title: 'Bacon King Compact', slug: 'bacon_king_compact', img: '/assets/img/console/mo/products/18059_image_it.png?v=1779718606' },
      { title: 'Baby Burgers', slug: 'baby_burgers', img: '/assets/img/console/mo/products/17949_image_it.png?v=1776873597' },
      { title: 'Chicken Krispper', slug: 'chicken_krispper', img: '/assets/img/console/mo/products/16695_image_it.png?v=1762179321' },
      { title: 'Crazy Cheese Chicken BBQ', slug: 'crazy_cheese_chicken_bbq', img: '/assets/img/console/mo/products/1322_image_it.png?v=1718696537' },
      { title: 'Crazy Cheese BBQ', slug: 'crazy_cheese_bbq', img: '/assets/img/console/mo/products/1321_image_it.png?v=1718696695' },
      { title: 'Bacon King 3.0', slug: 'bacon_king_3_0', img: '/assets/img/console/mo/products/580_image_it.png?v=1709568750' },
      { title: 'Bacon King', slug: 'bacon_king', img: '/assets/img/console/mo/products/581_image_it.png?v=1709568751' },
      { title: 'Chicken Bacon King', slug: 'chicken_bacon_king', img: '/assets/img/console/mo/products/596_image_it.png?v=1709568756' },
      { title: 'Whopper - Gustalo Plant Based', slug: 'whopper_-_gustalo_plant_based', img: '/assets/img/console/mo/products/573_image_it.png?v=1719216134' },
      { title: 'Bronx Steakhouse - Gustalo Plant Based', slug: 'bronx_steakhouse_-_gustalo_plant_based', img: '/assets/img/console/mo/products/1315_image_it.png?v=1719216861' },
    ],
    italian_kings: [
      { title: 'The Parmigiano Reggiano Burger', slug: 'the_parmigiano_reggiano_burger_', img: '/assets/img/console/mo/products/18745_image_it.png' },
      { title: 'Italian Summer King', slug: 'italian_summer_king', img: '/assets/img/console/mo/products/18743_image_it.png' },
    ],
    manzo: [
      { title: 'Italian Summer King', slug: 'italian_summer_king', img: '/assets/img/console/mo/products/18743_image_it.png' },
      { title: 'Bacon King Compact', slug: 'bacon_king_compact', img: '/assets/img/console/mo/products/18059_image_it.png' },
      { title: 'Crazy Cheese BBQ', slug: 'crazy_cheese_bbq', img: '/assets/img/console/mo/products/1321_image_it.png' },
      { title: 'Bacon King', slug: 'bacon_king', img: '/assets/img/console/mo/products/581_image_it.png' },
      { title: 'Bacon King 3.0', slug: 'bacon_king_3_0', img: '/assets/img/console/mo/products/580_image_it.png' },
      { title: 'Bronx Steakhouse', slug: 'bronx_steakhouse', img: '/assets/img/console/mo/products/579_image_it.png' },
      { title: 'Whopper', slug: 'whopper', img: '/assets/img/console/mo/products/582_image_it.png' },
      { title: 'Double Whopper', slug: 'double_whopper', img: '/assets/img/console/mo/products/584_image_it.png' },
      { title: 'Triple Whopper', slug: 'triple_whopper', img: '/assets/img/console/mo/products/585_image_it.png' },
      { title: 'Big King', slug: 'big_king', img: '/assets/img/console/mo/products/1635_image_it.png' },
      { title: 'Big King ® XXL', slug: 'big_king__xxl', img: '/assets/img/console/mo/products/588_image_it.png' },
      { title: 'Double Cheese Bacon', slug: 'double_cheese_bacon', img: '/assets/img/console/mo/products/587_image_it.png' },
      { title: 'Double Cheeseburger', slug: 'double_cheeseburger', img: '/assets/img/console/mo/products/586_image_it.png' },
      { title: 'Hamburger', slug: 'hamburger', img: '/assets/img/console/mo/products/631_image_it.png' },
      { title: 'Cheeseburger', slug: 'cheeseburger', img: '/assets/img/console/mo/products/566_image_it.png' },
      { title: 'Bacon King Toast', slug: 'bacon_king_toast', img: '/assets/img/console/mo/products/567_image_it.png' },
      { title: 'King Toast', slug: 'king_toast', img: '/assets/img/console/mo/products/881_image_it.png' },
    ],
    pollo: [
      { title: 'Krispper Box', slug: 'krispper_box', img: '/assets/img/console/mo/products/17289_image_it.png' },
      { title: 'Double Chicken Crazy Cheese BBQ', slug: 'double_chicken_crazy_cheese_bbq', img: '/assets/img/console/mo/products/16938_image_it.png' },
      { title: 'Double Chicken Royale Bacon Cheese', slug: 'double_chicken_royale_bacon_cheese', img: '/assets/img/console/mo/products/16937_image_it.png' },
      { title: 'DOUBLE chicken KRISPPER', slug: 'double_chicken_krispper_', img: '/assets/img/console/mo/products/16933_image_it.png' },
      { title: 'Chicken Krispper', slug: 'chicken_krispper', img: '/assets/img/console/mo/products/16695_image_it.png' },
      { title: 'Crazy Cheese Chicken BBQ', slug: 'crazy_cheese_chicken_bbq', img: '/assets/img/console/mo/products/1322_image_it.png' },
      { title: 'Chicken Bacon King', slug: 'chicken_bacon_king', img: '/assets/img/console/mo/products/596_image_it.png' },
      { title: 'Chicken Royale Bacon Cheese', slug: 'chicken_royale_bacon_cheese', img: '/assets/img/console/mo/products/597_image_it.png' },
      { title: 'Chicken Royale', slug: 'chicken_royale', img: '/assets/img/console/mo/products/598_image_it.png' },
      { title: 'Crispy Chicken', slug: 'crispy_chicken', img: '/assets/img/console/mo/products/600_image_it.png' },
      { title: 'Chicken Burger', slug: 'chicken_burger', img: '/assets/img/console/mo/products/800_image_it.png' },
    ],
    'insalate_&_wrap': [
      { title: 'Insalata Mista', slug: 'insalata_mista', img: '/assets/img/console/mo/products/603_image_it.png' },
      { title: 'Insalata di Pollo Croccante', slug: 'insalata_di_pollo_croccante', img: '/assets/img/console/mo/products/604_image_it.png' },
      { title: 'Insalata Piccola', slug: 'insalata_piccola', img: '/assets/img/console/mo/products/568_image_it.png' },
      { title: 'Wrap di Pollo Croccante', slug: 'wrap_di_pollo_croccante', img: '/assets/img/console/mo/products/606_image_it.png' },
    ],
    king_junior_meal: [
      { title: 'Chicken Burger', slug: 'chicken_burger', img: '/assets/img/console/mo/products/608_image_it.png' },
      { title: 'BK Toast al Prosciutto Cotto', slug: 'bk_toast_al_prosciutto_cotto', img: '/assets/img/console/mo/products/592_image_it.png' },
      { title: 'Bacon King Toast', slug: 'bacon_king_toast', img: '/assets/img/console/mo/products/5406_image_it.png' },
      { title: 'King Nuggets Plant Based', slug: 'king_nuggets_plant_based', img: '/assets/img/console/mo/products/14765_image_it.png' },
      { title: 'Cheeseburger', slug: 'cheeseburger', img: '/assets/img/console/mo/products/591_image_it.png' },
      { title: 'Hamburger', slug: 'hamburger', img: '/assets/img/console/mo/products/747_image_it.png' },
      { title: 'King Nuggets X4', slug: 'king_nuggets_x4', img: '/assets/img/console/mo/products/609_image_it.png' },
    ],
  };

  function productHref(cat, slug) {
    const pathCat = !cat || cat === 'best_seller' ? 'dettaglio' : cat;
    return '/prodotti/' + pathCat + '/' + slug + '.html';
  }

  function productCardHtml(cat, product) {
    const img = product.img.startsWith('http') ? product.img : BK_IMG + product.img;
    const href = productHref(cat, product.slug);
    return (
      '<a href="' + href + '" class="product-card home-product-card flex-shrink-0 w-[180px] no-underline">' +
        '<div class="news-card">' +
          '<div class="div-img-news aspect-square" style="background-image:url(\'' + img + '\')"></div>' +
          '<div class="div-content-news"><div class="news-title text-[1.5rem] text-center">' + product.title + '</div></div>' +
        '</div>' +
      '</a>'
    );
  }

  function renderHomeProducts(cat) {
    const track = document.getElementById('products-home-track');
    if (!track) return;
    const items = HOME_PRODUCTS[cat] || [];
    track.innerHTML = items.map(function (p) { return productCardHtml(cat, p); }).join('');
    track.scrollLeft = 0;
    track.dispatchEvent(new Event('scroll'));
  }

  function initHomeProducts() {
    const section = document.getElementById('products-home-section');
    if (!section || section.dataset.homeProductsBound) return;
    section.dataset.homeProductsBound = '1';

    const buttons = section.querySelectorAll('.btn-filtro-categoria');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('active')) return;
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderHomeProducts(btn.dataset.cat);
      });
    });

    const active = section.querySelector('.btn-filtro-categoria.active');
    renderHomeProducts(active?.dataset.cat || 'best_seller');
  }

  window.BK_initHomeProducts = initHomeProducts;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeProducts);
  } else {
    initHomeProducts();
  }
})();