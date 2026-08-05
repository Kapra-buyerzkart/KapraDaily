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

// The field's geometry, the rule inside it and the clear disc all moved to
// homeTheme's SEARCH_FIELD / FIELD_RULE / CLEAR_DISC. Home's bar is the same
// control as this input — it is what the user pressed to get here — and the two
// had drifted apart on radius, glyph colour and trailing detail, so the push
// read as a swap. One definition, both screens.
const FIELD_HEIGHT = SEARCH_FIELD.height;

// The product grid pads itself by wp('2%') (the cards carry the rest of the
// gutter as internal whitespace). Anything in the list that is *not* a card —
// the recent-search block — has to make that up to land on the page gutter.
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

  // ── Header ──────────────────────────────────────────────────────────────
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
  // Drawn on the block's bottom edge and faded in by scroll position, so the
  // page has no rule under the title while it is at rest.
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
  // The margin belongs to the slot, not the text, so the title's left edge is
  // fixed regardless of how long it is.
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
  // A disc on the sunken surface rather than a bare glyph: it is the only
  // control on the row besides the back arrow, and at 40pt it clears the touch
  // minimum without a hitSlop doing the work invisibly.
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

  // ── Field ───────────────────────────────────────────────────────────────
  // Sunken, not white-on-white with a grey outline. On the banner Home can
  // float a white bar; on this flat white sheet the same treatment needs a
  // border to exist at all, and a 0.3pt #8f8f8f box is what that was.
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
    // Regular, not Light: at this size Gilroy Light reads far thinner than its
    // contrast ratio suggests — the same call StickyHeader's placeholder makes.
    fontFamily: FONTS.gilroy.regular,
    color: INK.strong,
    // Android gives a TextInput its own vertical padding, which pushes the text
    // off the centre of a fixed-height row. No lineHeight here for the same
    // reason — on Android it re-centres the text inside the line box.
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

  // ── Result count ────────────────────────────────────────────────────────
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

  // ── Recent searches ─────────────────────────────────────────────────────
  recentTitle: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    marginLeft: RECENT_GUTTER,
    marginTop: SPACE.base,
  },
  // Chips hug their term instead of being poured into a fixed 20%-wide box —
  // that box is what forced every term down to seven characters.
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

  // ── List states ─────────────────────────────────────────────────────────
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
