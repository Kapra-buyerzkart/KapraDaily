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
    padding: 10,
    marginVertical: hp('0.8%'),
    marginHorizontal: wp('1.5%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
  },
  threeColumnContainer: {
    width: wp('29%'),
    padding: 6,
    borderRadius: 12,
    marginHorizontal: wp('1%'),
  },

  // 1. Top Header Row: Discount badge (left) + Wishlist button (right)
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2,
    zIndex: 2,
  },
  topRowSpacer: {
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#FF5500',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  discountBadgeSmall: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
  discountTextSmall: {
    fontSize: 9,
  },
  wishlistButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
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

  // 3. Weight / Unit
  weightText: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.medium,
    color: '#6B7280',
    marginTop: 6,
    minHeight: 16,
  },
  weightTextSmall: {
    fontSize: 10,
    minHeight: 13,
    marginTop: 4,
  },

  // 4. Product Name
  titleText: {
    fontSize: 13.5,
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
    marginTop: 2,
    lineHeight: 18,
    height: 36,
  },
  titleTextSmall: {
    fontSize: 11,
    lineHeight: 15,
    height: 30,
  },

  // 5. Price Row (Selling price in emerald green + strike-through MRP)
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  sellingPriceText: {
    fontSize: 18,
    fontFamily: FONTS.gilroy.bold,
    color: '#0A6C3B',
  },
  sellingPriceTextSmall: {
    fontSize: 14,
  },
  mrpText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.medium,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  mrpTextSmall: {
    fontSize: 10,
    marginLeft: 4,
  },

  // 6. Bottom Action Row: UD Coin badge (left) + ADD button / Stepper (right)
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2E5',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 8,
    gap: 3,
  },
  coinPillSmall: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
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
    fontSize: 11.5,
    fontFamily: FONTS.gilroy.bold,
    color: '#8D5200',
  },
  coinTextSmall: {
    fontSize: 9.5,
  },

  // Add Button Pill (+ ADD)
  addButton: {
    backgroundColor: '#0B4D3C',
    paddingHorizontal: 12,
    paddingVertical: 5.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
  },
  addButtonSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
    minWidth: 44,
  },
  addText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: 12.5,
    letterSpacing: 0.3,
  },
  addTextSmall: {
    fontSize: 10,
  },

  // Counter Stepper (- qty +)
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B4D3C',
    borderRadius: 14,
    height: 27,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    minWidth: 62,
  },
  counterContainerSmall: {
    borderRadius: 10,
    height: 22,
    paddingHorizontal: 4,
    minWidth: 46,
  },
  counterBtn: {
    paddingHorizontal: 4,
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
    fontSize: 12,
    marginHorizontal: 4,
  },
  counterQtySmall: {
    fontSize: 10,
    marginHorizontal: 2,
  },
});
