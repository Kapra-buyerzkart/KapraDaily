import { StyleSheet } from 'react-native';
import { CART_COLORS, CART_SPACING, hp } from '@/styles/cartTheme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CART_COLORS.canvas,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  topBar: {
    backgroundColor: CART_COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CART_COLORS.border,
    zIndex: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: CART_SPACING.lg,
    paddingBottom: hp('3%'),
  },
});
