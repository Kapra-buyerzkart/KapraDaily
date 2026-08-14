import { StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  hp,
} from '../../../styles/cartTheme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CART_COLORS.canvas,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: CART_COLORS.canvas,
  },
  sheetWrap: {
    flex: 1,
    marginTop: -hp('3.5%'),
    borderTopLeftRadius: CART_RADIUS.card + 8,
    borderTopRightRadius: CART_RADIUS.card + 8,
    backgroundColor: CART_COLORS.card,
    ...CART_ELEVATION.raised,
  },
});
