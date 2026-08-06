import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  INK,
  ACCENT,
  SURFACE,
  RADIUS,
  SPACE,
  TYPE,
  HAIRLINE,
} from '@/styles/homeTheme';
import {
  ACTION_H,
  ACTION_W,
  ACTION_H_SMALL,
  ACTION_W_SMALL,
  NAME_LINES,
} from './constants';

export default StyleSheet.create({
  cardContainer: {
    width: wp('35%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
  },
  threeColumnContainer: {
    width: wp('29%'),
    marginHorizontal: wp('1%'),
  },

  cardSurface: {
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: SPACE.sm,
  },
  cardSurfaceSmall: {
    padding: SPACE.xs + 2,
    borderRadius: RADIUS.sm,
  },

  mediaWrap: {
    width: '100%',
    position: 'relative',
  },
  mediaWell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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

  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: ACCENT.discount,
    paddingHorizontal: SPACE.sm - 2,
    paddingVertical: 2,
    borderTopLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  discountText: {
    ...TYPE.micro,
    fontSize: TYPE.micro.fontSize - 1,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.2,
  },

  wishlistButton: {
    position: 'absolute',
    top: SPACE.xs,
    right: SPACE.xs,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },

  actionDock: {
    position: 'absolute',
    right: 0,
    bottom: -(ACTION_H / 2),
  },
  actionDockSmall: {
    bottom: -(ACTION_H_SMALL / 2),
  },
  addButton: {
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.base,
    borderWidth: 1.2,
    borderColor: ACCENT.primary,
  },
  addButtonSmall: {
    width: ACTION_W_SMALL,
    height: ACTION_H_SMALL,
  },
  addLabel: {
    ...TYPE.label,
    lineHeight: undefined,
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.4,
  },
  addLabelSmall: {
    ...TYPE.caption,
    lineHeight: undefined,
  },
  addDisabled: {
    backgroundColor: SURFACE.sunken,
    borderColor: HAIRLINE,
  },
  addLabelDisabled: {
    color: INK.faint,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.xs,
    backgroundColor: ACCENT.primary,
  },
  counterContainerSmall: {
    width: ACTION_W_SMALL,
    height: ACTION_H_SMALL,
  },
  counterBtn: {
    width: ACTION_H,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnSmall: {
    width: ACTION_H_SMALL - 4,
  },
  counterQty: {
    ...TYPE.label,
    lineHeight: undefined,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },

  info: {
    paddingTop: ACTION_H / 2 + SPACE.sm,
  },
  infoSmall: {
    paddingTop: ACTION_H_SMALL / 2 + SPACE.xs,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.xs,
  },
  tokenIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  tokenText: {
    ...TYPE.micro,
    color: '#5E3568',
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: SPACE.xs,
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.xs,
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
    color: INK.base,
    fontFamily: FONTS.gilroy.semiBold,
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

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACE.xs + 2,
    flexWrap: 'wrap',
  },
  priceText: {
    ...TYPE.heading,
    lineHeight: undefined,
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
  },
  priceTextSmall: {
    ...TYPE.body,
    lineHeight: undefined,
  },
  mrpText: {
    ...TYPE.caption,
    color: INK.faint,
    fontFamily: FONTS.gilroy.medium,
    textDecorationLine: 'line-through',
    marginLeft: SPACE.xs + 2,
  },
  mrpTextSmall: {
    ...TYPE.micro,
  },
});
