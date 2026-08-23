import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Fonts as FONTS } from '../../theme/fonts';
import { colors } from '../../theme/colours';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
  leftArrowIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  addressText: {
    color: colors.black,
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.65%'),
    marginLeft: wp('4%'),
  },
  addressContainer: {
    borderColor: colors.themeTeal,
    borderWidth: 1,
    borderRadius: wp('2.3%'),
    paddingVertical: hp('1.1%'),
    marginBottom: hp('2.5%'),
    minHeight: hp('16.1%'),
  },
  addressContainerTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.7%'),
    paddingHorizontal: wp('4%'),
  },
  addressContainerInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIcon: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
    tintColor: colors.themeTeal,
  },
  addressTypeText: {
    color: colors.black,
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.72%'),
    marginLeft: wp('2%'),
  },
  selectedView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: wp('4.65%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('0.5%'),
    backgroundColor: '#E8F5E9',
  },
  tickImage: {
    width: wp('3%'),
    height: wp('3%'),
    tintColor: colors.green,
  },
  selectedText: {
    fontFamily: FONTS.poppins.medium,
    color: colors.green,
    fontSize: wp('2.5%'),
    marginLeft: wp('1%'),
  },
  threeDotsIcon: {
    width: wp('1%'),
    height: hp('2.14%'),
    marginLeft: wp('4%'),
    tintColor: colors.themeDarkGray,
  },
  threeDotActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.themeLightGray,
    borderWidth: 1,
    borderRadius: wp('2.32%'),
    width: wp('25%'),
    height: hp('4%'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('2%'),
    backgroundColor: colors.figmaTeal,
  },
  addressContainerBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  phoneIcon: {
    width: wp('3.5%'),
    height: wp('3.5%'),
    marginRight: wp('2%'),
    tintColor: colors.themeTeal,
  },
  unSelectedAddressInnerContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.themeLightGray,
    paddingTop: hp('1%'),
  },
  addressLine: {
    color: colors.darkFontOne,
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.5%'),
  },
  addressBottomInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chooseLocationContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('3%'),
    borderWidth: 1,
    borderColor: colors.themeLightGray,
    borderRadius: wp('2.3%'),
    alignItems: 'center',
    marginBottom: hp('2%'),
    backgroundColor: colors.figmaTeal,
  },
  locationIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: colors.themeTeal,
  },
  locationText: {
    color: colors.black,
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('4%'),
    marginLeft: wp('3%'),
  },
  addAddressText: {
    color: colors.black,
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.2%'),
    alignSelf: 'center',
    marginVertical: hp('2%'),
  },
});
