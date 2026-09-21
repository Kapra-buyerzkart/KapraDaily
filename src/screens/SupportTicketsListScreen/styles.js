import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { LUXURY_COLORS, LUXURY_FONTS } from './supportLuxuryTheme';

export const CARD_EDGE = LUXURY_COLORS.border;
export const CARD_EDGE_STRONG = LUXURY_COLORS.borderStrong;

export const WELL = wp('11%');
export const WELL_RADIUS = 12;

export const ICON = {
  well: wp('5.2%'),
  meta: wp('3.6%'),
  chevron: wp('3.6%'),
  plus: wp('4.4%'),
  empty: wp('9%'),
};

export const CARD_LIFT = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  android: {
    elevation: 1.5,
  },
});

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.canvas,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4.5%'),
    paddingBottom: hp('1.6%'),
    backgroundColor: LUXURY_COLORS.canvas,
  },
  topBarBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: LUXURY_COLORS.border,
  },
  backBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: LUXURY_COLORS.card,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: LUXURY_COLORS.emerald,
  },
  topBarCopy: {
    flex: 1,
    marginLeft: wp('3.5%'),
    justifyContent: 'center',
  },
  topBarTitle: {
    fontFamily: LUXURY_FONTS.heading,
    fontSize: wp('5.6%'),
    color: LUXURY_COLORS.emerald,
    letterSpacing: -0.2,
  },
  topBarSubtitle: {
    marginTop: 1,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.textMuted,
  },
  topBarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LUXURY_COLORS.emerald,
    borderRadius: 999,
    paddingLeft: wp('3%'),
    paddingRight: wp('3.8%'),
    paddingVertical: hp('0.9%'),
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_COLORS.emerald,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  topBarActionPressed: {
    opacity: 0.85,
  },
  topBarActionText: {
    marginLeft: 4,
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3.2%'),
    color: LUXURY_COLORS.white,
  },

  listContent: {
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('6%'),
  },

  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LUXURY_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    ...CARD_LIFT,
  },
  ctaRowPressed: {
    backgroundColor: LUXURY_COLORS.well,
  },
  ctaIconWell: {
    width: WELL,
    height: WELL,
    borderRadius: WELL_RADIUS,
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCopy: {
    flex: 1,
    marginHorizontal: wp('3.5%'),
  },
  ctaTitle: {
    fontFamily: LUXURY_FONTS.heading,
    fontSize: wp('4.6%'),
    color: LUXURY_COLORS.emerald,
  },
  ctaSubtitle: {
    marginTop: 2,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.textMuted,
    lineHeight: wp('4%'),
  },

  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2.6%'),
    marginBottom: hp('1.6%'),
  },
  sectionLabelText: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.emerald,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionLabelRule: {
    flex: 1,
    marginLeft: wp('3%'),
    height: StyleSheet.hairlineWidth,
    backgroundColor: LUXURY_COLORS.border,
  },
  sectionLabelCount: {
    marginLeft: wp('2%'),
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.gold,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.card,
    marginBottom: hp('1.6%'),
    overflow: 'hidden',
    ...CARD_LIFT,
  },
  cardPressed: {
    backgroundColor: LUXURY_COLORS.well,
  },
  cardMain: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.8%'),
    paddingBottom: hp('1.6%'),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    marginTop: hp('1.2%'),
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('4%'),
    color: LUXURY_COLORS.textPrimary,
    lineHeight: wp('5.2%'),
  },
  cardMessage: {
    marginTop: hp('0.6%'),
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3.2%'),
    color: LUXURY_COLORS.textSecondary,
    lineHeight: wp('4.4%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: hp('1.2%'),
  },

  idTag: {
    backgroundColor: LUXURY_COLORS.goldTint,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    paddingHorizontal: wp('2.2%'),
    paddingVertical: 2,
  },
  idTagText: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.gold,
    letterSpacing: 0.3,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
    letterSpacing: 0.2,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: 3,
    marginRight: wp('2%'),
    marginTop: hp('0.4%'),
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    marginLeft: 5,
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.borderLight,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
  },
  cardFooterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooterMetaText: {
    marginLeft: 5,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.textMuted,
  },
  cardFooterAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooterActionText: {
    marginRight: 3,
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.emerald,
  },

  skeletonCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.card,
    padding: wp('4%'),
    marginBottom: hp('1.6%'),
  },
  skeletonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.6%'),
  },
  skeletonBlock: {
    borderRadius: 4,
    backgroundColor: LUXURY_COLORS.well,
  },
  skeletonPill: {
    borderRadius: 999,
    backgroundColor: LUXURY_COLORS.well,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: hp('6%'),
    paddingHorizontal: wp('6%'),
  },
  emptyIconWell: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_COLORS.gold,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyTitle: {
    marginTop: hp('2.5%'),
    fontFamily: LUXURY_FONTS.heading,
    fontSize: wp('6%'),
    color: LUXURY_COLORS.emerald,
    textAlign: 'center',
  },
  emptyBody: {
    marginTop: hp('1%'),
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3.4%'),
    color: LUXURY_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: wp('5%'),
  },
  emptyButton: {
    marginTop: hp('3.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LUXURY_COLORS.emerald,
    borderRadius: 12,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.6%'),
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_COLORS.emerald,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emptyButtonPressed: {
    opacity: 0.9,
  },
  emptyButtonText: {
    marginLeft: 6,
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3.6%'),
    color: LUXURY_COLORS.white,
  },
});
