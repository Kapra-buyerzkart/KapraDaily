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
  HERO_TOP as THEME_HERO_TOP,
  HERO_GRADIENT as THEME_HERO_GRADIENT,
  HERO_LIFT,
} from '@/styles/homeTheme';

// Profile reads off the same tokens as Home, but it is not the same page. Home
// is a catalogue — a flat sheet is right there, because the merchandise supplies
// all the colour. This page has no merchandise on it, so a flat white sheet had
// nothing left to look at.
//
// The shape here is a warm hero carrying the identity, dissolving into a plain
// white sheet from the shortcuts down. Exactly one block is tinted, so the top
// of the page has a focal point and everything below it stays quiet.

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

// A shade larger than the shortcut wells below it: the wallet is the only block
// in the hero carrying a live number, so its coin outranks the four shortcuts.
const WALLET_COIN_WELL = wp('11.5%');

// The hero's wash, shared with Edit Profile and therefore defined in the theme.
// It starts at the very top edge of the screen — the sticky bar is painted
// HERO_TOP at rest and only turns white once you scroll, so the status bar, the
// bar and the gradient are one continuous surface instead of a white strip
// sitting on a peach one. The gradient resolves to the page colour at its own
// bottom edge, so the hero melts into the white sheet rather than ending on a
// line; nothing straddles that seam, so the gradient has to disguise it alone.
export const HERO_TOP = THEME_HERO_TOP;
export const HERO_GRADIENT = THEME_HERO_GRADIENT;

// Privilege is already drawn on the avatar as a crown, which says *that* the
// account is privileged but not *what* it is. The chip names it, in the badge's
// own gold rather than in the brand orange, so it reads as status and not as
// another tappable accent.
const GOLD_SOFT = '#FDF3DC';
const GOLD_INK = '#8A6410';
// The chip's own crown glyph is a vector, so it needs the bare colour string.
export const PRIVILEGE_INK = GOLD_INK;

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  // The viewport is painted the hero's colour and the content sheet is painted
  // white on top of it, so an iOS rubber-band pull at the top reveals more
  // hero rather than a white strip above it.
  scrollView: {
    backgroundColor: HERO_TOP,
  },
  scrollContent: {
    paddingBottom: hp('12%'),
    backgroundColor: CANVAS,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  // Opaque because it is a sticky child of the ScrollView — the identity block
  // and the sections pass underneath it.
  // The background is animated (HERO_TOP → white) rather than fixed, so at rest
  // the bar disappears into the hero and only becomes a bar once there is
  // something scrolling underneath it. HERO_TOP here is the at-rest fallback.
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
  hero: {
    paddingBottom: SPACE.sm,
  },
  // The bottom padding is the gap up to the wallet strip, not the gap down to
  // the white sheet — the hero closes on the strip now, so `lg` here left the
  // identity and the balance looking like two separate blocks.
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
  // Between `title` and `display`. The name is the one piece of type on this
  // page that is about the person rather than about the app, so it outranks
  // every section heading below it — but not by so much that a two-word name
  // starts truncating against the Edit chip.
  userNameText: {
    ...TYPE.title,
    fontSize: Math.round(TYPE.title.fontSize * 1.12),
    lineHeight: Math.round(TYPE.title.lineHeight * 1.12),
    color: HOME_INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.4,
  },
  phoneNumberStyle: {
    ...TYPE.label,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginTop: 2,
  },
  privilegeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACE.xs + 2,
    paddingVertical: 3,
    paddingHorizontal: SPACE.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: GOLD_SOFT,
  },
  privilegeChipText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: GOLD_INK,
    letterSpacing: 0.3,
    marginLeft: 3,
  },
  // White on the peach hero rather than the old peach-on-white: a tinted chip
  // on a tinted ground had almost no edge left, and this is the only control in
  // the hero that does anything.
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.md,
    ...HERO_LIFT,
  },
  editChipText: {
    ...TYPE.caption,
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: SPACE.xs + 1,
  },

  // ── UD Wallet ───────────────────────────────────────────────────────────
  // Sits inside the hero rather than on the white sheet below it. The balance
  // belongs to the person, not to the menu, so it stays in the block that is
  // about the person — and keeping it there leaves the page with exactly one
  // tinted region, which is the whole point of the hero.
  walletStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: GUTTER,
    marginBottom: SPACE.sm,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.base,
    ...HERO_LIFT,
  },
  walletCoinWell: {
    width: WALLET_COIN_WELL,
    height: WALLET_COIN_WELL,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletCoin: {},
  walletText: {
    flex: 1,
    marginLeft: SPACE.md,
    marginRight: SPACE.sm,
  },
  walletLabel: {
    ...TYPE.micro,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: 0.6,
  },
  walletBalanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  walletBalance: {
    ...TYPE.title,
    color: HOME_INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.4,
  },
  walletUnit: {
    ...TYPE.caption,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginLeft: SPACE.xs + 2,
  },
  walletWorth: {
    ...TYPE.caption,
    color: HOME_INK.faint,
    fontFamily: FONTS.gilroy.medium,
    marginLeft: SPACE.xs,
    flexShrink: 1,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,19,26,0.04)',
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
  // A rounded square in a warm neutral, not a grey circle. Sixteen grey pills
  // stacked down the page read as sixteen buttons; the softer square recedes
  // and lets the labels carry the list.
  listIconWrapper: {
    width: ROW_ICON,
    height: ROW_ICON,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F7F5F3',
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
  // Soft fill instead of the old red outline. An outlined button at the foot of
  // the page reads as the page's primary action, which log out is emphatically
  // not — the tint says "destructive" without asking to be pressed.
  logoutButton: {
    flexDirection: 'row',
    minHeight: hp('6.2%'),
    marginTop: SPACE.xl,
    marginHorizontal: GUTTER,
    borderRadius: RADIUS.md,
    backgroundColor: '#FDF1EC',
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
