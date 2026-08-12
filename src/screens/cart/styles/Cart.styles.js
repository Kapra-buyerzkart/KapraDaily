import { StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_GUTTER,
  CART_SPACING,
  hp,
} from '../../../styles/cartTheme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CART_COLORS.canvas,
  },
  emptyContainer: {
    backgroundColor: CART_COLORS.card,
  },
  topBar: {
    backgroundColor: CART_COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CART_COLORS.border,
    zIndex: 5,
  },
  listContent: {
    paddingBottom: hp('2%'),
  },
  itemCardWrap: {
    marginHorizontal: CART_GUTTER,
    paddingHorizontal: CART_SPACING.lg,
    backgroundColor: CART_COLORS.card,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CART_COLORS.border,
  },
});
