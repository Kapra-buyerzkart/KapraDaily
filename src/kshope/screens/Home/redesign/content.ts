import { HOME_ART } from './assets';

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
  price: string;
  mrp: string;
  discount: string;
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
  image: any;
  raw?: any;
};

export const HEADER_CONTENT = {
  title: 'Home',
  address: 'Kapra Group, 2nd floor, nandhanam....',
  searchPlaceholder: "Search For 'Cookware'",
};

export const CATEGORY_TABS = [
  'All',
  'Cooking Appliances',
  'Garment Care',
  'Grooming',
  'Cooling & Fans',
  'Cookware',
  'Torches & Lights',
];

export const HEADER_CIRCLES: Tile[] = [
  { id: 'mixer', label: 'Mixer & Grinders', image: HOME_ART.catCircle1 },
  { id: 'kettle', label: 'Kettles & cooking', image: HOME_ART.catCircle2 },
  { id: 'induction', label: 'Induction Cooktops', image: HOME_ART.catCircle3 },
  { id: 'rice', label: 'Rice Cookers', image: HOME_ART.catCircle4 },
];

export const FEATURED_PRODUCTS: ProductTile[] = [
  {
    id: 'impex-iron',
    brand: 'Impex',
    name: '900 w Iron Box',
    price: '$1,500/-',
    mrp: '$2,000',
    discount: '30% OFF',
    image: HOME_ART.prodIronbox,
  },
  {
    id: 'apple-iphone',
    brand: 'Apple',
    name: 'iphone 17 pro max',
    price: '$1,30,000/-',
    mrp: '$1,40,000',
    discount: '10% OFF',
    image: HOME_ART.prodIphone,
  },
  {
    id: 'samsung-washer',
    brand: 'Samsung',
    name: 'Washing Machine',
    price: '$7,500/-',
    mrp: '$9,000',
    discount: '20% OFF',
    image: HOME_ART.prodWashingMachine,
  },
];

export const CATEGORY_CHIPS: Tile[] = [
  { id: 'all', label: 'All', image: HOME_ART.chipGadgets },
  { id: 'gadgets', label: 'Gadgets', image: HOME_ART.chipAudio },
  { id: 'furniture', label: 'furniture', image: HOME_ART.chipFurniture },
  { id: 'cookware', label: 'cookware', image: HOME_ART.chipCookware },
];

export const CATEGORY_CARDS: Tile[] = [
  { id: 'tv', label: 'Television', image: HOME_ART.catTelevision },
  { id: 'utensils', label: 'Utensils', image: HOME_ART.catUtensils },
  { id: 'sofa', label: 'Sofa', image: HOME_ART.catSofa },
];

export const BEST_SELLING: Tile[] = [
  { id: 'bs-tv', label: 'Television', image: HOME_ART.bestTelevision },
  { id: 'bs-speaker', label: 'Speaker', image: HOME_ART.bestSpeaker },
  { id: 'bs-utensils', label: 'Utensils', image: HOME_ART.bestUtensils },
  { id: 'bs-sofa', label: 'Sofa', image: HOME_ART.bestSofa },
  { id: 'bs-earbud', label: 'Earbud', image: HOME_ART.bestEarbud },
  { id: 'bs-headphones', label: 'Headphones', image: HOME_ART.bestHeadphones },
];

export const BRANDS: { id: string; image: any }[] = [
  { id: 'brand-1', image: HOME_ART.brand1 },
  { id: 'brand-2', image: HOME_ART.brand2 },
  { id: 'brand-3', image: HOME_ART.brand3 },
  { id: 'brand-4', image: HOME_ART.brand4 },
];

export const RECOMMENDED: RecCard[] = [
  {
    id: 'boat-450',
    name: 'boAt Rockerz 450',
    subtitle: 'Bluetooth Headphones',
    price: '$ 1,499/-',
    mrp: '$2,499/-',
    discount: '30% OFF',
    image: HOME_ART.recBoatHeadphones,
  },
  {
    id: 'safari-bag',
    name: 'Safari pentagon',
    subtitle: 'Laptop bag',
    price: '$ 1,199/-',
    mrp: '$2,899/-',
    discount: '30% OFF',
    image: HOME_ART.recSafariBag,
  },
  {
    id: 'noise-watch',
    name: 'Noise Colorfit Pro 5',
    subtitle: 'Smartwatch',
    price: '$ 1,499/-',
    mrp: '$2,499/-',
    discount: '30% OFF',
    image: HOME_ART.recNoiseWatch,
  },
  {
    id: 'realme-t300',
    name: 'Realme Buds T300',
    subtitle: 'ANC Earbuds',
    price: '$ 1,499/-',
    mrp: '$2,499/-',
    discount: '30% OFF',
    image: HOME_ART.recRealmeT300,
  },
  {
    id: 'havels-fan',
    name: 'Havels 0527',
    subtitle: 'Table Fan',
    price: '$ 1,499/-',
    mrp: '$2,499/-',
    discount: '30% OFF',
    image: HOME_ART.recTableFan,
  },
  {
    id: 'realme-q100',
    name: 'Realme Buds Q100',
    subtitle: 'ANC Earbuds',
    price: '$ 3,499/-',
    mrp: '$4,499/-',
    discount: '30% OFF',
    image: HOME_ART.recRealmeQ100,
  },
];

export const RECENTLY_VIEWED = [
  { id: 'rv-earpods', label: 'Earpods', price: '$ 1,499/-', mrp: '$ 2,499/-' },
  { id: 'rv-watch', label: 'Smartwatch', price: '$ 5,499/-', mrp: '$ 10,499/-' },
  { id: 'rv-headphones', label: 'Headphones', price: '$23,899/-', mrp: '$ 52,499/-' },
  { id: 'rv-backpack', label: 'Backpack', price: '$ 11,499/-', mrp: '$ 22,499/-' },
  { id: 'rv-laptopbag', label: 'Laptop Bag', price: '$ 1,499/-', mrp: '$ 2,499/-' },
];

export const EXPLORE_ROW_ONE: Tile[] = [
  { id: 'ex-phones', label: 'Smartphones', image: HOME_ART.exploreSmartphones },
  { id: 'ex-lamps', label: 'Lights & Lamps', image: HOME_ART.exploreLamps },
  { id: 'ex-fridge', label: 'Fridge', image: HOME_ART.exploreFridge },
  { id: 'ex-washer', label: 'Washing Machine', image: HOME_ART.exploreWashingMachine },
  { id: 'ex-furniture', label: 'Furniture', image: HOME_ART.exploreFurniture },
];

export const EXPLORE_ROW_TWO: Tile[] = [
  { id: 'ex-ac', label: 'Air conditioning', image: HOME_ART.exploreAc },
  { id: 'ex-kitchen', label: 'Kitchen', image: HOME_ART.exploreKitchen },
  { id: 'ex-tv', label: 'Television', image: HOME_ART.exploreTelevision },
  { id: 'ex-camera', label: 'Camera', image: HOME_ART.exploreCamera },
  { id: 'ex-smartwatch', label: 'Smartwatch', image: HOME_ART.exploreSmartwatch },
];

export const FOOTER_NOTE = 'Thank You For Exploring 48 Hrs Deal';
