import {
  CART_COLORS,
  CART_ELEVATION,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
} from '@/styles/cartTheme';
import { ACCENT } from '@/styles/homeTheme';

export const PALETTE = {
  gold: '#F6C445',
  goldDeep: '#B8860B',
  goldTint: '#FDF6E3',
  violet: '#6E34C0',
  violetTint: '#F3EEFF',
  token: ACCENT.discount,
  orange: CART_COLORS.primary,
  orangeTint: CART_COLORS.primaryTint,
  surface: CART_COLORS.card,
  canvas: CART_COLORS.canvas,
  well: CART_COLORS.well,
  line: CART_COLORS.border,
  lineStrong: CART_COLORS.borderStrong,
  textPrimary: CART_COLORS.textPrimary,
  textSecondary: CART_COLORS.textSecondary,
  textMuted: CART_COLORS.textMuted,
  textFaint: CART_COLORS.textFaint,
  credit: CART_COLORS.successDeep,
  creditTint: CART_COLORS.successTint,
  debit: CART_COLORS.danger,
  debitTint: CART_COLORS.dangerTint,
  disabled: CART_COLORS.well,
  disabledText: CART_COLORS.textFaint,
  selected: CART_COLORS.textPrimary,
  selectedTint: 'rgba(17,19,26,0.06)',
};

export const RADIUS = CART_RADIUS;

export const SPACING = CART_SPACING;

export const GUTTER = CART_GUTTER;

export const SHADOW = {
  card: CART_ELEVATION.card,
  float: CART_ELEVATION.raised,
  bar: CART_ELEVATION.bar,
};
