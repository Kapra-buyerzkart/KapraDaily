import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  LUXURY_COLORS,
  LUXURY_FONTS,
} from '../SupportTicketsListScreen/supportLuxuryTheme';

export const CARD_EDGE = LUXURY_COLORS.border;
export const CARD_EDGE_STRONG = LUXURY_COLORS.borderStrong;

export const FIELD_REST_BG = LUXURY_COLORS.well;
export const FIELD_REST_EDGE = LUXURY_COLORS.border;
export const FIELD_FOCUS_EDGE = LUXURY_COLORS.emerald;
export const FIELD_BORDER_WIDTH = 1.2;

export const WELL = wp('11%');
export const WELL_RADIUS = 12;

export const ICON = {
  field: wp('4.6%'),
  well: wp('5%'),
  chip: wp('4.2%'),
  meta: wp('3.6%'),
  action: wp('4.6%'),
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('4%'),
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
  topBarTitle: {
    flex: 1,
    marginLeft: wp('3.5%'),
    fontFamily: LUXURY_FONTS.heading,
    fontSize: wp('5.6%'),
    color: LUXURY_COLORS.emerald,
    letterSpacing: -0.2,
  },

  intro: {
    backgroundColor: LUXURY_COLORS.canvas,
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1.8%'),
  },
  introTitle: {
    fontFamily: LUXURY_FONTS.heading,
    fontSize: wp('6%'),
    color: LUXURY_COLORS.emerald,
    letterSpacing: -0.3,
  },
  introSubtitle: {
    marginTop: hp('0.5%'),
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3.3%'),
    color: LUXURY_COLORS.textMuted,
    lineHeight: wp('4.8%'),
  },

  formCard: {
    marginHorizontal: wp('4.5%'),
    marginTop: hp('0.8%'),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.card,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
    ...CARD_LIFT,
  },

  field: {
    marginBottom: hp('2%'),
  },
  fieldLabel: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.emerald,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: hp('0.8%'),
  },
  fieldWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    borderRadius: 12,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: wp('3.5%'),
    backgroundColor: LUXURY_COLORS.well,
    borderColor: LUXURY_COLORS.border,
  },
  fieldWellMultiline: {
    alignItems: 'flex-start',
    minHeight: hp('14%'),
    paddingVertical: hp('1.2%'),
  },
  fieldIcon: {
    marginRight: wp('3%'),
  },
  fieldIconMultiline: {
    marginTop: hp('0.4%'),
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3.5%'),
    color: LUXURY_COLORS.textPrimary,
  },
  fieldInputMultiline: {
    textAlignVertical: 'top',
    minHeight: hp('11%'),
  },
  fieldFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('0.6%'),
    paddingHorizontal: 2,
  },
  fieldHelper: {
    flex: 1,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
  },
  fieldCounter: {
    marginLeft: wp('2%'),
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textFaint,
  },

  linkedOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.well,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.2%'),
  },
  linkedOrderWell: {
    width: WELL,
    height: WELL,
    borderRadius: WELL_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    marginRight: wp('3%'),
  },
  linkedOrderCopy: {
    flex: 1,
  },
  linkedOrderCaption: {
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
  },
  linkedOrderValue: {
    marginTop: 1,
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3.4%'),
    color: LUXURY_COLORS.emerald,
  },

  priorityRow: {
    flexDirection: 'row',
    marginHorizontal: -wp('1%'),
  },
  priorityChipHit: {
    flex: 1,
    paddingHorizontal: wp('1%'),
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('5%'),
    borderRadius: 10,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: wp('2%'),
    backgroundColor: LUXURY_COLORS.well,
    borderColor: LUXURY_COLORS.border,
  },
  priorityChipText: {
    marginLeft: 4,
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.textSecondary,
  },
  priorityChipTextActive: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
  },
  priorityHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    paddingHorizontal: 2,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: wp('2%'),
  },
  priorityHintText: {
    flex: 1,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
    lineHeight: wp('3.8%'),
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: wp('4.5%'),
    marginTop: hp('2%'),
    borderRadius: 14,
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('1.4%'),
  },
  noteIcon: {
    marginRight: wp('2.5%'),
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.textSecondary,
    lineHeight: wp('4.4%'),
  },

  actionBar: {
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('1.6%'),
    paddingBottom: hp('3%'),
    backgroundColor: LUXURY_COLORS.canvas,
    borderTopWidth: 1,
    borderTopColor: LUXURY_COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('6%'),
    borderRadius: 12,
    backgroundColor: LUXURY_COLORS.emerald,
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
  actionButtonResting: {
    backgroundColor: LUXURY_COLORS.well,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonIcon: {
    marginRight: wp('2%'),
  },
  actionButtonText: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3.6%'),
    color: LUXURY_COLORS.white,
    letterSpacing: 0.2,
  },
  actionButtonTextResting: {
    color: LUXURY_COLORS.textFaint,
  },
});
