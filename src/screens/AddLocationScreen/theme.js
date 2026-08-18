import { Platform, StyleSheet } from 'react-native';
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
  primaryEdge: CART_COLORS.primaryEdge,
  success: CART_COLORS.success,
  successTint: CART_COLORS.successTint,
  danger: CART_COLORS.danger,
  onDark: CART_COLORS.onPrimary,
  selectedTint: 'rgba(17,19,26,0.06)',
  pinShadow: 'rgba(11,16,32,0.22)',
};

export const RADIUS = {
  ...CART_RADIUS,
  card: 12,
  sheet: 16,
  button: 10,
  input: 10,
  chip: 8,
  sm: 8,
  xs: 6,
};
export const SPACING = CART_SPACING;
export const GUTTER = CART_GUTTER;
export const TYPE = CART_TYPE;

export const SHADOW = {
  ...CART_ELEVATION,
  float: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 20,
    },
    android: { elevation: 6 },
  }),
  sheet: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 12 },
  }),
};

export const HAIRLINE = StyleSheet.hairlineWidth;

export const FIELD_HEIGHT = hp('6.2%');

export { MAX_FONT_SCALE, hitSlopTo, hp, wp };
