import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';

export const MAX_TILES = 3;

export const PANEL_INSET = CART_SPACING.lg;
export const PANEL_PAD = CART_SPACING.md;
export const PANEL_RADIUS = CART_RADIUS.card + 6;

export const HERO_HEIGHT = wp('52%');
export const HERO_RADIUS = CART_RADIUS.card;

export const TILE_GAP = CART_SPACING.sm;
export const TILE_RADIUS = CART_RADIUS.productCard;
export const TILE_STAGE = wp('20%');

export const SEAL_HERO = wp('21%');
export const SEAL_TILE = wp('14%');
export const RING_SIZE = wp('9%');

export const CHIP_ICON = wp('8%');

export const PEACH = {
  deep: '#B8400F',
  ink: '#7A2E0B',
  wash: '#FBE2CE',
  washSoft: '#FDEEE1',
  card: '#FCEADB',
  edge: 'rgba(184,64,15,0.18)',
  seal: '#B01D2E',
  sealHero: '#F06079',
};

export const PANEL_SURFACE = {
  colors: ['#FCE3CE', '#F9D5BB'],
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
};

export const HERO_SCRIM = {
  colors: ['rgba(0,0,0,0)', 'rgba(122,46,11,0.55)'],
  locations: [0.35, 1],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const TILE_ENTER_STEP = 80;

export const TRUST_POINTS = [
  { key: 'trusted', icon: 'shield', label: 'Trusted', caption: 'Brands' },
  { key: 'quick', icon: 'clock', label: 'Quick', caption: 'Delivery' },
  { key: 'price', icon: 'percent', label: 'Best', caption: 'Prices' },
];

export const DEFAULTS = {
  eyebrow: 'Sparkle Every Day',
  title: 'Bathroom Essentials',
  offerLead: 'UP TO',
  offer: '60%',
  offerTrail: 'OFF',
  tileOfferLead: 'upto',
  tileOfferTrail: 'Offer',
  cta: 'See More Deals',
};
