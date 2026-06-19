const BK = 'https://www.burgerking.it';

export type HomeProduct = { title: string; slug: string; img: string };

export const HOME_CATEGORIES = [
  { key: 'best_seller', label: 'Best Seller' },
  { key: 'italian_kings', label: 'Italian Kings' },
  { key: 'manzo', label: 'Manzo' },
  { key: 'pollo', label: 'Pollo' },
  { key: 'insalate_&_wrap', label: 'Insalate & Wrap' },
  { key: 'king_junior_meal', label: 'King Junior Meal' },
] as const;

export const HOME_PRODUCTS: Record<string, HomeProduct[]> = {
  best_seller: [
    { title: 'Italian Summer King', slug: 'italian_summer_king', img: `${BK}/assets/img/console/mo/products/18743_image_it.png?v=1781182017` },
    { title: 'The Parmigiano Reggiano Burger', slug: 'the_parmigiano_reggiano_burger_', img: `${BK}/assets/img/console/mo/products/18745_image_it.png?v=1781259296` },
    { title: 'Bacon King Compact', slug: 'bacon_king_compact', img: `${BK}/assets/img/console/mo/products/18059_image_it.png?v=1779718606` },
    { title: 'Baby Burgers', slug: 'baby_burgers', img: `${BK}/assets/img/console/mo/products/17949_image_it.png?v=1776873597` },
    { title: 'Chicken Krispper', slug: 'chicken_krispper', img: `${BK}/assets/img/console/mo/products/16695_image_it.png?v=1762179321` },
    { title: 'Crazy Cheese Chicken BBQ', slug: 'crazy_cheese_chicken_bbq', img: `${BK}/assets/img/console/mo/products/1322_image_it.png?v=1718696537` },
    { title: 'Crazy Cheese BBQ', slug: 'crazy_cheese_bbq', img: `${BK}/assets/img/console/mo/products/1321_image_it.png?v=1718696695` },
    { title: 'Bacon King 3.0', slug: 'bacon_king_3_0', img: `${BK}/assets/img/console/mo/products/580_image_it.png?v=1709568750` },
    { title: 'Bacon King', slug: 'bacon_king', img: `${BK}/assets/img/console/mo/products/581_image_it.png?v=1709568751` },
    { title: 'Chicken Bacon King', slug: 'chicken_bacon_king', img: `${BK}/assets/img/console/mo/products/596_image_it.png?v=1709568756` },
    { title: 'Whopper - Gustalo Plant Based', slug: 'whopper_-_gustalo_plant_based', img: `${BK}/assets/img/console/mo/products/573_image_it.png?v=1719216134` },
    { title: 'Bronx Steakhouse - Gustalo Plant Based', slug: 'bronx_steakhouse_-_gustalo_plant_based', img: `${BK}/assets/img/console/mo/products/1315_image_it.png?v=1719216861` },
  ],
  italian_kings: [
    { title: 'The Parmigiano Reggiano Burger', slug: 'the_parmigiano_reggiano_burger_', img: `${BK}/assets/img/console/mo/products/18745_image_it.png` },
    { title: 'Italian Summer King', slug: 'italian_summer_king', img: `${BK}/assets/img/console/mo/products/18743_image_it.png` },
  ],
  manzo: [
    { title: 'Italian Summer King', slug: 'italian_summer_king', img: `${BK}/assets/img/console/mo/products/18743_image_it.png` },
    { title: 'Bacon King Compact', slug: 'bacon_king_compact', img: `${BK}/assets/img/console/mo/products/18059_image_it.png` },
    { title: 'Crazy Cheese BBQ', slug: 'crazy_cheese_bbq', img: `${BK}/assets/img/console/mo/products/1321_image_it.png` },
    { title: 'Bacon King', slug: 'bacon_king', img: `${BK}/assets/img/console/mo/products/581_image_it.png` },
    { title: 'Bacon King 3.0', slug: 'bacon_king_3_0', img: `${BK}/assets/img/console/mo/products/580_image_it.png` },
    { title: 'Bronx Steakhouse', slug: 'bronx_steakhouse', img: `${BK}/assets/img/console/mo/products/579_image_it.png` },
    { title: 'Whopper', slug: 'whopper', img: `${BK}/assets/img/console/mo/products/582_image_it.png` },
    { title: 'Double Whopper', slug: 'double_whopper', img: `${BK}/assets/img/console/mo/products/584_image_it.png` },
    { title: 'Triple Whopper', slug: 'triple_whopper', img: `${BK}/assets/img/console/mo/products/585_image_it.png` },
    { title: 'Big King', slug: 'big_king', img: `${BK}/assets/img/console/mo/products/1635_image_it.png` },
    { title: 'Big King ® XXL', slug: 'big_king__xxl', img: `${BK}/assets/img/console/mo/products/588_image_it.png` },
    { title: 'Double Cheese Bacon', slug: 'double_cheese_bacon', img: `${BK}/assets/img/console/mo/products/587_image_it.png` },
    { title: 'Double Cheeseburger', slug: 'double_cheeseburger', img: `${BK}/assets/img/console/mo/products/586_image_it.png` },
    { title: 'Hamburger', slug: 'hamburger', img: `${BK}/assets/img/console/mo/products/631_image_it.png` },
    { title: 'Cheeseburger', slug: 'cheeseburger', img: `${BK}/assets/img/console/mo/products/566_image_it.png` },
    { title: 'Bacon King Toast', slug: 'bacon_king_toast', img: `${BK}/assets/img/console/mo/products/567_image_it.png` },
    { title: 'King Toast', slug: 'king_toast', img: `${BK}/assets/img/console/mo/products/881_image_it.png` },
  ],
  pollo: [
    { title: 'Krispper Box', slug: 'krispper_box', img: `${BK}/assets/img/console/mo/products/17289_image_it.png` },
    { title: 'Double Chicken Crazy Cheese BBQ', slug: 'double_chicken_crazy_cheese_bbq', img: `${BK}/assets/img/console/mo/products/16938_image_it.png` },
    { title: 'Double Chicken Royale Bacon Cheese', slug: 'double_chicken_royale_bacon_cheese', img: `${BK}/assets/img/console/mo/products/16937_image_it.png` },
    { title: 'DOUBLE chicken KRISPPER', slug: 'double_chicken_krispper_', img: `${BK}/assets/img/console/mo/products/16933_image_it.png` },
    { title: 'Chicken Krispper', slug: 'chicken_krispper', img: `${BK}/assets/img/console/mo/products/16695_image_it.png` },
    { title: 'Crazy Cheese Chicken BBQ', slug: 'crazy_cheese_chicken_bbq', img: `${BK}/assets/img/console/mo/products/1322_image_it.png` },
    { title: 'Chicken Bacon King', slug: 'chicken_bacon_king', img: `${BK}/assets/img/console/mo/products/596_image_it.png` },
    { title: 'Chicken Royale Bacon Cheese', slug: 'chicken_royale_bacon_cheese', img: `${BK}/assets/img/console/mo/products/597_image_it.png` },
    { title: 'Chicken Royale', slug: 'chicken_royale', img: `${BK}/assets/img/console/mo/products/598_image_it.png` },
    { title: 'Crispy Chicken', slug: 'crispy_chicken', img: `${BK}/assets/img/console/mo/products/600_image_it.png` },
    { title: 'Chicken Burger', slug: 'chicken_burger', img: `${BK}/assets/img/console/mo/products/800_image_it.png` },
  ],
  'insalate_&_wrap': [
    { title: 'Insalata Mista', slug: 'insalata_mista', img: `${BK}/assets/img/console/mo/products/603_image_it.png` },
    { title: 'Insalata di Pollo Croccante', slug: 'insalata_di_pollo_croccante', img: `${BK}/assets/img/console/mo/products/604_image_it.png` },
    { title: 'Insalata Piccola', slug: 'insalata_piccola', img: `${BK}/assets/img/console/mo/products/568_image_it.png` },
    { title: 'Wrap di Pollo Croccante', slug: 'wrap_di_pollo_croccante', img: `${BK}/assets/img/console/mo/products/606_image_it.png` },
  ],
  king_junior_meal: [
    { title: 'Chicken Burger', slug: 'chicken_burger', img: `${BK}/assets/img/console/mo/products/608_image_it.png` },
    { title: 'BK Toast al Prosciutto Cotto', slug: 'bk_toast_al_prosciutto_cotto', img: `${BK}/assets/img/console/mo/products/592_image_it.png` },
    { title: 'Bacon King Toast', slug: 'bacon_king_toast', img: `${BK}/assets/img/console/mo/products/5406_image_it.png` },
    { title: 'King Nuggets Plant Based', slug: 'king_nuggets_plant_based', img: `${BK}/assets/img/console/mo/products/14765_image_it.png` },
    { title: 'Cheeseburger', slug: 'cheeseburger', img: `${BK}/assets/img/console/mo/products/591_image_it.png` },
    { title: 'Hamburger', slug: 'hamburger', img: `${BK}/assets/img/console/mo/products/747_image_it.png` },
    { title: 'King Nuggets X4', slug: 'king_nuggets_x4', img: `${BK}/assets/img/console/mo/products/609_image_it.png` },
  ],
};

