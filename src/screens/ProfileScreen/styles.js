import { StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING, hp } from '@/styles/cartTheme';

export const INK = CART_COLORS.textSecondary;
export const RED = CART_COLORS.danger;
export const BG = CART_COLORS.background;
export const DIVIDER = CART_COLORS.border;

export const BAR_REST = CART_COLORS.background;
export const BAR_SOLID = CART_COLORS.card;

export const PRIVILEGE_INK = '#8A6410';
export const PRIVILEGE_SOFT = '#FDF3DC';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CART_COLORS.background,
  },
  scrollView: {
    backgroundColor: CART_COLORS.background,
  },
  scrollContent: {
    paddingBottom: hp('7%'),
  },
  heroBlock: {
    paddingTop: CART_SPACING.xs,
    gap: CART_SPACING.md,
  },
});
