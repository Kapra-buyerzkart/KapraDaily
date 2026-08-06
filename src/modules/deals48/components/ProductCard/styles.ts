import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors, fontColors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
  container: {
    width: wp('45%'),
    height: hp('35%'),
    backgroundColor: colors.white,
    borderRadius: wp('4%'),
    margin: wp('2%'),
    borderWidth: 1,
    borderColor: '#F25000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageSection: {
    width: '100%',
    height: '50%',
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0F2F1',
  },
  discountBadge: {
    position: 'absolute',
    top: wp('2%'),
    left: wp('2%'),
    backgroundColor: colors.white,
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F25000',
  },
  discountText: {
    fontSize: wp('2.2%'),
    color: '#F25000',
    fontFamily: Fonts.gilroyBold,
  },
  wishlistIcon: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
  },
  detailsContainer: {
    height: '50%',
    padding: wp('3%'),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.gilroyRegular,
    color: fontColors.titleBlack,
    marginBottom: hp('0.5%'),
    height: hp('4%'),
  },
  ratingContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('1%'),
    marginBottom: hp('0.5%'),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: Fonts.gilroyBold,
    color: fontColors.titleBlack,
    marginRight: wp('2%'),
    fontWeight: 'bold',
  },
  mrp: {
    fontSize: wp('2.5%'),
    fontFamily: Fonts.gilroyRegular,
    color: fontColors.themeLightGray,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    width: '100%',
    height: hp('5.5%'),
    borderRadius: wp('10%'),
    overflow: 'hidden',
  },
  cartGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('2%'),
  },
  cartIcon: {
    marginRight: wp('2%'),
  },
  cartText: {
    fontSize: wp('3.4%'),
    fontFamily: Fonts.gilroyBold,
    color: colors.white,
    fontWeight: 'bold',
  },
});
