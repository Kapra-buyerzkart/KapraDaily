import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CART_COLORS, CART_SPACING } from '../../../styles/cartTheme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    paddingBottom: hp('2%'),
  },
  itemCardWrap: {
    marginHorizontal: CART_SPACING.lg + 10,
    paddingHorizontal: CART_SPACING.lg,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: CART_COLORS.border,
  },
});
