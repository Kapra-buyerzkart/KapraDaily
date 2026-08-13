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

export const AVATAR = wp('10.6%');
export const AVATAR_RADIUS = RADIUS.md - 2;

export const ICON = {
  avatar: wp('5%'),
  meta: wp('3.4%'),
  action: wp('4.2%'),
  chevron: wp('3.6%'),
  plus: wp('5%'),
  empty: wp('9%'),
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
  topBarTitle: {
    flex: 1,
    marginLeft: SPACE.md,
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    letterSpacing: -0.3,
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
    borderColor: ACCENT.primarySoft,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md + 1,
    ...CARD_LIFT,
  },
  ctaRowPressed: {
    backgroundColor: SURFACE.tint,
  },
  ctaIconWell: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR_RADIUS,
    backgroundColor: ACCENT.primarySoft,
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
    color: ACCENT.primary,
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

  card: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    backgroundColor: CANVAS,
    marginBottom: SPACE.md,
    overflow: 'hidden',
    ...CARD_LIFT,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: ACCENT.success,
  },
  cardPressed: {
    backgroundColor: SURFACE.sunken,
  },
  cardMain: {
    flexDirection: 'row',
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
  },
  cardCopy: {
    flex: 1,
    marginLeft: SPACE.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    flexShrink: 1,
    marginRight: SPACE.sm,
  },
  addressLine: {
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

  avatarWell: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR_RADIUS,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWellActive: {
    backgroundColor: ACCENT.successSoft,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.pill,
    paddingLeft: SPACE.xs + 1,
    paddingRight: SPACE.sm,
    paddingVertical: 3,
  },
  badgeText: {
    marginLeft: 2,
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.successText,
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
  chipText: {
    marginLeft: SPACE.xs + 1,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },

  actionBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  actionBarDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACE.md - 1,
  },
  actionPressed: {
    backgroundColor: SURFACE.sunken,
  },
  actionText: {
    marginLeft: SPACE.sm - 2,
    ...TYPE.label,
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
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR_RADIUS,
  },
  skeletonBlock: {
    borderRadius: RADIUS.xxs,
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
    backgroundColor: ACCENT.primarySoft,
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
});