/** Ordem e conteúdo idênticos ao index.html estático */
export const HOME_PROMOS = [
  {
    title: 'Big King + Bibita Small + Snack Small',
    thumb: `${BK}/assets/img/console/appUser/news/1633_thumb_it.png?v=1772624957`,
    href: '/promo/big_king__bibita_small__snack_small',
  },
  {
    title: 'Crispy Chicken Wrap + Bibita Small + Snack Small',
    thumb: `${BK}/assets/img/console/appUser/news/1702_thumb_it.png?v=1772624482`,
    href: '/promo',
  },
  {
    title: '3 menu medi a scelta tra 6',
    thumb: `${BK}/assets/img/console/appUser/news/1683_thumb_it.jpg?v=1769677701`,
    href: '/promo',
  },
  {
    title: '4 menu medi a scelta tra 6',
    thumb: `${BK}/assets/img/console/appUser/news/1682_thumb_it.jpg?v=1769677494`,
    href: '/promo',
  },
  {
    title: '2 menu medi a scelta tra 6',
    thumb: `${BK}/assets/img/console/appUser/news/1681_thumb_it.jpg?v=1769677033`,
    href: '/promo',
  },
  {
    title: 'Chicken Stripes Menu Medio',
    thumb: `${BK}/assets/img/console/appUser/news/1676_thumb_it.png?v=1769612219`,
    href: '/promo',
  },
];

