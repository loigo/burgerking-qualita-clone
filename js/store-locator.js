/**
 * Store Locator — clone burgerking.it/trova-un-ristorante
 */
(function () {
  'use strict';

  const A = window.BK_ASSETS || 'https://www.burgerking.it';
  const DAY_LABELS = { lun: 'Lunedì', mar: 'Martedì', mer: 'Mercoledì', gio: 'Giovedì', ven: 'Venerdì', sab: 'Sabato', dom: 'Domenica' };

  const SERVICES = [
    { id: 'h24', label: 'H24', icon: '11_immagine.svg' },
    { id: 'KingDrive', label: 'King Drive', icon: '12_immagine.svg' },
    { id: 'Parking', label: 'Parcheggio', icon: '13_immagine.svg' },
    { id: 'PlayKing', label: 'Play King', icon: '14_immagine.svg' },
    { id: 'WIFI', label: 'Wifi', icon: '15_immagine.svg' },
    { id: 'birthday', label: 'Feste di Compleanno', icon: '16_immagine.svg' },
    { id: 'Refill', label: 'Refill', icon: '17_immagine.svg' },
    { id: 'HomeDelivery', label: 'Home Delivery', icon: '18_immagine.svg' },
    { id: 'BkCafe', label: 'BK Cafè', icon: '19_immagine.svg' },
  ];

  let activeFilters = [];
  let selectedId = null;
  let filtered = [];

  function $(id) { return document.getElementById(id); }

  function serviceIcon(id) {
    const s = SERVICES.find((x) => x.id === id);
    if (!s) return '';
    return `${A}/assets/img/console/storeServicesGroup/${s.icon}?v=1709305467`;
  }

  function serviceLabel(id) {
    return SERVICES.find((x) => x.id === id)?.label || id;
  }

  function formatHours(orari) {
    const r = orari?.ristorante;
    if (!r) return '<p class="text-[1.4rem]">Orari non disponibili</p>';
    return Object.entries(DAY_LABELS).map(function ([key, label]) {
      const d = r[key];
      if (!d) return '';
      const start = d.lunch_start || '';
      const end = d.dinner_end || d.lunch_end || '';
      if (!start && !end) return '';
      const range = end ? `${start} – ${end}` : start;
      return `<div class="orari-row flex justify-between py-1 text-[1.4rem]"><span>${label}</span><span>${range}</span></div>`;
    }).join('');
  }

  function mapUrl(lat, lon, zoom) {
    if (!lat || !lon) {
      return 'https://www.openstreetmap.org/export/embed.html?bbox=6.6%2C35.5%2C18.5%2C47.1&layer=mapnik';
    }
    const z = zoom || 0.02;
    const la = parseFloat(lat);
    const lo = parseFloat(lon);
    const bbox = `${lo - z}%2C${la - z}%2C${lo + z}%2C${la + z}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${la}%2C${lo}`;
  }

  function applyFilters() {
    const q = ($('input-ricerca-ristorante')?.value || '').trim().toLowerCase();
    const stores = window.BK_STORES || [];
    filtered = stores.filter(function (st) {
      const text = `${st.name} ${st.address} ${st.region} ${st.province}`.toLowerCase();
      const matchQ = !q || text.includes(q);
      const matchF = !activeFilters.length || activeFilters.every((f) => st.servizi.includes(f));
      return matchQ && matchF;
    });
    renderList();
    updateBadge();
  }

  function renderList() {
    const list = $('lista-elementi-sidebar');
    if (!list) return;
    if (!filtered.length) {
      list.innerHTML = '<p class="text-[1.4rem] text-bk-brown px-2 py-4">Nessun ristorante trovato.</p>';
      return;
    }
    const show = filtered.slice(0, 80);
    list.innerHTML = show.map(function (st) {
      const active = selectedId === st.storeId ? ' active' : '';
      return `<button type="button" class="elemento-sidebar-map w-full text-left${active}" data-store-id="${st.storeId}">
        <div class="flex justify-between gap-2">
          <div class="flex-grow min-w-0">
            <div class="titolo-elemento-sidebar-map font-flamebold text-[1.6rem] text-bk-brown truncate">BURGER KING <span>${st.name}</span></div>
            <div class="sottotitolo-elemento-sidebar-map text-[1.3rem] text-black/70 truncate">${st.address}</div>
          </div>
          <div class="list-col2 text-[1.2rem] text-bk-orange whitespace-nowrap pt-1">${st.region || ''}</div>
        </div>
      </button>`;
    }).join('');

    if (filtered.length > 80) {
      list.innerHTML += `<p class="text-[1.3rem] text-center py-3 text-black/60">+ ${filtered.length - 80} altri ristoranti</p>`;
    }

    list.querySelectorAll('[data-store-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDetail(btn.dataset.storeId);
      });
    });
  }

  function openDetail(storeId) {
    const st = (window.BK_STORES || []).find((s) => s.storeId === storeId);
    if (!st) return;
    selectedId = storeId;
    renderList();

    const panel = $('dettagli-elemento-sidebar');
    const shop = $('dettagli-elemento-shop');
    if (panel) panel.classList.remove('hidden');
    if (shop) shop.classList.remove('hidden');
    $('dettagli-elemento-extra')?.classList.add('hidden');

    const nameEl = $('dettagli-elemento-name');
    if (nameEl) nameEl.innerHTML = `BURGER KING<br><span class="text-bk-orange">${st.name}</span>`;

    const addr = $('dettagli-elemento-indirizzo');
    if (addr) addr.textContent = st.address;

    const phone = $('dettagli-elemento-phone');
    if (phone) {
      phone.innerHTML = st.phone
        ? `<img src="${A}/assets/images/Icon-phone.svg?v=1709305347" class="dettagli-icon inline w-5 h-5 mr-2 svg-brown" alt=""><a href="tel:${st.phone.replace(/\s/g, '')}" class="text-bk-brown no-underline">${st.phone}</a>`
        : '';
    }

    const indic = $('dettagli-elemento-indicazioni');
    if (indic && st.latitude && st.longitude) {
      const maps = `https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`;
      indic.innerHTML = `<a class="btn-main-outline no-underline inline-flex items-center gap-2" href="${maps}" target="_blank" rel="noopener">Indicazioni <img src="${A}/assets/images/icon-gps.svg?v=1709305347" class="w-4 h-4 svg-red" alt=""></a>`;
    }

    const serv = $('dettagli-elemento-servizi');
    if (serv) {
      serv.innerHTML = st.servizi.length
        ? st.servizi.map(function (id) {
            return `<span class="inline-flex items-center gap-1 mr-3 mb-2 text-[1.3rem]"><img src="${serviceIcon(id)}" class="w-5 h-5 svg-brown" alt=""> ${serviceLabel(id)}</span>`;
          }).join('')
        : '<span class="text-[1.4rem]">—</span>';
    }

    const times = $('dettagli-elemento-times');
    if (times) times.innerHTML = formatHours(st.orari);

    const map = $('store-map-iframe');
    if (map) map.src = mapUrl(st.latitude, st.longitude);

    document.querySelector('.container-store-locator')?.classList.add('detail-open');
  }

  function closeDetail() {
    selectedId = null;
    $('dettagli-elemento-sidebar')?.classList.add('hidden');
    document.querySelector('.container-store-locator')?.classList.remove('detail-open');
    renderList();
    const map = $('store-map-iframe');
    if (map) map.src = mapUrl();
  }

  function toggleFilter(id) {
    const idx = activeFilters.indexOf(id);
    if (idx >= 0) activeFilters.splice(idx, 1);
    else activeFilters.push(id);
    document.querySelectorAll(`[data-filter="${id}"]`).forEach(function (btn) {
      btn.classList.toggle('active', activeFilters.includes(id));
    });
    applyFilters();
  }

  function resetFilters() {
    activeFilters = [];
    document.querySelectorAll('.btn-filtro-serizio, .btn-filtro-mobile').forEach(function (btn) {
      btn.classList.remove('active');
    });
    applyFilters();
  }

  function updateBadge() {
    const n = activeFilters.length;
    document.querySelectorAll('.filter-badge').forEach(function (el) {
      el.textContent = String(n);
      el.style.display = n ? 'inline' : 'none';
    });
  }

  function bindFilters() {
    document.querySelectorAll('.btn-filtro-serizio, .btn-filtro-mobile').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleFilter(btn.dataset.filter);
      });
    });
    $('btn-reset-filtri')?.addEventListener('click', resetFilters);
    $('btn-applica-filtri')?.addEventListener('click', function () {
      $('filter-modal')?.classList.add('hidden');
    });
    function openFilterModal() {
      $('filter-modal')?.classList.remove('hidden');
    }
    $('btn-apri-filtri')?.addEventListener('click', openFilterModal);
    $('btn-apri-filtri-map')?.addEventListener('click', openFilterModal);
    $('btn-chiudi-filtri')?.addEventListener('click', function () {
      $('filter-modal')?.classList.add('hidden');
    });
  }

  function init() {
    if (!document.querySelector('.container-store-locator') || !window.BK_STORES) return;
    if (document.body.dataset.locatorInit) return;
    document.body.dataset.locatorInit = '1';

    filtered = window.BK_STORES.slice();
    renderList();
    bindFilters();

    const search = $('input-ricerca-ristorante');
    const resetBtn = $('img-ricerca-reset');
    search?.addEventListener('input', function () {
      if (resetBtn) resetBtn.style.display = search.value ? 'inline' : 'none';
      applyFilters();
    });
    $('img-ricerca-search')?.addEventListener('click', applyFilters);
    resetBtn?.addEventListener('click', function (e) {
      e.preventDefault();
      if (search) search.value = '';
      resetBtn.style.display = 'none';
      applyFilters();
    });
    $('btn-gps')?.addEventListener('click', function () {
      alert('Geolocalizzazione non disponibile nel clone demo. Inserisci CAP o indirizzo.');
    });
    $('chiudidettaglio')?.addEventListener('click', closeDetail);

    search?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); applyFilters(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('bk-layout-ready', init);
})();