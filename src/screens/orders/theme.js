import { StyleSheet } from 'react-native';
import { FONTS } from '@/styles/typography';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  TOUCH_MIN,
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
  ink: CART_COLORS.textPrimary,
  textPrimary: CART_COLORS.textPrimary,
  textSecondary: CART_COLORS.textSecondary,
  textMuted: CART_COLORS.textMuted,
  textFaint: CART_COLORS.textFaint,
  primary: CART_COLORS.primary,
  primaryTint: CART_COLORS.primaryTint,
  success: CART_COLORS.successDeep,
  successTint: CART_COLORS.successTint,
  danger: CART_COLORS.danger,
  dangerTint: CART_COLORS.dangerTint,
  info: '#0B63CE',
  infoTint: '#EDF3FD',
  warn: '#B45309',
  warnTint: '#FDF4E4',
  onDark: CART_COLORS.onPrimary,
  inkLight: CART_COLORS.textMuted,
};

export const STATUS_TONE = {
  progress: { fg: COLORS.info, bg: COLORS.infoTint },
  moving: { fg: COLORS.primary, bg: COLORS.primaryTint },
  done: { fg: COLORS.success, bg: COLORS.successTint },
  failed: { fg: COLORS.danger, bg: COLORS.dangerTint },
  waiting: { fg: COLORS.warn, bg: COLORS.warnTint },
};

export const STAR = {
  on: '#F2C94C',
  off: '#DDE1E7',
};

export const RADIUS = CART_RADIUS;
export const SPACING = CART_SPACING;
export const GUTTER = CART_GUTTER;
export const SHADOW = CART_ELEVATION;

export const TYPE = {
  ...CART_TYPE,
  microStrong: { ...CART_TYPE.micro, fontFamily: FONTS.gilroy.bold },
};

export const HAIRLINE = StyleSheet.hairlineWidth;

export { MAX_FONT_SCALE, TOUCH_MIN, hitSlopTo, hp, wp };
