import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';

export default StyleSheet.create({
  cardContainer: {
    width: wp('42%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginVertical: hp('0.8%'),
    marginHorizontal: wp('1.5%'),
    shadowColor: '#000000',
    overflow: 'hidden',
  },
  threeColumnContainer: {
    width: wp('29%'),
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: wp('1%'),
    overflow: 'hidden',
  },

  // 1. Top Header Row: UD Coins Pill (left) + Wishlist button (right)
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
    zIndex: 2,
  },
  topRowSpacer: {
    flex: 1,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2E5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 3.5,
  },
  coinPillSmall: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  coinIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  coinIconSmall: {
    width: 11,
    height: 11,
  },
  coinText: {
    fontSize: 11,
    fontFamily: FONTS.gilroy.bold,
    color: '#8D5200',
  },
  coinTextSmall: {
    fontSize: 9,
  },
  wishlistButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonSmall: {
    width: 22,
    height: 22,
  },

  // 2. Media / Image Area
  imageContainer: {
    width: '100%',
    height: hp('13%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  imageContainerSmall: {
    height: hp('10%'),
    marginVertical: 2,
  },
  productImageFill: {
    width: '100%',
    height: '100%',
  },
  productImageInner: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  productImageOutOfStock: {
    opacity: 0.4,
  },
  imageShimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.66)',
  },
  outOfStockPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 10,
  },

  // 3. Product Name & Subtitle
  titleText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
    marginTop: 4,
    lineHeight: 16.5,
    minHeight: 33,
  },
  titleTextSmall: {
    fontSize: 10.5,
    lineHeight: 13.5,
    minHeight: 27,
  },
  subtitleText: {
    fontSize: 11,
    fontFamily: FONTS.gilroy.medium,
    color: '#8E949E',
    marginTop: 1,
    minHeight: 15,
  },
  subtitleTextSmall: {
    fontSize: 9,
    minHeight: 12,
  },
  weightText: {
    fontSize: 11,
    fontFamily: FONTS.gilroy.medium,
    color: '#8E949E',
    marginTop: 1,
    minHeight: 15,
  },
  weightTextSmall: {
    fontSize: 9,
    minHeight: 12,
  },

  // 4. Dashed Divider Line
  dashedDivider: {
    width: '100%',
    height: 1,
    borderWidth: 0.6,
    borderColor: '#E8DED5',
    borderStyle: 'dashed',
    marginVertical: 6,
  },

  // 5. Bottom Row (Price & Actions)
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 2,
  },
  priceColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexShrink: 1,
  },
  actionColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sellingPriceText: {
    fontSize: 16,
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  sellingPriceTextSmall: {
    fontSize: 13,
    letterSpacing: -0.2,
  },
  mrpText: {
    fontSize: 11,
    fontFamily: FONTS.gilroy.medium,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  mrpTextSmall: {
    fontSize: 9,
  },
  mrpSpacer: {
    height: 14,
  },
  discountBadge: {
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  discountBadgeSmall: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    marginBottom: 4,
  },
  discountText: {
    color: '#1E8E3E',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 10,
    letterSpacing: 0.1,
  },
  discountTextSmall: {
    fontSize: 8,
  },
  discountSpacer: {
    height: 18,
  },

  // 6. Bottom Action: Add To Cart Button & Counter
  addButtonWrapper: {
    width: 32,
    height: 32,
  },
  addButtonWrapperSmall: {
    width: 26,
    height: 26,
  },
  addButtonContainer: {
    backgroundColor: '#3B1011',
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 9,
  },
  addButtonContainerSmall: {
    backgroundColor: '#3B1011',
    position: 'absolute',
    right: -1.5,
    bottom: -1.5,
    width: 26,
    height: 26,
    borderRadius: 7,
  },
  addButton: {
    zIndex: 1000,
    width: 32,
    height: 32,
    backgroundColor: '#FFDD04',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonSmall: {
    width: 26,
    height: 26,
    borderRadius: 7,
  },
  plusIconContainer: {
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIconContainerSmall: {
    width: 13,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBarHorizontal: {
    position: 'absolute',
    width: 17,
    height: 2.8,
    backgroundColor: '#3B1011',
  },
  plusBarHorizontalSmall: {
    position: 'absolute',
    width: 13,
    height: 2.2,
    backgroundColor: '#3B1011',
  },
  plusBarVertical: {
    position: 'absolute',
    width: 2.8,
    height: 17,
    backgroundColor: '#3B1011',
  },
  plusBarVerticalSmall: {
    position: 'absolute',
    width: 2.2,
    height: 13,
    backgroundColor: '#3B1011',
  },
  addCartIcon: {
    color: '#333333',
  },
  addText: {
    color: '#000000',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 14,
  },
  addTextSmall: {
    fontSize: 11,
  },

  // Counter Stepper (- qty +)
  counterContainer: {
    width: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  counterContainerSmall: {
    width: 56,
    borderRadius: 6,
    height: 26,
    paddingHorizontal: 2,
  },
  counterBtn: {
    paddingHorizontal: 6,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnSmall: {
    paddingHorizontal: 4,
  },
  counterBtnCapped: {
    opacity: 0.4,
  },
  counterQty: {
    color: '#000000',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 12,
    marginHorizontal: 0,
  },
  counterQtySmall: {
    fontSize: 10,
    marginHorizontal: 0,
  },
});
