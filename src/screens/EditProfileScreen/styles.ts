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

// Edit Profile is pushed from Profile, so it is built as the same page with the
// identity block still at the top: same peach hero, same sticky bar that
// resolves to white, same left gutter running from the avatar down through
// every field. What changes underneath is that the white sheet carries a form
// instead of a menu.
//
// The form's own rule: a field is a filled well, not an outlined box. Six
// outlined rectangles stacked down a page read as six empty things waiting to
// be corrected; a filled well reads as a value that already exists — which is
// what almost every field on this screen actually is.

// The well's resting fill — the warm neutral Profile puts behind its list
// glyphs, so a field at rest and a menu row's icon are the same shade of quiet.
const FIELD_REST = '#F7F5F3';
// Focus inverts it: the well turns white and the page's orange draws the edge,
// so the field being typed into is the only lit surface on the sheet.
const FIELD_FOCUS = SURFACE.base;
const FIELD_BORDER_WIDTH = 1.5;

// Errors borrow the log-out button's palette rather than a pure red — this page
// is warm from top to bottom and a fire-engine red field would be the only cold
// thing on it.
export const ERROR_INK = ACCENT.discount;
const ERROR_SOFT = '#FDF1EC';

// Verified contact rows get the theme's green, at the weight a passive label
// deserves: it is stating a fact about the account, not offering an action.
const VERIFIED_INK = ACCENT.successText;
const VERIFIED_SOFT = ACCENT.successSoft;

// The resting Save button's label, on the brand's soft tint. Deep enough to
// clear 4.5:1 against that tint — a disabled control is exempt from the
// requirement, but this one is carrying the only copy that explains *why* it
// can't be pressed, so it has to be readable. It stays in the page's warm
// family rather than reusing ERROR_INK, which would make "nothing to save yet"
// look like something went wrong.
export const SAVE_RESTING_INK = '#9A5B38';

// Exported for the components that colour vector glyphs, which need bare
// strings rather than style objects.
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
  // The viewport is painted the hero's colour and the sheet white on top of it,
  // so an iOS rubber-band pull at the top reveals more hero, not a white strip.
  scrollView: {
    backgroundColor: HERO_TOP,
  },
  scrollContent: {
    paddingBottom: SPACE.xl,
    backgroundColor: CANVAS,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  // Sticky, so it needs an opaque background of its own. Painted HERO_TOP at
  // rest — the animated style takes it to white once the hero has scrolled past
  // — and a rule that only exists once there is content underneath it.
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

  // ── Hero ────────────────────────────────────────────────────────────────
  // Deliberately the same shape as Profile's identity row, in the same place on
  // the page, so the push from one screen to the other looks like the block
  // stayed put and the page rebuilt itself underneath it.
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
  // Mirrors Profile's `userNameText` exactly — this is the same name, one push
  // later, and it tracks the Full Name field as you type so an edit is visible
  // where the user already knows to look for their name.
  userNameText: {
    ...TYPE.title,
    fontSize: Math.round(TYPE.title.fontSize * 1.12),
    lineHeight: Math.round(TYPE.title.lineHeight * 1.12),
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.4,
  },
  // Drawn when the name field is empty, so the block never collapses to a bare
  // avatar mid-edit.
  userNamePlaceholder: {
    color: INK.faint,
  },
  phoneNumberStyle: {
    ...TYPE.label,
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginTop: 2,
  },

  // ── Form ────────────────────────────────────────────────────────────────
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
  // The border is always drawn, in the fill's own colour at rest, so focusing a
  // field changes two colours and never the layout.
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
  // Locked fields keep the resting fill but drop the border entirely — nothing
  // about them will ever change colour, so drawing an edge that can't light up
  // only makes them look like editable fields that are broken.
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
  // Wider than the type it holds, so a date typed one digit at a time doesn't
  // shuffle the caret around as the mask fills in.
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

  // ── Gender ──────────────────────────────────────────────────────────────
  // Three chips rather than three buttons. The old segmented row filled the
  // selected option with solid orange, which gave a demographic field the same
  // weight as the Save button at the foot of the page.
  genderRow: {
    flexDirection: 'row',
    gap: wp('2.4%'),
  },
  // The flex lives on the pressable, so the three chips split the row and the
  // animated surface inside each one just fills what it is given.
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

  // ── Contact note ────────────────────────────────────────────────────────
  // The two locked rows say *that* they can't be edited here; this says where
  // they can be. It sits under the pair rather than under each one, so the
  // sentence is written once.
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

  // ── Save bar ────────────────────────────────────────────────────────────
  // Pinned rather than scrolled to. On a form this short the button was already
  // near the fold, but a save that can leave the screen is a save that gets
  // forgotten — and pinned, it can also carry the dirty state, which is the one
  // thing the user can't otherwise see.
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
  // Nothing to save yet, so the button holds its shape and drops its voice
  // rather than greying out: a disabled control that still looks like the
  // brand's colour reads as "not yet", where grey reads as "broken".
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
