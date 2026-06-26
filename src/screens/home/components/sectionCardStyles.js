import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../../styles/typography';

// Shared "rounded card with a background image" shell reused by the product
// blocks, the bottom showcase banner, and the category-discovery section.
const sectionCardStyles = StyleSheet.create({
  headerBackgroundbg: {
    width: wp('100%'),
    marginTop: hp('1%'),
    paddingBottom: hp('3%'),
    borderRadius: wp('8%'),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  headerBackgroundbgImage: {
    resizeMode: 'cover',
    borderRadius: wp('8%'),
  },
  headerBackgroundbg2: {
    width: wp('98%'),
    height: hp('32%'),
    alignSelf: 'center',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    overflow: 'hidden',
  },
  headerBackgroundbgImage2: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
  },
  headerBackgroundbgContent: {},
  starImage: {
    width: wp('100%'),
    height: hp('13%'),
    resizeMode: 'contain',
  },
  featuredProductsText: {
    fontFamily: FONTS.outfit.medium,
    fontSize: wp('4.5%'),
    color: '#1E1E1E',
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  tokenTopDivider: {
    marginTop: hp('1%'),
    marginHorizontal: wp('5%'),
    height: 1,
    backgroundColor: '#D6D6D6',
  },
});

export default sectionCardStyles;
