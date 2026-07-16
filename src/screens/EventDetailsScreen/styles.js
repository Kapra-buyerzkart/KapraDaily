import { StyleSheet } from 'react-native';
import COLORS from '@/styles/colors';

const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.10)';
const ICON_TILE_BG = 'rgba(110,52,192,0.25)';
const BG_ASPECT_RATIO = 430 / 2078;
const CLAIM_BAR_ASPECT_RATIO = 430 / 118;

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

  /* Hero */
  hero: {
    width: '100%',
    height: 340,
    backgroundColor: '#111111',
    justifyContent: 'flex-start',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: 'Gilroy-Bold',
    marginLeft: 12,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },

  /* Claim banner — black metallic */
  bannerWrap: {
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
    borderRadius: 16,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 12,
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

  /* Sections */
  section: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 12,
  },

  /* Summary card */
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_BG,
    padding: 18,
  },
  eventName: {
    color: COLORS.white,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 12,
  },
  metaChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryPill: {
    backgroundColor: ICON_TILE_BG,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
  },
  categoryPillText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Gilroy-SemiBold',
  },
  organizerText: {
    flexShrink: 1,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },
  priceValue: {
    color: '#F5C542',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
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
  infoPrimary: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
  },
  infoSecondary: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    marginTop: 2,
  },

  /* More to know rows */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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
    width: 84,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  artistImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: '#222222',
    marginBottom: 8,
  },
  artistName: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Gilroy-SemiBold',
  },
  artistRole: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
    marginTop: 2,
  },

  accordionGroup: {
    marginTop: 22,
  },

  /* Accordion */
  accordion: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: CARD_BG,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  accordionTitle: {
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
    height: 1,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 18,
  },

  /* Claim button */
  claimWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  claimBarImage: {
    width: '100%',
    aspectRatio: CLAIM_BAR_ASPECT_RATIO,
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
