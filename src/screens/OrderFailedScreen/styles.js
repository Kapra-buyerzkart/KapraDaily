import { StyleSheet } from 'react-native';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '@/styles/cartTheme';

export const ICON = {
  status: wp('6.4%'),
  reason: wp('4%'),
  meta: wp('3.8%'),
  chip: wp('3.2%'),
  cta: wp('4%'),
  ghost: wp('4.2%'),
};

export const DISC = {
  status: wp('13%'),
  reason: wp('8.4%'),
  meta: wp('9%'),
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CART_COLORS.canvas,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: CART_COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CART_COLORS.border,
  },
  topBarCopy: {
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs + 2,
    backgroundColor: CART_COLORS.well,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
  statusDot: {
    width: wp('1.8%'),
    height: wp('1.8%'),
    borderRadius: wp('0.9%'),
    backgroundColor: CART_COLORS.danger,
  },

  scrollContent: {
    paddingTop: hp('1.8%'),
    paddingBottom: hp('2.4%'),
  },
  section: {
    marginTop: hp('1.6%'),
  },
  card: {
    padding: CART_SPACING.lg,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  statusCopy: {
    flex: 1,
    gap: 3,
  },
  failureDisc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  failureRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DISC.status / 2,
    borderWidth: 1,
    borderColor: 'rgba(217,48,37,0.18)',
  },
  errorStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: CART_SPACING.sm,
    marginTop: CART_SPACING.md,
    padding: CART_SPACING.md,
    borderRadius: CART_RADIUS.sm,
    backgroundColor: CART_COLORS.dangerTint,
  },
  errorStripCopy: {
    flex: 1,
  },
  rule: {
    marginTop: CART_SPACING.lg,
  },

  metaGroup: {
    marginTop: CART_SPACING.lg,
    gap: hp('1%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CART_SPACING.md,
  },
  metaValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  copyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    backgroundColor: CART_COLORS.well,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.sm + 2,
    paddingVertical: hp('0.45%'),
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CART_SPACING.md,
    marginTop: CART_SPACING.md,
    paddingTop: CART_SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CART_COLORS.borderStrong,
  },

  footerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.well,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.1%'),
    borderBottomLeftRadius: CART_RADIUS.card,
    borderBottomRightRadius: CART_RADIUS.card,
  },
  footerStripCopy: {
    flex: 1,
  },

  reasonGroup: {
    marginTop: CART_SPACING.md,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: CART_SPACING.md,
    paddingVertical: CART_SPACING.md,
  },
  reasonCopy: {
    flex: 1,
    gap: 2,
  },
  reasonSeparator: {
    marginLeft: DISC.reason + CART_SPACING.md,
  },

  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    padding: CART_SPACING.lg,
  },
  supportCopy: {
    flex: 1,
    gap: 2,
  },

  footerNote: {
    textAlign: 'center',
    marginTop: hp('1.8%'),
    paddingHorizontal: CART_GUTTER + CART_SPACING.lg,
  },

  actionBar: {
    backgroundColor: CART_COLORS.card,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.md,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
    ...CART_ELEVATION.bar,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.primary,
    borderRadius: CART_RADIUS.button,
    paddingVertical: hp('1.6%'),
  },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    paddingVertical: CART_SPACING.md,
    marginBottom: CART_SPACING.xs,
  },
});
