import { KAPRA_ART } from './kapraAssets';

export type Tile = {
  id: string;
  label: string;
  image: any;
  raw?: any;
};

export type ProductTile = {
  id: string;
  brand: string;
  name: string;
  subtitle?: string;
  price: string;
  rawPrice?: number;
  mrp: string;
  discount: string;
  certified?: boolean;
  tokens?: number;
  image: any;
  raw?: any;
};

export type RecCard = {
  id: string;
  variant?: 'product' | 'banner';
  name: string;
  subtitle: string;
  price: string;
  mrp: string;
  discount: string;
  certified?: boolean;
  image: any;
  raw?: any;
};

export type OccasionTile = {
  id: string;
  label: string;
  image: any;
  query: string;
};

export const HEADER_CONTENT = {
  title: 'Kapra Gold & Diamonds',
  address: 'Kochi',
  searchPlaceholder: 'Search rings, earrings, gold...',
};

export const TRUST_BADGES = [
  {
    id: 'certified',
    title: 'Certified Jewellery',
    subtitle: 'Trusted Quality',
    icon: 'diamond',
  },
  {
    id: 'secure',
    title: 'Secure Shopping',
    subtitle: '100% safe and secure',
    icon: 'lock',
  },
  {
    id: 'support',
    title: 'Easy Support',
    subtitle: "We're here for you",
    icon: 'headset',
  },
];

export const KAPRA_CATEGORY_CIRCLES: Tile[] = [
  { id: 'rings', label: 'Rings', image: KAPRA_ART.catRings },
  { id: 'earrings', label: 'Earrings', image: KAPRA_ART.catEarrings },
  { id: 'pendants', label: 'Pendants', image: KAPRA_ART.catPendants },
  { id: 'bangles', label: 'Bangles', image: KAPRA_ART.catBangles },
  { id: 'gold', label: 'Gold', image: KAPRA_ART.catGold },
  { id: 'diamonds', label: 'Diamonds', image: KAPRA_ART.catDiamonds },
];

export const KAPRA_OCCASIONS: OccasionTile[] = [
  {
    id: 'everyday',
    label: 'Everyday Wear',
    image: KAPRA_ART.occasionEveryday,
    query: 'Everyday Wear',
  },
  {
    id: 'weddings',
    label: 'Weddings',
    image: KAPRA_ART.occasionWedding,
    query: 'Weddings',
  },
  {
    id: 'festive',
    label: 'Festive',
    image: KAPRA_ART.occasionFestive,
    query: 'Festive',
  },
  {
    id: 'gifting',
    label: 'Gifting',
    image: KAPRA_ART.occasionGifting,
    query: 'Gifting',
  },
];

export const CATEGORY_TABS: string[] = ['All', 'Rings', 'Earrings', 'Pendants', 'Bangles', 'Gold', 'Diamonds'];
export const HEADER_CIRCLES: Tile[] = KAPRA_CATEGORY_CIRCLES;
export const FOOTER_NOTE = 'Kapra Gold & Diamonds';

// Strictly empty fallback arrays: No dummy electronics or fake products
export const FEATURED_PRODUCTS: ProductTile[] = [];
export const RECOMMENDED: RecCard[] = [];
export const RECENTLY_VIEWED: ProductTile[] = [];
export const CATEGORY_CHIPS: Tile[] = [];
export const CATEGORY_CARDS: Tile[] = [];
export const BEST_SELLING: Tile[] = [];
export const BRANDS: { id: string; image: any }[] = [];
