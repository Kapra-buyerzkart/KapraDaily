import { StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING, hp } from '@/styles/cartTheme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CART_COLORS.canvas,
  },
  topBar: {
    backgroundColor: CART_COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CART_COLORS.border,
    zIndex: 5,
  },
  listContent: {
    paddingTop: CART_SPACING.lg,
    gap: CART_SPACING.md,
  },
  summaryBlock: {
    marginBottom: CART_SPACING.xs,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp('10%'),
    gap: CART_SPACING.md,
  },
});
