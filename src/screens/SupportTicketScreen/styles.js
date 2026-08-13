import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  GUTTER,
} from '@/styles/homeTheme';

export const CARD_EDGE = 'rgba(17,19,26,0.07)';
export const CARD_EDGE_STRONG = 'rgba(17,19,26,0.12)';

export const FIELD_REST_BG = SURFACE.sunken;
export const FIELD_REST_EDGE = 'rgba(17,19,26,0.10)';
export const FIELD_FOCUS_EDGE = 'rgba(17,19,26,0.34)';
export const FIELD_BORDER_WIDTH = 1.2;

export const WELL = wp('10.6%');
export const WELL_RADIUS = RADIUS.md - 2;

export const ICON = {
  field: wp('4.4%'),
  well: wp('4.8%'),
  chip: wp('4%'),
  meta: wp('3.6%'),
  action: wp('4.4%'),
};

export const CARD_LIFT = {
  shadowColor: '#0B1020',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SURFACE.sunken,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACE.xl,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.md,
    backgroundColor: CANVAS,
  },
  topBarBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_EDGE_STRONG,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  topBarTitle: {
    flex: 1,
    marginLeft: SPACE.md,
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    letterSpacing: -0.3,
  },

  intro: {
    backgroundColor: CANVAS,
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.lg,
  },
  introTitle: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.4,
  },
  introSubtitle: {
    marginTop: SPACE.xs + 2,
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    maxWidth: wp('84%'),
  },

  formCard: {
    marginHorizontal: GUTTER,
    marginTop: SPACE.base,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    backgroundColor: CANVAS,
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.base,
    paddingBottom: SPACE.xs,
    ...CARD_LIFT,
  },

  field: {
    marginBottom: SPACE.base,
  },
  fieldLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: SPACE.xs + 2,
  },
  fieldWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6.4%'),
    borderRadius: RADIUS.md,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: SPACE.md,
  },
  fieldWellMultiline: {
    alignItems: 'flex-start',
    minHeight: hp('16%'),
    paddingVertical: SPACE.md,
  },
  fieldIcon: {
    marginRight: SPACE.md,
  },
  fieldIconMultiline: {
    marginTop: hp('0.3%'),
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 0,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.strong,
  },
  fieldInputMultiline: {
    textAlignVertical: 'top',
    minHeight: hp('12%'),
  },
  fieldFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.xs + 2,
    paddingHorizontal: SPACE.xs,
  },
  fieldHelper: {
    flex: 1,
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },
  fieldCounter: {
    marginLeft: SPACE.sm,
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
  },

  linkedOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    backgroundColor: SURFACE.sunken,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
  },
  linkedOrderWell: {
    width: WELL,
    height: WELL,
    borderRadius: WELL_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CANVAS,
    marginRight: SPACE.md,
  },
  linkedOrderCopy: {
    flex: 1,
  },
  linkedOrderCaption: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },
  linkedOrderValue: {
    marginTop: 1,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },

  priorityRow: {
    flexDirection: 'row',
    marginHorizontal: -SPACE.xs,
  },
  priorityChipHit: {
    flex: 1,
    paddingHorizontal: SPACE.xs,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('5.2%'),
    borderRadius: RADIUS.sm,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: SPACE.sm,
  },
  priorityChipText: {
    marginLeft: SPACE.xs + 2,
    ...TYPE.label,
    fontFamily: FONTS.gilroy.medium,
  },
  priorityChipTextActive: {
    fontFamily: FONTS.gilroy.semiBold,
  },
  priorityHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.xs,
  },
  priorityDot: {
    width: wp('1.6%'),
    height: wp('1.6%'),
    borderRadius: RADIUS.pill,
    marginRight: SPACE.sm,
  },
  priorityHintText: {
    flex: 1,
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: GUTTER,
    marginTop: SPACE.md,
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
  },
  noteIcon: {
    marginRight: SPACE.sm,
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },

  actionBar: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    backgroundColor: CANVAS,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('6.4%'),
    borderRadius: RADIUS.sm,
    backgroundColor: ACCENT.primary,
  },
  actionButtonResting: {
    backgroundColor: SURFACE.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE_STRONG,
  },
  actionButtonIcon: {
    marginRight: SPACE.sm,
  },
  actionButtonText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.onDark,
    letterSpacing: 0.2,
  },
  actionButtonTextResting: {
    color: INK.muted,
  },
});
