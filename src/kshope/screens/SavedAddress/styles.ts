import { StyleSheet } from 'react-native';
import { Fonts } from '../../theme/fonts';
import { UI_TYPE, hp, wp } from '../../theme/tokens';

const HAIRLINE = StyleSheet.hairlineWidth;

export const SURFACE_BASE = '#FFFFFF';
export const SURFACE_SUNKEN = '#F5F6F8';
export const SURFACE_TINT = '#FFF6F2';
export const RULE = 'rgba(17,19,26,0.05)';
export const EDGE = 'rgba(17,19,26,0.12)';

export const INK_STRONG = '#12131A';
export const INK_BASE = '#2B2D36';
export const INK_MUTED = '#6B7280';

export const PRIMARY = '#F25000';
export const PRIMARY_SOFT = '#FFE9E0';
export const SUCCESS = '#0E9F4F';
export const SUCCESS_SOFT = '#E7F7EE';
export const SUCCESS_TEXT = '#0B7A3D';
export const DISCOUNT = '#C2410C';

export const GUTTER = wp('4.6%');

export const SPACE = { xs: 4, sm: 8, md: 12, base: 16 };
export const RADIUS = { md: 16, lg: 20, pill: 999 };

export const ICON = {
  type: wp('4.4%'),
  meta: wp('3.6%'),
  action: wp('4.4%'),
  plus: wp('4.6%'),
  chevron: wp('4%'),
  empty: wp('8%'),
  check: wp('3.2%'),
};

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SURFACE_BASE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: HAIRLINE,
    borderBottomColor: RULE,
  },
  headerText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: wp('4.65%'),
    color: INK_STRONG,
    marginLeft: wp('3%'),
    letterSpacing: -0.3,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.base,
    paddingBottom: hp('6%'),
  },
  listContentWithBar: {
    paddingBottom: hp('16%'),
  },

  confirmBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
    backgroundColor: SURFACE_BASE,
    borderTopWidth: HAIRLINE,
    borderTopColor: RULE,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    borderRadius: RADIUS.md,
    paddingVertical: hp('1.8%'),
  },
  confirmButtonText: {
    marginLeft: SPACE.sm,
    ...UI_TYPE.heading,
    color: SURFACE_BASE,
  },
  confirmHint: {
    marginBottom: SPACE.sm,
    ...UI_TYPE.caption,
    fontFamily: Fonts.gilroyMedium,
    color: INK_MUTED,
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_TINT,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
    marginBottom: SPACE.base,
  },
  addIconWell: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: RADIUS.pill,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRowText: {
    flex: 1,
    marginLeft: SPACE.md,
    ...UI_TYPE.bodyStrong,
    color: PRIMARY,
  },

  card: {
    borderRadius: RADIUS.lg,
    borderWidth: HAIRLINE,
    borderColor: EDGE,
    backgroundColor: SURFACE_BASE,
    marginBottom: SPACE.md,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: SUCCESS,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    minHeight: hp('5.6%'),
  },
  typeCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: SPACE.sm,
  },
  typeWell: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE_SUNKEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeWellActive: {
    backgroundColor: SUCCESS_SOFT,
  },
  typeText: {
    marginLeft: SPACE.sm,
    ...UI_TYPE.bodyStrong,
    color: INK_STRONG,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SUCCESS_SOFT,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 3,
  },
  selectedPillText: {
    marginLeft: 3,
    ...UI_TYPE.microStrong,
    color: SUCCESS_TEXT,
  },
  menuButton: {
    paddingLeft: SPACE.sm,
    paddingVertical: SPACE.xs,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_SUNKEN,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.xs,
  },
  actionButton: {
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.xs,
  },
  actionSeparator: {
    width: HAIRLINE,
    alignSelf: 'stretch',
    marginVertical: SPACE.xs,
    backgroundColor: EDGE,
  },

  cardDivider: {
    height: HAIRLINE,
    backgroundColor: RULE,
  },
  cardBody: {
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.md,
  },
  addressLine: {
    ...UI_TYPE.label,
    fontFamily: Fonts.gilroyRegular,
    color: INK_BASE,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.md,
  },
  metaCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  metaText: {
    marginLeft: SPACE.xs,
    ...UI_TYPE.caption,
    fontFamily: Fonts.gilroyMedium,
    color: INK_MUTED,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: hp('6%'),
    paddingHorizontal: wp('8%'),
  },
  emptyIconWell: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE_SUNKEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: SPACE.base,
    ...UI_TYPE.heading,
    color: INK_STRONG,
  },
  emptyBody: {
    marginTop: SPACE.xs,
    ...UI_TYPE.label,
    fontFamily: Fonts.gilroyRegular,
    color: INK_MUTED,
    textAlign: 'center',
  },
});
