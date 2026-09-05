import { StyleSheet } from 'react-native';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_GUTTER,
  UI_RADIUS,
  UI_SPACING,
  wp,
  hp,
} from '../../../theme/tokens';

export const ICON = {
  status: wp('6.4%'),
  bullet: wp('4%'),
  meta: wp('3.8%'),
  chip: wp('3.2%'),
  cta: wp('4%'),
  ghost: wp('4.2%'),
};

export const DISC = {
  status: wp('13%'),
  bullet: wp('8.4%'),
  meta: wp('9%'),
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: UI_COLORS.canvas,
  },

  safeTop: {
    backgroundColor: UI_COLORS.card,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: UI_COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: UI_COLORS.border,
  },
  topBarCopy: {
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs + 2,
    backgroundColor: UI_COLORS.well,
    borderRadius: UI_RADIUS.pill,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
  statusDot: {
    width: wp('1.8%'),
    height: wp('1.8%'),
    borderRadius: wp('0.9%'),
  },

  scrollContent: {
    paddingTop: hp('1.8%'),
    paddingBottom: hp('2.4%'),
  },
  section: {
    marginTop: hp('1.6%'),
  },
  card: {
    padding: UI_SPACING.lg,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
  },
  statusCopy: {
    flex: 1,
    gap: 3,
  },
  statusDisc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DISC.status / 2,
    borderWidth: 1,
  },
  errorStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: UI_SPACING.sm,
    marginTop: UI_SPACING.md,
    padding: UI_SPACING.md,
    borderRadius: UI_RADIUS.sm,
    backgroundColor: UI_COLORS.dangerTint,
  },
  errorStripCopy: {
    flex: 1,
  },
  rule: {
    marginTop: UI_SPACING.lg,
  },

  metaGroup: {
    marginTop: UI_SPACING.lg,
    gap: hp('1%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: UI_SPACING.md,
  },
  metaValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    flexShrink: 1,
  },
  metaValueText: {
    flexShrink: 1,
    textAlign: 'right',
  },
  copyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    backgroundColor: UI_COLORS.well,
    borderRadius: UI_RADIUS.pill,
    paddingHorizontal: UI_SPACING.sm + 2,
    paddingVertical: hp('0.45%'),
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: UI_SPACING.md,
    marginTop: UI_SPACING.md,
    paddingTop: UI_SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: UI_COLORS.borderStrong,
  },

  footerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    backgroundColor: UI_COLORS.well,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.1%'),
    borderBottomLeftRadius: UI_RADIUS.card,
    borderBottomRightRadius: UI_RADIUS.card,
  },
  footerStripCopy: {
    flex: 1,
  },

  bulletGroup: {
    marginTop: UI_SPACING.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: UI_SPACING.md,
    paddingVertical: UI_SPACING.md,
  },
  bulletCopy: {
    flex: 1,
    gap: 2,
  },
  bulletSeparator: {
    marginLeft: DISC.bullet + UI_SPACING.md,
  },

  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    padding: UI_SPACING.lg,
  },
  supportCopy: {
    flex: 1,
    gap: 2,
  },

  footerNote: {
    textAlign: 'center',
    marginTop: hp('1.8%'),
    paddingHorizontal: UI_GUTTER + UI_SPACING.lg,
  },

  actionBar: {
    backgroundColor: UI_COLORS.card,
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.md,
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
    ...UI_ELEVATION.bar,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.sm,
    backgroundColor: UI_COLORS.primary,
    borderRadius: UI_RADIUS.button,
    paddingVertical: hp('1.6%'),
  },
  ghostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.sm,
    paddingVertical: UI_SPACING.md,
    marginBottom: UI_SPACING.xs,
  },
});
