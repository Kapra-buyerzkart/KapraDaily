import { StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  hp,
  wp,
} from '@/styles/cartTheme';

export const INK = CART_COLORS.textSecondary;
export const RED = CART_COLORS.danger;
export const GRAY_300 = CART_COLORS.textFaint;
export const BG = CART_COLORS.background;
export const DIVIDER = CART_COLORS.border;

export const BAR_REST = CART_COLORS.background;
export const BAR_SOLID = CART_COLORS.card;

export const PRIVILEGE_INK = '#8A6410';
export const PRIVILEGE_SOFT = '#FDF3DC';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CART_COLORS.background,
  },
  scrollView: {
    backgroundColor: CART_COLORS.background,
  },
  scrollContent: {
    paddingBottom: hp('7%'),
  },
  heroBlock: {
    paddingTop: CART_SPACING.xs,
    gap: CART_SPACING.md,
  },

  sendContainer: {
    alignItems: 'center',
    paddingVertical: CART_SPACING.xxl,
    paddingHorizontal: CART_GUTTER,
  },
  sendContainerTextOne: {
    ...CART_TYPE.title,
    color: CART_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  sendContainerTextTwo: {
    ...CART_TYPE.label,
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    marginTop: CART_SPACING.xs,
  },
  sendContainerInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: hp('6.3%'),
    marginTop: CART_SPACING.xxl,
    paddingHorizontal: CART_SPACING.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.borderStrong,
    borderRadius: CART_RADIUS.pill,
  },
  sendTextInput: {
    flex: 1,
    ...CART_TYPE.body,
    color: CART_COLORS.textPrimary,
    paddingHorizontal: CART_SPACING.md,
  },
  sendButton: {
    height: hp('4.6%'),
    paddingHorizontal: CART_SPACING.xxl,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    ...CART_TYPE.labelStrong,
    color: CART_COLORS.onPrimary,
  },
  suggestSheetBackground: {
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.card,
  },
  suggestSheetHandle: {
    backgroundColor: CART_COLORS.borderStrong,
    width: wp('12%'),
  },
});
