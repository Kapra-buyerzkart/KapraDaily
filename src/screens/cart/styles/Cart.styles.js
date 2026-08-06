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
    marginHorizontal: CART_SPACING.lg,
    paddingHorizontal: CART_SPACING.lg,
    backgroundColor: CART_COLORS.card,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: CART_COLORS.border,
  },
});
