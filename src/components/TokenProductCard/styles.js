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

  // 5. Price & Discount Row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 3,
    marginBottom: 8,
    width: '100%',
  },
  priceValuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 1,
    marginRight: 4,
  },
  sellingPriceText: {
    fontSize: 15,
    fontFamily: FONTS.gilroy.bold,
    color: '#F25000',
    letterSpacing: -0.3,
  },
  sellingPriceTextSmall: {
    fontSize: 12,
    letterSpacing: -0.2,
  },
  mrpText: {
    fontSize: 10.5,
    fontFamily: FONTS.gilroy.medium,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 3.5,
  },
  mrpTextSmall: {
    fontSize: 9,
    marginLeft: 2.5,
  },
  discountBadge: {
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    alignSelf: 'center',
    flexShrink: 0,
  },
  discountBadgeSmall: {
    paddingHorizontal: 3.5,
    paddingVertical: 1,
    borderRadius: 3.5,
    alignSelf: 'center',
    flexShrink: 0,
  },
  discountText: {
    color: '#1E8E3E',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 9.5,
    letterSpacing: 0.1,
  },
  discountTextSmall: {
    fontSize: 8,
  },

  // 6. Bottom Action: Full-Width Add To Cart Button & Counter
  addButtonWrapper: {
    width: '100%',
  },
  addButton: {
    width: '100%',
    backgroundColor: '#F25000',
    height: 36,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  addButtonSmall: {
    height: 28,
    borderRadius: 7,
    gap: 3,
  },
  addCartIcon: {
    marginRight: 2,
  },
  addText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 12.5,
  },
  addTextSmall: {
    fontSize: 10.5,
  },

  // Counter Stepper (- qty +)
  counterContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F25000',
    borderRadius: 9,
    height: 36,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  counterContainerSmall: {
    borderRadius: 7,
    height: 28,
    paddingHorizontal: 6,
  },
  counterBtn: {
    paddingHorizontal: 6,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnSmall: {
    paddingHorizontal: 2,
  },
  counterBtnCapped: {
    opacity: 0.4,
  },
  counterQty: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 13,
    marginHorizontal: 4,
  },
  counterQtySmall: {
    fontSize: 10.5,
    marginHorizontal: 2,
  },
});