export const HOME_NOVITA = [
  {
    title: "Il sapore dell'estate in un burger!",
    preview:
      "Arriva a menù il panino che racchiude tutto il gusto dell'estate in un morso: il nuovo Italian Summer King. Vieni a provarlo, solo da Burger King.",
    thumb: `${BK}/assets/img/console/appUser/news/1770_thumb_it.jpg?v=1781175501`,
  },
  {
    title: 'PROMOssi a pieni voti.',
    preview:
      'DA OGGI SI STUDIA IL RELAX. Nuovo programma didattico: amici, sole e cose buone. A partire da una promo squisita: un Bacon King Compact Menu Medio e un Sundae Pistacchio a soli €9,40.',
    thumb: `${BK}/assets/img/console/appUser/news/1769_thumb_it.png?v=1781190756`,
  },
  {
    title: 'Catch the Baby Burgers',
    preview: 'Un nuovo gioco dedicato ai nostri amati Baby Burgers ti aspetta in APP!',
    thumb: `${BK}/assets/img/console/appUser/news/1766_thumb_it.jpg?v=1781260146`,
  },
  {
    title: 'Mi è semblato di vedele una solplesa!',
    preview:
      'Da Burger King sono arrivate le nuove sorprese Looney Tunes, una in ogni KJM. Vieni a scoprirle tutte.',
    thumb: `${BK}/assets/img/console/appUser/news/1762_thumb_it.png?v=1780491591`,
  },
  {
    title: 'KING OF THE NIGHT',
    preview: 'La fame viene di notte...',
    thumb: `${BK}/assets/img/console/appUser/news/1761_thumb_it.png?v=1780048066`,
  },
];