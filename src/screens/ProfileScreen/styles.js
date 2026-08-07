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

const ROW_ICON = wp('8.6%');

const QUICK_ACTION_WELL = wp('13.5%');

const WALLET_COIN_WELL = wp('11.5%');
const WALLET_COIN = wp('10.2%');

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
    paddingBottom: hp('12%'),
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
    paddingBottom: SPACE.sm,
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
    marginRight: SPACE.sm,
  },
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
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
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
  walletCoin: {
    width: WALLET_COIN,
    height: WALLET_COIN,
    resizeMode: 'contain',
  },
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
    fontVariant: ['tabular-nums'],
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
    paddingTop: SPACE.xl,
  },
  versionText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: HOME_INK.faint,
    letterSpacing: 0.4,
  },
});
