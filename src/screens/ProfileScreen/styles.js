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

export const INK = HOME_INK.base;
export const RED = ACCENT.discount;
export const ORANGE = ACCENT.primary;
export const GRAY_300 = HOME_INK.faint;
export const BG = CANVAS;
export const DIVIDER = HAIRLINE;

const ROW_ICON = wp('7.4%');
const ROW_GAP = SPACE.md - 2;

const QUICK_ACTION_WELL = wp('12.2%');

const WALLET_COIN_WELL = wp('9.6%');
const WALLET_COIN = wp('8.6%');

const CARD_PAD = SPACE.md;
const CARD_EDGE = 'rgba(17,19,26,0.07)';

export const HERO_TOP = THEME_HERO_TOP;
export const HERO_GRADIENT = THEME_HERO_GRADIENT;

const GOLD_SOFT = '#FDF3DC';
const GOLD_INK = '#8A6410';
export const PRIVILEGE_INK = GOLD_INK;

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  scrollView: {
    backgroundColor: HERO_TOP,
  },
  scrollContent: {
    paddingBottom: hp('7%'),
    backgroundColor: CANVAS,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.xs + 2,
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

  hero: {
    paddingBottom: SPACE.xs,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.md,
  },
  identityText: {
    flex: 1,
    marginLeft: SPACE.md,
    marginRight: SPACE.xs,
  },
  userNameText: {
    ...TYPE.heading,
    color: HOME_INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.3,
  },
  phoneNumberStyle: {
    ...TYPE.caption,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginTop: 1,
  },
  privilegeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACE.xs,
    paddingVertical: 2,
    paddingHorizontal: SPACE.sm - 1,
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
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.xs + 1,
    paddingHorizontal: SPACE.sm + 2,
    backgroundColor: ACCENT.primarySoft,
  },
  editChipText: {
    ...TYPE.micro,
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: SPACE.xs - 1,
  },

  walletStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: GUTTER,
    marginBottom: SPACE.xs,
    paddingVertical: SPACE.sm + 2,
    paddingHorizontal: SPACE.md - 2,
    borderRadius: RADIUS.sm,
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
  walletCoin: {
    width: WALLET_COIN,
    height: WALLET_COIN,
    resizeMode: 'contain',
  },
  walletText: {
    flex: 1,
    marginLeft: SPACE.sm + 2,
    marginRight: SPACE.xs,
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
    ...TYPE.heading,
    color: HOME_INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  walletUnit: {
    ...TYPE.micro,
    color: HOME_INK.muted,
    fontFamily: FONTS.gilroy.medium,
    marginLeft: SPACE.xs,
  },
  walletWorth: {
    ...TYPE.micro,
    color: HOME_INK.faint,
    fontFamily: FONTS.gilroy.medium,
    marginLeft: SPACE.xs,
    flexShrink: 1,
  },

  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
    gap: wp('2%'),
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionWell: {
    width: QUICK_ACTION_WELL,
    height: QUICK_ACTION_WELL,
    borderRadius: RADIUS.sm,
    backgroundColor: CATEGORY_WELL,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,19,26,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  quickActionIcon: {
    width: QUICK_ACTION_WELL * 0.52,
    height: QUICK_ACTION_WELL * 0.52,
    resizeMode: 'contain',
  },
  quickActionText: {
    ...TYPE.micro,
    marginTop: SPACE.xs + 1,
    height: TYPE.micro.lineHeight * 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: HOME_INK.base,
    fontFamily: FONTS.gilroy.semiBold,
  },

  sectionsContainer: {
    paddingTop: SPACE.xs,
  },
  sectionGap: {
    height: SPACE.md,
  },
  sectionHeader: {
    paddingTop: 0,
    paddingBottom: SPACE.xs + 2,
  },
  sectionTitle: {
    ...TYPE.micro,
    lineHeight: TYPE.micro.lineHeight,
    fontFamily: FONTS.gilroy.semiBold,
    color: HOME_INK.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionCard: {
    marginHorizontal: GUTTER,
    borderRadius: RADIUS.sm,
    backgroundColor: SURFACE.base,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CARD_PAD,
    paddingVertical: SPACE.sm,
    minHeight: hp('5.2%'),
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
    borderRadius: RADIUS.xs,
    backgroundColor: '#F7F5F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemPressed: {
    backgroundColor: SURFACE.sunken,
  },
  listItemText: {
    ...TYPE.label,
    marginLeft: ROW_GAP,
    fontFamily: FONTS.gilroy.medium,
    color: HOME_INK.base,
    flexShrink: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
    marginLeft: CARD_PAD + ROW_ICON + ROW_GAP,
  },

  logoutButton: {
    flexDirection: 'row',
    minHeight: hp('5.4%'),
    marginTop: SPACE.base,
    marginHorizontal: GUTTER,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FDF1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.discount,
    marginLeft: SPACE.xs + 2,
  },

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

  footerBranding: {
    alignItems: 'center',
    paddingTop: SPACE.base,
  },
  versionText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: HOME_INK.faint,
    letterSpacing: 0.4,
  },
});
