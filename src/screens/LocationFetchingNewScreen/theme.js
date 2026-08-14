import { Dimensions, StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  hp,
  wp,
} from '@/styles/cartTheme';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const COLORS = {
  canvas: '#FFFFFF',
  surface: CART_COLORS.card,
  line: CART_COLORS.border,
  textPrimary: '#151515',
  textSecondary: '#4D4D4D',
  textMuted: CART_COLORS.textMuted,
  brand: '#F04B1B',
  brandSoft: '#FF7148',
  brandDeep: '#F25000',
  brandTint: '#FDEBE6',
  ring: 'rgba(240,75,27,0.35)',
  halo: 'rgba(240,75,27,0.08)',
  onBrand: '#FFFFFF',
  danger: '#D80000',
  dangerSoft: '#F97C80',
};

export const RADIUS = CART_RADIUS;
export const SPACING = CART_SPACING;
export const TYPE = CART_TYPE;
export const SHADOW = CART_ELEVATION;

export const HAIRLINE = StyleSheet.hairlineWidth;

export { MAX_FONT_SCALE, hitSlopTo, hp, wp };
