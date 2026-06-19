import fs from 'fs';

const data = JSON.parse(fs.readFileSync('tools/prodotti-dati-pagina.json', 'utf8'));
const BK = 'https://www.burgerking.it';

const categories = Object.entries(data.main).map(([key, cat]) => ({
  key,
  title: cat.title,
  description: cat.description || '',
  image: cat.image ? BK + cat.image : null,
  products: Object.entries(cat.prodotti || {}).map(([slug, p]) => ({
    slug,
    title: p.title,
    thumb: p.img?.thumb ? BK + p.img.thumb : null,
    main: p.img?.main ? BK + p.img.main : (p.img?.thumb ? BK + p.img.thumb : null),
    hero: p.img?.hero ? BK + p.img.hero : null,
    description: p.description || '',
    ingredienti: p.ingredienti || [],
    allergeni: (p.allergeni || []).map((a) => ({ label: a.label, image: BK + a.image })),
    ingredientiFiltro: p.ingredienti_filtro || p.filtri || [],
  })),
}));

const productsBySlug = {};
categories.forEach((cat) => {
  cat.products.forEach((p) => {
    if (!productsBySlug[p.slug]) productsBySlug[p.slug] = { ...p, categories: [] };
    if (!productsBySlug[p.slug].categories.includes(cat.key)) {
      productsBySlug[p.slug].categories.push(cat.key);
    }
    if (!productsBySlug[p.slug].description && p.description) productsBySlug[p.slug].description = p.description;
    if (!productsBySlug[p.slug].hero && p.hero) productsBySlug[p.slug].hero = p.hero;
  });
});

const ingredientFilters = (data.filtri?.ingredienti || [])
  .filter((ing) => ing.visible === 1 || ing.visible === '1' || ing.visible === true)
  .map((ing) => ({
    label: ing.label || ing.value || ing.title || ing,
    value: ing.value || ing.label,
    image: ing.icon ? BK + ing.icon : (ing.image ? BK + ing.image : null),
  }));

const ingredientIcons = {};
(data.filtri?.ingredienti || []).forEach((ing) => {
  const key = ing.value || ing.label;
  if (key && ing.icon) ingredientIcons[key] = BK + ing.icon;
});

const slider = (data.slider_prodotti?.slides || []).map((s) => ({
  title: s.title,
  desktop: s.img?.desktop ? BK + s.img.desktop : null,
  mobile: s.img?.mobile ? BK + s.img.mobile : null,
}));

const catalog = {
  description: data.description,
  categories,
  productsBySlug,
  ingredientFilters,
  ingredientIcons,
  slider,
};

const out = `/* Auto-generated from burgerking.it prodotti data */\nwindow.BK_PRODOTTI_CATALOG = ${JSON.stringify(catalog)};\n`;
fs.writeFileSync('js/prodotti-catalog.js', out);
console.log('categories:', categories.length);
console.log('unique products:', Object.keys(productsBySlug).length);
console.log('written js/prodotti-catalog.js', (out.length / 1024).toFixed(1), 'KB');