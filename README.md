# Burger King Italia — Clone Front-End

Clone multi-página fiel ao site [burgerking.it](https://www.burgerking.it), desenvolvido para prova acadêmica de front-end. Foco especial na página **Qualità BK** e na promo **Big King + Bibita Small + Snack Small (4,95€)**.

## Stack

- HTML5 semântico
- [Tailwind CSS](https://cdn.tailwindcss.com) via CDN
- CSS customizado (`css/custom.css`) — fontes Flame, componentes BK
- JavaScript vanilla (`js/components.js`, `js/main.js`, `js/page-shell.js`)
- Servidor local Node.js (`server.js`)

## Como executar

### Opção 1 — Servidor local (recomendado)

```powershell
cd C:\Users\ccpru\burgerking-qualita-clone
node server.js
```

Abra no navegador: **http://127.0.0.1:8080**

Atalho Windows: dê duplo clique em `iniciar-servidor.bat`

### Opção 2 — Sem servidor

Abra `index.html` diretamente no navegador. Alguns caminhos de subpastas (ex.: promo detail) funcionam melhor com o servidor.

> **Requisito:** conexão à internet para carregar imagens, fontes Flame e Tailwind CDN.

## Mapa de páginas

| Página | Arquivo | Original |
|--------|---------|----------|
| Home | `index.html` | burgerking.it |
| **Qualità BK** ★ | `qualita-bk.html` | burgerking.it/qualita-bk |
| Prodotti | `prodotti.html` | burgerking.it/prodotti |
| Promo | `promo.html` | burgerking.it/promo |
| Big King 4,95€ | `promo/big_king__bibita_small__snack_small/` | burgerking.it/promo/big_king__bibita_small__snack_small |
| Contatti | `contatti.html` | burgerking.it/contatti |
| Novità | `novita.html` | burgerking.it/novita |
| BK Café | `bk-cafe.html` | burgerking.it/bk-cafe |
| Loyalty | `loyalty.html` | burgerking.it/loyalty |
| About us | `about-us.html` | burgerking.it/about-us |
| Press room | `press-room.html` | burgerking.it/press-room |
| **Store locator** | `trova-un-ristorante.html` | burgerking.it/trova-un-ristorante |
| Franchising | `franchising.html` | burgerking.it/franchising |

**Total: 13 páginas + 1 redirect** (`promo-big-king-menu.html`)

## Navegação interna

Todos os links do menu apontam para páginas locais. Exceções intencionais (links externos reais):

- Careers → careers.qsrp.com
- Redes sociais no footer
- Candidaturas / annunci de emprego

## Interações implementadas

- Menu hambúrguer (mobile offcanvas)
- Dropdown desktop e mobile “Tutto su di noi”
- Hero slider automático (home)
- Carousels horizontais (ingredientes, promo, prodotti, novità)
- Filtros de categoria (prodotti, BK Café)
- “Carica altri” (promo, novità, BK Café)
- Formulário contatti com campos condicionais + alert demo no envio
- Store locator com 331 ristoranti, ricerca, filtri servizi, dettaglio e mappa
- Barra mobile inferior (Prodotti, Promo, Store Locator)

## Como testar (prova das 14h)

### 1. Comparação lado a lado

Abra duas janelas:

| Clone | Original |
|-------|----------|
| http://127.0.0.1:8080/qualita-bk.html | https://www.burgerking.it/qualita-bk |
| http://127.0.0.1:8080/promo/big_king__bibita_small__snack_small/ | https://www.burgerking.it/promo/big_king__bibita_small__snack_small |
| http://127.0.0.1:8080/contatti.html | https://www.burgerking.it/contatti |
| http://127.0.0.1:8080/trova-un-ristorante.html | https://www.burgerking.it/trova-un-ristorante |
| http://127.0.0.1:8080/franchising.html | https://www.burgerking.it/franchising |

### 2. Checklist de fidelidade

- [ ] Cores: avana `#F5EBDC`, brown `#502314`, orange `#FF8732`, red `#D62300`
- [ ] Fonte Flame nos títulos
- [ ] Textos em italiano idênticos ao original
- [ ] Imagens carregando do CDN BK
- [ ] Menu com item ativo destacado em laranja
- [ ] Layout responsivo: testar 375px, 768px, 1280px (DevTools → Toggle device toolbar)

### 3. Fluxo de navegação sugerido

1. Home → clicar “Scopri i nostri ingredienti” → Qualità BK
2. Qualità BK → teaser Big King → página de detalhe da promo
3. Detalhe → “Torna alla lista” → Promo
4. Menu → Contatti → mudar opção do formulário e ver campos dinâmicos
5. Menu → Prodotti → filtros Best Seller / Manzo / Pollo
6. Menu → BK Café → filtros Bevande / Brioches / Dolci
7. Header ou barra mobile → Trova un ristorante → busca, filtro H24, dettaglio ristorante

### 4. Performance

- Sem frameworks pesados (apenas Tailwind CDN + ~3 arquivos JS locais)
- Imagens servidas pelo CDN oficial (sem duplicar assets)
- `loading="lazy"` em imagens abaixo da dobra onde aplicável

## Estrutura do projeto

```
burgerking-qualita-clone/
├── index.html              # Home
├── qualita-bk.html         # ★ Página foco
├── prodotti.html
├── promo.html
├── contatti.html
├── novita.html
├── bk-cafe.html
├── loyalty.html
├── about-us.html
├── press-room.html
├── trova-un-ristorante.html  # Store locator (331 ristoranti)
├── franchising.html          # Diventa Franchisee
├── promo/
│   └── big_king__bibita_small__snack_small/
│       └── index.html      # Detalhe Big King 4,95€
├── css/custom.css
├── js/
│   ├── components.js       # Header, footer, navegação
│   ├── main.js             # Interações
│   ├── page-shell.js       # Inicialização layout
│   ├── stores-data.js      # Dati 331 ristoranti BK Italia
│   └── store-locator.js    # Ricerca, filtri, dettaglio, mappa
├── server.js
└── source-*.html           # Referência do site original (não servir)
```

## Limitações do clone (aceitáveis para prova)

- Formulário contatti não envia e-mail (alert demo)
- reCAPTCHA é mock visual (sem API Google)
- Links legais do footer (Privacy, Cookie…) são `#`
- Mappa store locator usa OpenStreetMap (original usa Google Maps)
- Geolocalizzazione GPS mostra alert demo
- Press room com 2 comunicati (igual ao source baixado)

## Créditos

Clone educacional. Design, imagens e textos © Burger King Company LLC / Burger King Italia.