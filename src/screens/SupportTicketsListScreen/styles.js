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

export const WELL = wp('10.6%');
export const WELL_RADIUS = RADIUS.md - 2;

export const ICON = {
  well: wp('5%'),
  meta: wp('3.3%'),
  chevron: wp('3.4%'),
  plus: wp('4.6%'),
  empty: wp('8.6%'),
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
  topBarCopy: {
    flex: 1,
    marginLeft: SPACE.md,
  },
  topBarTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    letterSpacing: -0.3,
  },
  topBarSubtitle: {
    marginTop: 1,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },
  topBarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingLeft: SPACE.sm + 1,
    paddingRight: SPACE.md,
    paddingVertical: SPACE.xs + 2,
  },
  topBarActionPressed: {
    backgroundColor: SURFACE.tint,
  },
  topBarActionText: {
    marginLeft: SPACE.xs,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
  },

  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.base,
    paddingBottom: hp('6%'),
  },

  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CANVAS,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md + 1,
    ...CARD_LIFT,
  },
  ctaRowPressed: {
    backgroundColor: SURFACE.sunken,
  },
  ctaIconWell: {
    width: WELL,
    height: WELL,
    borderRadius: WELL_RADIUS,
    backgroundColor: SURFACE.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCopy: {
    flex: 1,
    marginHorizontal: SPACE.md,
  },
  ctaTitle: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  ctaSubtitle: {
    marginTop: 2,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },

  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.lg,
    marginBottom: SPACE.md,
  },
  sectionLabelText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionLabelRule: {
    flex: 1,
    marginLeft: SPACE.md,
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_EDGE_STRONG,
  },
  sectionLabelCount: {
    marginLeft: SPACE.sm,
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.faint,
  },

  card: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    backgroundColor: CANVAS,
    marginBottom: SPACE.md,
    overflow: 'hidden',
    ...CARD_LIFT,
  },
  cardPressed: {
    backgroundColor: SURFACE.sunken,
  },
  cardMain: {
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    marginTop: SPACE.sm + 2,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  cardMessage: {
    marginTop: SPACE.xs + 1,
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: SPACE.sm + 2,
  },

  idTag: {
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 3,
  },
  idTagText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.3,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.sm + 2,
    paddingVertical: 4,
  },
  statusDot: {
    width: wp('1.6%'),
    height: wp('1.6%'),
    borderRadius: wp('0.8%'),
    marginRight: SPACE.xs + 1,
  },
  statusText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: 0.2,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.xs + 1,
    marginRight: SPACE.sm,
    marginTop: SPACE.xs,
  },
  chipDot: {
    width: wp('1.6%'),
    height: wp('1.6%'),
    borderRadius: wp('0.8%'),
  },
  chipText: {
    marginLeft: SPACE.xs + 1,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md - 2,
  },
  cardFooterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooterMetaText: {
    marginLeft: SPACE.xs + 1,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },
  cardFooterAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooterActionText: {
    marginRight: SPACE.xs,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
  },

  skeletonCard: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    backgroundColor: CANVAS,
    padding: SPACE.md,
    marginBottom: SPACE.md,
  },
  skeletonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACE.md,
  },
  skeletonBlock: {
    borderRadius: RADIUS.xxs,
  },
  skeletonPill: {
    borderRadius: RADIUS.pill,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: hp('5%'),
    paddingHorizontal: wp('6%'),
  },
  emptyIconWell: {
    width: wp('19%'),
    height: wp('19%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: SPACE.base,
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  emptyBody: {
    marginTop: SPACE.xs + 2,
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: SPACE.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.md - 1,
  },
  emptyButtonPressed: {
    opacity: 0.9,
  },
  emptyButtonText: {
    marginLeft: SPACE.sm - 2,
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.onDark,
  },
});
