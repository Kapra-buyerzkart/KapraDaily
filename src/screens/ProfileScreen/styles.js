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
  INK as HOME_INK,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  GUTTER,
  CATEGORY_WELL,
} from '@/styles/homeTheme';

// Profile is the same page as Home: one flat white sheet, sections separated by
// whitespace and type rather than by cards and drop shadows. Everything below
// reads off the home tokens so the two surfaces cannot drift apart again.

// menuItems.js needs bare colour strings for its vector glyphs, so the two the
// rows actually use are re-exported rather than re-declared.
export const INK = HOME_INK.base;
export const RED = ACCENT.discount;
export const ORANGE = ACCENT.primary;
export const GRAY_300 = HOME_INK.faint;
export const BG = CANVAS;
export const DIVIDER = HAIRLINE;

// The icon rail width — dividers are inset by it so the rule starts at the
// label, the way a list rule should, instead of cutting under the glyphs.
const ROW_ICON = wp('8.6%');

// Fixed rather than derived from the column, so the shortcut row keeps the same
// height on every screen width instead of growing into a second hero block.
const QUICK_ACTION_WELL = wp('13.5%');

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  scrollContent: {
    paddingBottom: hp('12%'),
  },

  // ── Header ──────────────────────────────────────────────────────────────
  // Opaque because it is a sticky child of the ScrollView — the identity block
  // and the sections pass underneath it.
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
    backgroundColor: CANVAS,
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
    tintColor: HOME_INK.strong,
  },
  // The slot both bar titles live in — the margin belongs here rather than on
  // the text, so the overlaid name starts on the same left edge as "Profile".
  topBarTitle: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  profileHeaderText: {
    ...TYPE.heading,
    color: HOME_INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: -0.3,
  },
  topBarName: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  // ── Identity ────────────────────────────────────────────────────────────
  // Left-aligned rather than the old centred portrait block: the avatar, the
  // name and the edit affordance all sit on the same gutter as every section
  // below, so the page has a single left edge from top to bottom.
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
    marginRight: SPACE.sm,
  },
  userNameText: {
    ...TYPE.title,
    color: HOME_INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.3,
  },
  phoneNumberStyle: {
    ...TYPE.label,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginTop: 2,
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.tint,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.md,
  },
  editChipText: {
    ...TYPE.caption,
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: SPACE.xs + 1,
  },

  // ── Quick actions ───────────────────────────────────────────────────────
  // Home's category well, but sized to the glyph rather than to the column.
  // These are shortcuts, not merchandise: a full-width square tile gave four
  // secondary links more of the page than the sections they lead to.
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.base,
    gap: wp('2.4%'),
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionWell: {
    width: QUICK_ACTION_WELL,
    height: QUICK_ACTION_WELL,
    borderRadius: RADIUS.md,
    backgroundColor: CATEGORY_WELL,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  quickActionIcon: {
    width: QUICK_ACTION_WELL * 0.5,
    height: QUICK_ACTION_WELL * 0.5,
    resizeMode: 'contain',
  },
  quickActionText: {
    ...TYPE.micro,
    marginTop: SPACE.xs + 2,
    height: TYPE.micro.lineHeight * 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: HOME_INK.base,
    fontFamily: FONTS.gilroy.semiBold,
  },

  // ── List sections ───────────────────────────────────────────────────────
  sectionsContainer: {
    paddingTop: SPACE.xs,
  },
  sectionGap: {
    height: SPACE.base,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingVertical: SPACE.md,
    minHeight: hp('6%'),
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACE.sm,
  },
  listIconWrapper: {
    width: ROW_ICON,
    height: ROW_ICON,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemPressed: {
    backgroundColor: SURFACE.sunken,
  },
  listItemText: {
    ...TYPE.body,
    marginLeft: SPACE.md,
    fontFamily: FONTS.gilroy.medium,
    color: HOME_INK.base,
    flexShrink: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
    marginLeft: GUTTER + ROW_ICON + SPACE.md,
    marginRight: GUTTER,
  },

  // ── Log out ─────────────────────────────────────────────────────────────
  logoutButton: {
    flexDirection: 'row',
    minHeight: hp('6.2%'),
    marginTop: SPACE.xl,
    marginHorizontal: GUTTER,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(194,65,12,0.32)',
    backgroundColor: CANVAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.discount,
    marginLeft: SPACE.sm,
  },

  // ── Suggest-a-product sheet ─────────────────────────────────────────────
  sendContainer: {
    alignItems: 'center',
    paddingVertical: SPACE.lg,
    paddingHorizontal: GUTTER,
  },
  sendContainerTextOne: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: HOME_INK.strong,
    letterSpacing: -0.3,
  },
  sendContainerTextTwo: {
    ...TYPE.label,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.regular,
    textAlign: 'center',
    marginTop: SPACE.xs,
  },
  sendContainerInnerView: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,19,26,0.12)',
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    height: hp('6.3%'),
    marginTop: SPACE.lg,
    paddingHorizontal: SPACE.xs,
    width: '100%',
  },
  sendTextInput: {
    flex: 1,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: HOME_INK.base,
    paddingHorizontal: SPACE.md,
  },
  sendButton: {
    backgroundColor: ACCENT.primary,
    paddingHorizontal: SPACE.lg,
    borderRadius: RADIUS.pill,
    height: hp('4.6%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    ...TYPE.label,
    color: HOME_INK.onDark,
    fontFamily: FONTS.gilroy.semiBold,
  },
  suggestSheetBackground: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: SURFACE.base,
  },
  suggestSheetHandle: {
    backgroundColor: 'rgba(17,19,26,0.18)',
    width: wp('12%'),
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footerBranding: {
    alignItems: 'center',
    paddingTop: SPACE.xl,
  },
  versionText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: HOME_INK.faint,
    letterSpacing: 0.4,
  },
});
