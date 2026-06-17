import { StyleSheet, Dimensions } from 'react-native';
import { wp, hp } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageBg: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  titleImage: {
    alignSelf: 'center',
  },

  // ── Title underline ──
  titleUnderline: {
    width: 120,
    height: 3,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },

  // ── Coin bar ──
  coinBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  coinBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  coinAmount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },

  // ── Tabs ──
  tabSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    borderBottomWidth: 0,
  },
  tab: {
    alignItems: 'center',
    marginRight: 28,
    paddingBottom: 6,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  tabTextInactive: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },

  // ── Carousel ──
  carouselWrapper: {
    marginTop: 28,
    alignItems: 'center',
  },
  carouselList: {
    paddingHorizontal: (width - width * 0.72) / 2,
  },
  cardContainer: {
    width: width * 0.72,
    height: width * 0.45,
    borderRadius: 14,
    marginHorizontal: 8,
  },

  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  cardPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  cardPlaceholderText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },

  // ── Carousel Arrows ──
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    marginTop: hp(15),
  },
  arrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'black',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  arrowButton: {
    width: 40,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDivider: {
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },

  // ── Claim Button ──
  claimWrapper: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: hp(10),
    paddingBottom: 30,
  },
  claimButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#D4A843',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  claimText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  subtractImage: {
    width: '100%',
    resizeMode: 'cover',
    marginTop: hp(-7.3),
  },

  // ── Sticky Tab Container ──
  tabOuterContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  stickyRedGlow: {
    position: 'absolute',
    right: -20,
    top: -10,
    bottom: -10,
    width: 100,
    backgroundColor: '#8B0000',
    borderRadius: 50,
  },

  // ── My Vouchers Grid ──
  voucherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  voucherCard: {
    width: (width - 44) / 2,
    backgroundColor: 'black',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  voucherCardImage: {
    width: '100%',
    height: 110,
  },
  voucherCardBody: {
    padding: 10,
  },
  voucherCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  voucherCardDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    lineHeight: 16,
  },
});

export default styles;
