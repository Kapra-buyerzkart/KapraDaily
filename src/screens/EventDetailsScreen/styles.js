import { StyleSheet } from 'react-native';
import COLORS from '@/styles/colors';

const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.10)';
const ICON_TILE_BG = 'rgba(110,52,192,0.25)';
const BG_ASPECT_RATIO = 430 / 2078;

const CLAIM_BTN_ASPECT_RATIO = 424 / 105;
const CLAIM_BTN_PILL_TOP = 2 / 105;
const CLAIM_BTN_PILL_BOTTOM = 54 / 105;
const CLAIM_BTN_PILL_LEFT = 14 / 424;
const CLAIM_BTN_PILL_RIGHT = 410 / 424;
export const HERO_HEIGHT = 500;
export const HERO_TOP_GAP = 0;
export const TOP_BAR_CONTENT_HEIGHT = 10;
// Scroll offsets over which the floating top bar turns from transparent
// (over the artwork) into a solid bar carrying the event name.
export const TOP_BAR_FADE_START = HERO_HEIGHT * 0.34;
export const TOP_BAR_FADE_END = HERO_HEIGHT * 0.62;
export const HERO_SCRIM_COLORS = [
  'transparent',
  'rgba(14,7,26,0.35)',
  'rgba(9,4,18,0.78)',
  'rgba(12, 2, 2, 0.96)',
];
export const HERO_SCRIM_LOCATIONS = [0, 0.4, 0.75, 1];
export const HERO_TOP_SCRIM_COLORS = [
  'rgba(12, 12, 12, 0.85)',
  'rgba(12, 12, 12, 0.32)',
  'transparent',
];
// The summary card climbs over the bottom of the hero so the artwork reads as
// the card's backdrop rather than a separate band above it.
export const HERO_CARD_OVERLAP = 40;
export const ARTIST_CARD_WIDTH = 104;
export const ARTIST_CARD_GAP = 12;
export const CLAIM_GRADIENT_COLORS = [
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.55)',
  'rgba(0,0,0,0.9)',
  '#000000',
];
export const CLAIM_GRADIENT_LOCATIONS = [0, 0.35, 0.65, 1];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    aspectRatio: BG_ASPECT_RATIO,
  },
  scrollContent: {
    paddingBottom: 160,
  },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topBarSurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,4,18,0.94)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  topBarProgressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    overflow: 'hidden',
  },
  topBarProgressFill: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    transformOrigin: 'left',
  },
  topBarButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topBarButtonBg: {
    resizeMode: 'contain',
  },
  topBarCenter: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarLogo: {
    width: 104,
    height: 36,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  topBarTitleWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
  },

  hero: {
    width: '100%',
    height: HERO_HEIGHT,
    backgroundColor: '#0B0516',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  heroImageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImageBg: {
    flex: 1,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
  },
  heroTopScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '26%',
  },
  heroDots: {
    position: 'absolute',
    bottom: HERO_CARD_OVERLAP + 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: COLORS.white,
  },
  scrollHint: {
    position: 'absolute',
    top: HERO_HEIGHT - 46,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollHintChevron: {
    marginTop: -14,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  /* Sections */
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 12,
  },

  summaryCard: {
    marginHorizontal: 14,
    marginTop: -HERO_CARD_OVERLAP,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    padding: 16,
  },
  summaryCardBlur: {
    borderRadius: 24,
  },
  summaryCardTint: {
    backgroundColor: 'rgba(12,6,22,0.45)',
  },
  summaryCardFallback: {
    backgroundColor: 'rgba(12,6,22,0.72)',
  },
  eventName: {
    color: COLORS.white,
    fontSize: 26,
    lineHeight: 34,
    fontFamily: 'Gilroy-Bold',
  },
  eventTagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Gilroy-Medium',
    marginTop: 6,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: ICON_TILE_BG,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
  },
  categoryPillText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Gilroy-SemiBold',
  },

  /* Fact strip (date / venue / price) */
  factStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  factCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  factDivider: {
    width: 1,
    marginVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  factIcon: {
    marginRight: 7,
  },
  factTextGroup: {
    flex: 1,
  },
  factPrimary: {
    color: COLORS.white,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'Gilroy-SemiBold',
  },
  factSecondary: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'Gilroy-Medium',
  },
  factPrice: {
    color: '#F5C542',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Gilroy-Bold',
  },

  /* Venue map strip */
  mapStrip: {
    aspectRatio: 6,
    overflow: 'hidden',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  mapLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    maxWidth: '52%',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(110,52,192,0.85)',
  },
  mapLabelText: {
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 12,
    fontFamily: 'Gilroy-SemiBold',
  },

  /* UD coins row */
  bannerWrap: {
    borderRadius: 16,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_BG,
    paddingVertical: 14,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  bannerCoinWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerCoinGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5C542',
  },
  bannerCoin: {
    width: 34,
    height: 34,
  },
  bannerText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Gilroy-Medium',
  },
  bannerHighlight: {
    color: '#F5C542',
    fontFamily: 'Gilroy-Bold',
  },
  bannerShimmer: {
    position: 'absolute',
    top: -24,
    bottom: -24,
    left: 0,
    width: 90,
  },
  bannerShimmerGradient: {
    flex: 1,
    transform: [{ rotate: '18deg' }],
  },

  /* More to know rows */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  infoIconTile: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoIcon: {
    width: 34,
    height: 34,
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },
  metaValue: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
    marginTop: 2,
  },

  /* Artists */
  artistList: {
    paddingRight: 12,
  },
  artistCard: {
    width: ARTIST_CARD_WIDTH,
    marginRight: ARTIST_CARD_GAP,
    alignItems: 'flex-start',
  },
  artistImage: {
    width: ARTIST_CARD_WIDTH,
    height: ARTIST_CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: '#222222',
    marginBottom: 10,
  },
  artistName: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Gilroy-Bold',
  },
  artistRole: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    marginTop: 4,
  },
  artistProgressTrack: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
  },
  artistProgressSegment: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 3,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  artistProgressFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
  },

  accordionGroup: {
    marginTop: 22,
  },

  /* Accordion */
  accordion: {
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_BG,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  accordionIconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(110,52,192,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginRight: 14,
  },
  accordionTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'Gilroy-SemiBold',
  },
  accordionBody: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  accordionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Gilroy-Medium',
  },
  divider: {
    // height: 1,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 18,
  },

  /* Claim button */
  claimWrap: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    paddingTop: 28,
  },
  claimBarImage: {
    width: '100%',
    aspectRatio: CLAIM_BTN_ASPECT_RATIO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimLabelWrap: {
    position: 'absolute',
    left: `${CLAIM_BTN_PILL_LEFT * 100}%`,
    right: `${(1 - CLAIM_BTN_PILL_RIGHT) * 100}%`,
    top: `${CLAIM_BTN_PILL_TOP * 100}%`,
    bottom: `${(1 - CLAIM_BTN_PILL_BOTTOM) * 100}%`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Out of flow so the label stays centred on the pill regardless of the tick.
  claimTick: {
    position: 'absolute',
    left: 18,
    resizeMode: 'contain',
  },
  claimLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.3,
    textAlign: 'center',
    // Android otherwise reserves extra room above/below the glyphs, which
    // renders the label lower on the pill than it sits on iOS.
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  claimSafeArea: {
    backgroundColor: '#000000',
  },

  /* Loader */
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});

export default styles;
