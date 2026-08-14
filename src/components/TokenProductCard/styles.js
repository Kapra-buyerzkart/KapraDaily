import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import { INK, ACCENT, SURFACE, RADIUS, SPACE, TYPE } from '@/styles/homeTheme';
import {
  ADD_OFFSET,
  ADD_SIZE,
  ADD_SIZE_SMALL,
  DOCK_OVERHANG,
  DOCK_OVERHANG_SMALL,
  DOCK_WIDTH,
  HEART_SIZE,
  NAME_LINES,
} from './constants';
import COLORS from '@/styles/colors';

const SAVINGS_RULE = 'rgba(17,19,26,0.18)';
const CARD_BORDER = '#E5E7EB';
const PRICE_PILL = '#17853C';

export default StyleSheet.create({
  cardContainer: {
    width: wp('35%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
    padding: SPACE.sm,
    borderRadius: RADIUS.lg,
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    backgroundColor: SURFACE.base,
  },
  threeColumnContainer: {
    width: wp('29%'),
    marginHorizontal: wp('1%'),
    padding: SPACE.xs + 2,
    borderRadius: RADIUS.md,
  },

  mediaWrap: {
    width: '100%',
    position: 'relative',
  },
  mediaWell: {
    width: '100%',
    borderColor: COLORS.border,
    borderWidth: StyleSheet.hairlineWidth,
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mediaWellSmall: {
    borderRadius: RADIUS.sm,
  },

  productImageFill: {
    width: '86%',
    height: '86%',
  },
  productImageInner: {
    flex: 1,
  },
  productImageOutOfStock: {
    opacity: 0.45,
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
    backgroundColor: INK.base,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  outOfStockText: {
    ...TYPE.micro,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },

  wishlistButton: {
    position: 'absolute',
    top: SPACE.sm,
    right: SPACE.sm,
    width: HEART_SIZE,
    height: HEART_SIZE,
    borderRadius: HEART_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  wishlistButtonSmall: {
    top: SPACE.xs,
    right: SPACE.xs,
  },

  // Sits outside the well so the overhang is not clipped by its overflow, and
  // is sized as a share of the card so the counter pill scales with the card.
  actionDock: {
    position: 'absolute',
    right: SPACE.sm,
    bottom: -DOCK_OVERHANG,
    width: DOCK_WIDTH,
    alignItems: 'flex-end',
  },
  actionDockSmall: {
    right: SPACE.xs,
    bottom: -DOCK_OVERHANG_SMALL,
  },

  addButton: {
    width: ADD_SIZE,
    height: ADD_SIZE,
    borderRadius: RADIUS.xxs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.base,
    borderWidth: 1.6,
    right: ADD_OFFSET,
    bottom: ADD_OFFSET,
    borderColor: ACCENT.primary,
  },
  addButtonWrapper: {
    width: ADD_SIZE,
    height: ADD_SIZE,
    borderRadius: RADIUS.xxs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT.primary,
  },

  addButtonSmall: {
    width: ADD_SIZE_SMALL,
    height: ADD_SIZE_SMALL,
    borderRadius: RADIUS.xxs + 2,
  },
  addButtonWrapperSmall: {
    width: ADD_SIZE_SMALL,
    height: ADD_SIZE_SMALL,
    borderRadius: RADIUS.xxs + 2,
  },

  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: ADD_SIZE + ADD_OFFSET,
    borderRadius: RADIUS.xxs + 2,
    backgroundColor: ACCENT.primary,
  },
  counterContainerSmall: {
    height: ADD_SIZE_SMALL + ADD_OFFSET,
    borderRadius: RADIUS.xs + 2,
  },
  // Narrower than the pill's height so a two-digit quantity still has room.
  counterBtn: {
    width: ADD_SIZE - 4,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnSmall: {
    width: ADD_SIZE_SMALL - 4,
  },
  counterQty: {
    ...TYPE.label,
    lineHeight: undefined,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },
  counterQtySmall: {
    ...TYPE.caption,
    lineHeight: undefined,
  },

  // Clears the dock's overhang so the price never sits under the add button.
  info: {
    paddingTop: DOCK_OVERHANG + SPACE.sm,
  },
  infoSmall: {
    paddingTop: DOCK_OVERHANG_SMALL + SPACE.sm,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricePill: {
    backgroundColor: PRICE_PILL,
    borderRadius: RADIUS.xxs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
    bottom: 2,
    right: 1.5,

    alignSelf: 'flex-start',
  },
  pricePillSmall: {
    paddingHorizontal: SPACE.xs + 2,
    paddingVertical: 3,
  },
  priceText: {
    ...TYPE.label,
    lineHeight: undefined,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
    includeFontPadding: false,
  },
  priceTextSmall: {
    ...TYPE.caption,
    lineHeight: undefined,
  },
  priceSymbol: {
    fontSize: TYPE.micro.fontSize,
  },
  priceSymbolSmall: {
    fontSize: TYPE.micro.fontSize - 1,
  },
  mrpText: {
    ...TYPE.caption,
    color: INK.faint,
    fontFamily: FONTS.gilroy.semiBold,
    textDecorationLine: 'line-through',
    marginLeft: SPACE.xs + 2,
  },
  mrpTextSmall: {
    ...TYPE.micro,
  },

  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.xs + 2,
    minHeight: TYPE.micro.lineHeight,
  },
  savingsText: {
    ...TYPE.micro,
    color: ACCENT.successText,
    fontFamily: FONTS.gilroy.bold,
  },
  // A dashed border only renders on both platforms when every side is set, so
  // the rule is a 2pt dashed box clipped by a 1pt window to show just its top.
  savingsRuleClip: {
    flex: 1,
    height: 1,
    overflow: 'hidden',
    marginLeft: SPACE.xs + 2,
  },
  savingsRule: {
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: SAVINGS_RULE,
  },

  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACE.xs + 2,
    minHeight: TYPE.micro.lineHeight,
    maxWidth: '100%',
    backgroundColor: ACCENT.actionSoft,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
    gap: 3,
  },
  tokenRowSmall: {
    paddingHorizontal: 4,
    gap: 2,
  },
  tokenText: {
    ...TYPE.micro,
    color: ACCENT.action,
    fontFamily: FONTS.gilroy.bold,
    flexShrink: 1,
  },
  rewardCoin: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  rewardCoinSmall: {
    width: 10,
    height: 10,
  },
  rewardToken: {
    width: 14,
    height: 12,
    resizeMode: 'contain',
  },
  rewardTokenSmall: {
    width: 12,
    height: 10,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.xs + 2,
    gap: SPACE.xs,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
    gap: 2,
  },
  ratingText: {
    ...TYPE.micro,
    color: ACCENT.successText,
    fontFamily: FONTS.gilroy.bold,
  },
  deliveryText: {
    ...TYPE.micro,
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
  },

  productName: {
    ...TYPE.label,
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    marginTop: SPACE.xs + 2,
    minHeight: TYPE.label.lineHeight * NAME_LINES,
    includeFontPadding: false,
  },
  productNameSmall: {
    ...TYPE.caption,
    minHeight: TYPE.caption.lineHeight * NAME_LINES,
  },
  productWeight: {
    ...TYPE.caption,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
    marginTop: 2,
    minHeight: TYPE.caption.lineHeight,
  },
  productWeightSmall: {
    ...TYPE.micro,
    minHeight: TYPE.micro.lineHeight,
  },
});
