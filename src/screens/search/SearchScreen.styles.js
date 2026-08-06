import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  CANVAS,
  CLEAR_DISC,
  FIELD_RULE,
  GUTTER,
  HAIRLINE,
  INK,
  RADIUS,
  SEARCH_FIELD,
  SPACE,
  SURFACE,
  TYPE,
} from '@/styles/homeTheme';

const FIELD_HEIGHT = SEARCH_FIELD.height;

const LIST_INSET = wp('2%');
const RECENT_GUTTER = GUTTER - LIST_INSET;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('3%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  header: {
    backgroundColor: CANVAS,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
  },
  headerRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  headerTitleSlot: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    letterSpacing: -0.3,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: wp('4.4%'),
    height: wp('4.4%'),
    resizeMode: 'contain',
    tintColor: INK.strong,
  },

  searchField: {
    marginTop: SPACE.base,
    marginHorizontal: GUTTER,
    height: FIELD_HEIGHT,
    borderRadius: SEARCH_FIELD.radius,
    backgroundColor: SURFACE.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACE.md,
    fontSize: TYPE.body.fontSize,
    fontFamily: FONTS.gilroy.regular,
    color: INK.strong,
    padding: 0,
    textAlignVertical: 'center',
    top: Platform.OS === 'ios' ? 1 : 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.pill,
    backgroundColor: CLEAR_DISC,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACE.sm,
  },
  fieldRule: {
    width: 1,
    height: 20,
    backgroundColor: FIELD_RULE,
    marginLeft: SPACE.md,
  },
  clipboardIcon: {
    marginLeft: SPACE.md,
  },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    gap: SPACE.sm,
  },
  resultText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },
  fallbackNoticeText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: ACCENT.primary,
    flexShrink: 1,
    textAlign: 'right',
  },

  recentTitle: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    marginLeft: RECENT_GUTTER,
    marginTop: SPACE.base,
  },
  recentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: RECENT_GUTTER,
    marginTop: SPACE.md,
    gap: SPACE.sm,
  },
  recentProduct: {
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
  },
  recentProductText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },

  productWrapper: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('10%'),
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('15%'),
  },
  emptyImage: {
    width: wp('50%'),
    height: wp('50%'),
    resizeMode: 'contain',
  },
  noResultsText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    textAlign: 'center',
    marginTop: SPACE.lg,
    paddingHorizontal: wp('10%'),
  },
});

export default styles;
