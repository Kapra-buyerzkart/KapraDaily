import { Dimensions, StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING, hp } from '@/styles/cartTheme';

export const { width: SCREEN_W } = Dimensions.get('window');

export const GUTTER = CART_SPACING.lg;
export const CARD_W = SCREEN_W - GUTTER * 2;

export const BAR_REST = CART_COLORS.background;
export const BAR_SOLID = CART_COLORS.card;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CART_COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: CART_SPACING.md,
    paddingBottom: hp('12%'),
  },
  section: {
    marginTop: CART_SPACING.xxl,
  },
  railContent: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.md,
  },
  more: {
    marginTop: CART_SPACING.md,
  },
});
