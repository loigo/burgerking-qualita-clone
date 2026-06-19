export type PromoItem = {
  slug: string;
  title: string;
  thumb: string;
  hidden?: boolean;
};

export const PROMOS: PromoItem[] = [
  {
    slug: '',
    title: 'Crispy Chicken Wrap + Bibita Small + Snack Small',
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1702_thumb_it.png?v=1772624482',
  },
  {
    slug: 'big_king__bibita_small__snack_small',
    title: 'Big King + Bibita Small + Snack Small',
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1633_thumb_it.png?v=1772624957',
  },
  {
    slug: '',
    title: '3 menu medi a scelta tra 6',
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1683_thumb_it.jpg?v=1769677701',
  },
  {
    slug: '',
    title: '4 menu medi a scelta tra 6',
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1682_thumb_it.jpg?v=1769677494',
  },
  {
    slug: '',
    title: '2 menu medi a scelta tra 6',
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1681_thumb_it.jpg?v=1769677033',
  },
  {
    slug: '',
    title: 'Chicken Stripes Menu Medio',
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1676_thumb_it.png?v=1769612219',
  },
  {
    slug: '',
    title: "King Nuggets Menu' Large",
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1675_thumb_it.png?v=1769612120',
    hidden: true,
  },
  {
    slug: '',
    title: "Chicken Royal Menu' Large",
    thumb: 'https://www.burgerking.it/assets/img/console/appUser/news/1674_thumb_it.png?v=1769611810',
    hidden: true,
  },
];

export const BIG_KING_PROMO = {
  slug: 'big_king__bibita_small__snack_small',
  title: 'Big King + Bibita Small + Snack Small',
  desktopImg: 'https://www.burgerking.it/assets/img/console/appUser/news/1633_desktop_it.png?v=1772625009',
  mobileImg: 'https://www.burgerking.it/assets/img/console/appUser/news/1633_mobile_it.png?v=1772625020',
  description: [
    'Con soli 4,95€ potrai gustare un Big King Menu piccolo, composto da: 1 Crispy Chicken Wrap, patatine small e bibita small.',
    'La combo è valida solo nei ristoranti aderenti indicati sul sito. Il menu Special King Combo è una combinazione di listino sempre disponibile.',
    'Usa il coupon per il tuo ordine via app entrando nella sezione ordina e selezionando il coupon. Oppure scansiona il codice qui sotto al kiosk o al King Drive per ottenere corone.',
  ],
};

export const QUALITA_INGREDIENTS = [
  {
    title: 'LA NOSTRA CARNE',
    color: '#502314',
    image: 'https://www.burgerking.it/assets/img/console/carousel/slides/241_desktop_it.png?v=1709557484',
    description: '',
  },
  {
    title: 'LE NOSTRE VERDURE',
    color: '#198737',
    image: 'https://www.burgerking.it/assets/img/console/carousel/slides/242_desktop_it.png?v=1709557539',
    description:
      'Pomodori, lattuga, cipolle e cetrioli! Sempre freschi e sempre tagliati al momento di farcire il tuo panino.',
  },
  {
    title: 'LE NOSTRE PATATINE',
    color: '#502314',
    image: 'https://www.burgerking.it/assets/img/console/carousel/slides/243_desktop_it.png?v=1709557580',
    description:
      "Squisita croccantezza preparata a regola d'arte: basta un morso per sentire il suono della perfezione.",
  },
];

export const HOME_SLIDES = [
  {
    alt: 'Italian Summer King',
    src: 'https://www.burgerking.it/assets/img/console/carousel/slides/775_desktop_it.png?v=1781593671',
    eyebrow: 'È arrivato il King dell\'estate',
    title: 'NUOVO ITALIAN SUMMER KING',
    description:
      'I momenti veri sanno d\'estate, proprio come il nuovo burger che abbiamo messo a menù.\nVieni a provarlo, solo da Burger King.',
  },
  {
    alt: 'Bacon King',
    src: 'https://www.burgerking.it/assets/img/console/carousel/slides/766_desktop_it.png?v=1780070141',
    eyebrow: 'Diverse sfumature di Bacon King.',
    title: 'GAMMA MIA!',
    description:
      'Una nuova variante di Bacon King è appena arrivata da Burger King. Vieni a provare il nuovo Bacon King Compact, con lo stesso gusto di sempre in un nuovo formato, o la versione di Bacon King che ti crea più fame.',
  },
  {
    alt: 'On Fire Club',
    src: 'https://www.burgerking.it/assets/img/console/carousel/slides/591_image_it.png?v=1756732233',
    eyebrow: 'On Fire Club',
    title: 'Il programma fedeltà per chi è On Fire come te!',
    description: 'Unisciti, accumula corone e guadagna vantaggi esclusivi',
  },
];