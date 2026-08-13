import { StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING, hp } from '@/styles/cartTheme';

export const BAR_REST = CART_COLORS.background;
export const BAR_SOLID = CART_COLORS.card;

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CART_COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: CART_COLORS.background,
  },
  scrollContent: {
    paddingBottom: hp('4%'),
  },
  body: {
    paddingTop: CART_SPACING.xs,
    gap: CART_SPACING.md,
  },
});
