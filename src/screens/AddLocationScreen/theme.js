import { StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  hp,
  wp,
} from '@/styles/cartTheme';

export const COLORS = {
  canvas: CART_COLORS.canvas,
  surface: CART_COLORS.card,
  well: CART_COLORS.well,
  line: CART_COLORS.border,
  lineStrong: CART_COLORS.borderStrong,
  textPrimary: CART_COLORS.textPrimary,
  textSecondary: CART_COLORS.textSecondary,
  textMuted: CART_COLORS.textMuted,
  textFaint: CART_COLORS.textFaint,
  primary: CART_COLORS.primary,
  primaryTint: CART_COLORS.primaryTint,
  danger: CART_COLORS.danger,
  onDark: CART_COLORS.onPrimary,
  selectedTint: 'rgba(17,19,26,0.06)',
};

export const RADIUS = CART_RADIUS;
export const SPACING = CART_SPACING;
export const GUTTER = CART_GUTTER;
export const TYPE = CART_TYPE;
export const SHADOW = CART_ELEVATION;

export const HAIRLINE = StyleSheet.hairlineWidth;

export const FIELD_HEIGHT = hp('5.8%');

export { MAX_FONT_SCALE, hitSlopTo, hp, wp };
