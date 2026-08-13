import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CART_COLORS, CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';

export const MAX_TILES = 6;

export const PANEL_INSET = CART_SPACING.lg;
export const PANEL_PAD = CART_SPACING.lg;
export const PANEL_RADIUS = CART_RADIUS.card + 4;

export const TILE_GAP = CART_SPACING.md;
export const TILE_RADIUS = CART_RADIUS.productCard + 2;
export const TILE_TALL = wp('46%');
export const TILE_SHORT = wp('38%');
export const TILE_STAGGER = TILE_TALL - TILE_SHORT;

export const CAPTION_HEIGHT = wp('15%');
export const DISC_SIZE = wp('7.2%');

export const PANEL_SURFACE = {
  colors: ['#FFF3EC', '#FBFBFD', CART_COLORS.card],
  locations: [0, 0.45, 1],
  start: { x: 0.08, y: 0 },
  end: { x: 0.92, y: 1 },
};

export const PANEL_EDGE = 'rgba(242,80,0,0.16)';

export const STAGE_DIRECTION = {
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const STAGE_TINTS = [
  '#FFEDE2',
  '#E9F2FF',
  '#E6F6EC',
  '#FFF4DA',
  '#F1EBFF',
  '#FFECF2',
];

export const stageTint = index => STAGE_TINTS[index % STAGE_TINTS.length];

export const TILE_ENTER_STEP = 70;

export const DEFAULTS = {
  eyebrow: 'CURATED PICKS',
  title: 'Bathroom Essentials',
  subtitle: 'Everything your washroom needs',
  cta: 'See all',
  footer: 'View the full collection',
};
