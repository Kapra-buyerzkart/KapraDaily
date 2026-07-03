import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('3%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    paddingHorizontal: wp('4.65%'),
  },
  searchText: {
    color: '#000000',
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.65%'),
    marginLeft: wp('2%'),
  },
  filterButton: {
    padding: wp('1.5%'),
  },
  searchContainer: {
    backgroundColor: '#fefefe',
    width: wp('90.7%'),
    height: hp('5.36%'),
    borderRadius: wp('2.33%'),
    alignSelf: 'center',
    marginTop: hp('2.7%'),
    flexDirection: 'row',
    borderWidth: 0.3,
    borderColor: '#8f8f8f',
    alignItems: 'center',
    paddingHorizontal: wp('4.65%'),
  },
  searchIcon: {
    width: wp('4.19%'),
    height: wp('4.19%'),
  },
  searchInput: {
    fontFamily: FONTS.poppins.light,
    fontSize: wp('3.72%'),
    color: '#000000',
    marginLeft: wp('2%'),
    flex: 1,
    top: Platform.OS === 'ios' ? 1.5 : 1,
  },
  divider: {
    height: hp('2.65%'),
    width: 1,
    backgroundColor: '#8f8f8f',
  },
  clipboardIcon: {
    width: wp('4.65%'),
    height: wp('4.65%'),
    marginLeft: wp('3.5%'),
  },
  resultText: {
    color: '#000000',
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('2.79%'),
    marginHorizontal: wp('5%'),
    marginTop: hp('1.5%'),
  },
  fallbackNoticeText: {
    color: '#F25000',
    fontFamily: FONTS.outfit.medium,
    fontSize: wp('2.8%'),
    marginHorizontal: wp('5%'),
    marginTop: hp('0.5%'),
  },
  productCardWrapper: {
    flex: 1,
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  recentTitle: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('2.79%'),
    color: '#000000',
    marginLeft: wp('5%'),
    marginTop: hp('2%'),
  },
  recentProduct: {
    width: wp('20.23%'),
    height: hp('2.57%'),
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: wp('2.33%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
    marginBottom: hp('1.2%'),
  },
  recentProductText: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('2.79%'),
    color: '#000000',
  },
  recentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: wp('3%'),
    marginTop: hp('1%'),
  },
  productWrapper: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('10%'),
  },
  emptyImage: {
    width: wp('50%'),
    height: wp('50%'),
    resizeMode: 'contain',
  },
  noResultsText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.5%'),
    color: '#666666',
    textAlign: 'center',
    marginTop: hp('2%'),
    paddingHorizontal: wp('10%'),
  },
  centeredLoader: {
    position: 'absolute',
    top: hp('35%'),
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default styles;
