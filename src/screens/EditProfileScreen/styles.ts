import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';
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
  HERO_TOP,
  HERO_LIFT,
} from '@/styles/homeTheme';

const FIELD_REST = '#F7F5F3';
const FIELD_FOCUS = SURFACE.base;
const FIELD_BORDER_WIDTH = 1.5;

export const ERROR_INK = ACCENT.discount;
const ERROR_SOFT = '#FDF1EC';

const VERIFIED_INK = ACCENT.successText;
const VERIFIED_SOFT = ACCENT.successSoft;

export const SAVE_RESTING_INK = '#9A5B38';

export const FIELD_REST_INK = INK.muted;
export const FIELD_FOCUS_INK = ACCENT.primary;
export const LOCKED_INK = INK.faint;
export const VERIFIED_TEXT = VERIFIED_INK;

export const FIELD_COLORS = {
  restFill: FIELD_REST,
  restBorder: FIELD_REST,
  focusFill: FIELD_FOCUS,
  focusBorder: ACCENT.primary,
};

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: HERO_TOP,
  },
  scrollContent: {
    paddingBottom: SPACE.xl,
    backgroundColor: CANVAS,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
    backgroundColor: HERO_TOP,
  },
  topBarBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  topBarTitle: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPE.heading,
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: -0.3,
  },

  hero: {
    paddingBottom: SPACE.md,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.base,
  },
  identityText: {
    flex: 1,
    marginLeft: SPACE.base,
  },
  userNameText: {
    ...TYPE.title,
    fontSize: Math.round(TYPE.title.fontSize * 1.12),
    lineHeight: Math.round(TYPE.title.lineHeight * 1.12),
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.4,
  },
  userNamePlaceholder: {
    color: INK.faint,
  },
  phoneNumberStyle: {
    ...TYPE.label,
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginTop: 2,
  },

  fieldGroup: {
    paddingHorizontal: GUTTER,
  },
  field: {
    marginBottom: SPACE.base,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.xs + 2,
  },
  fieldLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  fieldOptional: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
    marginLeft: SPACE.xs + 2,
    letterSpacing: 0.2,
  },
  fieldWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6.6%'),
    borderRadius: RADIUS.md,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: SPACE.md,
  },
  fieldWellError: {
    backgroundColor: ERROR_SOFT,
    borderColor: ERROR_INK,
  },
  fieldWellLocked: {
    backgroundColor: FIELD_REST,
    borderColor: 'transparent',
  },
  fieldIcon: {
    marginRight: SPACE.md,
  },
  fieldInput: {
    flex: 1,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.strong,
    paddingVertical: SPACE.md,
    includeFontPadding: false,
  },
  fieldInputLocked: {
    color: INK.muted,
  },
  fieldInputDate: {
    letterSpacing: 1.2,
  },
  fieldTrailing: {
    marginLeft: SPACE.sm,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACE.sm,
    paddingVertical: 3,
    paddingHorizontal: SPACE.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: VERIFIED_SOFT,
  },
  verifiedPillText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: VERIFIED_INK,
    marginLeft: 3,
  },
  fieldHint: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.faint,
    marginTop: SPACE.xs + 2,
  },
  fieldErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.xs + 2,
  },
  fieldErrorText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: ERROR_INK,
    marginLeft: SPACE.xs + 1,
    flexShrink: 1,
  },

  genderRow: {
    flexDirection: 'row',
    gap: wp('2.4%'),
  },
  genderChipPressable: {
    flex: 1,
  },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('5.6%'),
    paddingHorizontal: SPACE.sm,
    borderRadius: RADIUS.md,
    borderWidth: FIELD_BORDER_WIDTH,
    borderColor: FIELD_REST,
    backgroundColor: FIELD_REST,
  },
  genderChipActive: {
    backgroundColor: ACCENT.primarySoft,
    borderColor: ACCENT.primary,
  },
  genderChipText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },
  genderChipTextActive: {
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.discount,
    marginLeft: SPACE.xs + 1,
  },

  noteRow: {
    flexDirection: 'row',
    marginHorizontal: GUTTER,
    marginTop: SPACE.xs,
    padding: SPACE.md,
    borderRadius: RADIUS.sm,
    backgroundColor: SURFACE.sunken,
  },
  noteText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginLeft: SPACE.sm,
    flex: 1,
  },

  saveBar: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    backgroundColor: SURFACE.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  saveButton: {
    flexDirection: 'row',
    minHeight: hp('6.4%'),
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT.primary,
    ...HERO_LIFT,
    shadowColor: ACCENT.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: ACCENT.primarySoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    letterSpacing: 0.2,
  },
  saveButtonTextDisabled: {
    color: SAVE_RESTING_INK,
  },
  saveButtonIcon: {
    marginRight: SPACE.sm,
  },
});
