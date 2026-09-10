import {
  CART_COLORS,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  hp,
  wp,
} from '@/styles/cartTheme';

export const PALETTE = {
  canvas: CART_COLORS.canvas,
  surface: CART_COLORS.card,
  well: CART_COLORS.well,
  line: CART_COLORS.border,
  brand: CART_COLORS.primary,
  brandTint: CART_COLORS.primaryTint,
  brandEdge: CART_COLORS.primaryEdge,
  textPrimary: CART_COLORS.textPrimary,
  textMuted: CART_COLORS.textMuted,
  textFaint: CART_COLORS.textFaint,
  onDark: CART_COLORS.onPrimary,
};

const FADE_SLICES = 14;

const fadeStack = (id, color, peak) =>
  Array.from({ length: FADE_SLICES }, (_, index) => ({
    key: `${id}-${index}`,
    color,
    opacity: Number((peak * (1 - index / FADE_SLICES) ** 2).toFixed(3)),
  }));

export const BACKDROP = {
  washHeight: hp('46%'),
  glowHeight: hp('26%'),
  wash: fadeStack('wash', '#FFFFFF', 1),
  glow: fadeStack('glow', PALETTE.brandTint, 0.95),
  orbs: [
    {
      key: 'orb-top-outer',
      size: wp('112%'),
      top: -hp('17%'),
      left: -wp('36%'),
      color: PALETTE.brandTint,
      opacity: 0.5,
    },
    {
      key: 'orb-top-inner',
      size: wp('74%'),
      top: -hp('10%'),
      left: -wp('17%'),
      color: PALETTE.brandTint,
      opacity: 0.55,
    },
    {
      key: 'orb-side',
      size: wp('60%'),
      top: hp('16%'),
      right: -wp('26%'),
      color: '#FFE7D8',
      opacity: 0.45,
    },
    {
      key: 'orb-bottom-outer',
      size: wp('104%'),
      bottom: -hp('12%'),
      right: -wp('40%'),
      color: '#FFE0CC',
      opacity: 0.4,
    },
    {
      key: 'orb-bottom-inner',
      size: wp('62%'),
      bottom: -hp('5%'),
      right: -wp('23%'),
      color: '#FFE0CC',
      opacity: 0.5,
    },
  ],
};

export const RADIUS = CART_RADIUS;

export const SPACING = CART_SPACING;

export const GUTTER = CART_GUTTER;

export const TYPE = CART_TYPE;

export const TILE_RATIO = {
  wide: 1194 / 672,
  half: 1000 / 901,
};

export const LOGO_RATIO = 900 / 465;

export { hp, wp };
