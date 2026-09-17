import { Dimensions, StyleSheet } from 'react-native';
import { Fonts } from '../../theme/fonts';

const DESIGN_WIDTH = 440;
const SCREEN_WIDTH = Dimensions.get('window').width;
const RATIO = SCREEN_WIDTH / DESIGN_WIDTH;

export const dp = (value: number) => Math.round(value * RATIO * 100) / 100;

export const DESIGN_COLORS = {
  screen: '#FFFFFF',
  canvas: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#F0F0F0',
  darkGreen: '#07332C',
  darkGreenSoft: '#0A4D43',
  teal: '#005E54',
  orange: '#F25000',
  ink: '#1A1A1A',
  body: '#374151',
  muted: '#7A7A7A',
  faint: '#9CA3AF',
  green: '#0E8A44',
  greenDeep: '#0E8A44',
  greenStrip: '#D4F7D9',
  greenPill: '#D5F5DE',
  star: '#D6D6D6',
  rule: '#F0F0F0',
  deliveryCard: '#ECECEC',
  deliveryRule: '#D6D6D6',
  avatar: '#4B5563',
  iconTile: '#F3F4F6',
  stepDone: '#07332C',
  stepPending: '#D1D5DB',
  stepPendingCircle: '#9CA3AF',
  danger: '#D93025',
  white: '#FFFFFF',
};

export const detailsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.screen,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dp(16),
    height: dp(54),
    backgroundColor: DESIGN_COLORS.screen,
  },
  backButton: {
    paddingRight: dp(6),
    paddingVertical: dp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: dp(4),
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(18),
    color: DESIGN_COLORS.ink,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: dp(36),
    height: dp(36),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: dp(8),
  },
  cartBadge: {
    position: 'absolute',
    top: dp(2),
    right: dp(2),
    width: dp(16),
    height: dp(16),
    borderRadius: dp(8),
    backgroundColor: DESIGN_COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(9),
    color: DESIGN_COLORS.white,
    textAlign: 'center',
    lineHeight: dp(12),
  },

  scrollContent: {
    paddingBottom: dp(40),
    backgroundColor: DESIGN_COLORS.canvas,
  },

  // Main product card matching screenshot
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dp(16),
    paddingVertical: dp(16),
    backgroundColor: DESIGN_COLORS.screen,
  },
  productImageBox: {
    width: dp(120),
    height: dp(115),
    borderRadius: dp(14),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: DESIGN_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: dp(6),
  },
  productImage: {
    width: dp(104),
    height: dp(100),
  },
  productInfo: {
    flex: 1,
    marginLeft: dp(16),
    justifyContent: 'center',
  },
  productTitle: {
    fontFamily: Fonts.cormorantGaramond?.semiBold || Fonts.semiBold,
    fontSize: dp(18),
    color: DESIGN_COLORS.ink,
    lineHeight: dp(23),
  },
  productSpecs: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(11),
    color: DESIGN_COLORS.muted,
    marginTop: dp(3),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: dp(6),
  },
  productPrice: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  productOldPrice: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(12),
    color: DESIGN_COLORS.faint,
    textDecorationLine: 'line-through',
    marginLeft: dp(6),
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(4),
  },
  savingsDot: {
    width: dp(4),
    height: dp(4),
    borderRadius: dp(1),
    backgroundColor: DESIGN_COLORS.green,
    marginRight: dp(5),
  },
  savingsText: {
    fontFamily: Fonts.lexend?.medium || Fonts.gilroyMedium,
    fontSize: dp(11),
    color: DESIGN_COLORS.green,
  },
  cancelOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(10),
  },
  cancelOrderText: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(12),
    color: DESIGN_COLORS.teal,
    marginRight: dp(2),
  },
  orderCancelledText: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(12),
    color: DESIGN_COLORS.danger,
  },

  // Order Summary Heading
  orderSummaryHeading: {
    fontFamily: Fonts.cormorantGaramond?.semiBold || Fonts.semiBold,
    fontSize: dp(23),
    color: DESIGN_COLORS.ink,
    marginTop: dp(26),
    marginHorizontal: dp(16),
    marginBottom: dp(12),
  },

  // Order Summary Card
  summaryCard: {
    backgroundColor: DESIGN_COLORS.card,
    borderRadius: dp(14),
    marginHorizontal: dp(16),
    borderWidth: 1,
    borderColor: DESIGN_COLORS.rule,
    overflow: 'hidden',
  },
  summaryPad: {
    paddingHorizontal: dp(16),
    paddingTop: dp(16),
    paddingBottom: dp(12),
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dp(12),
  },
  billLabel: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.ink,
  },
  billValue: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.ink,
  },
  billValueGreen: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.green,
  },
  billRule: {
    height: 1,
    backgroundColor: DESIGN_COLORS.rule,
    marginVertical: dp(12),
  },
  toPayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  toPayLabel: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  toPayNote: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(10.5),
    color: DESIGN_COLORS.muted,
    marginTop: dp(2),
  },
  toPayValue: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  savedStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.greenStrip,
    borderRadius: dp(8),
    marginHorizontal: dp(10),
    marginBottom: dp(10),
    paddingVertical: dp(8),
  },
  savedText: {
    fontFamily: Fonts.lexend?.medium || Fonts.gilroyMedium,
    fontSize: dp(12),
    color: DESIGN_COLORS.green,
    marginLeft: dp(6),
  },

  // Payment Details Card
  paymentCard: {
    backgroundColor: DESIGN_COLORS.card,
    borderRadius: dp(14),
    marginHorizontal: dp(16),
    marginTop: dp(14),
    borderWidth: 1,
    borderColor: DESIGN_COLORS.rule,
    padding: dp(16),
  },
  sectionTitle: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.ink,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(14),
  },
  iconTile: {
    width: dp(40),
    height: dp(40),
    borderRadius: dp(8),
    backgroundColor: DESIGN_COLORS.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBody: {
    flex: 1,
    marginLeft: dp(12),
  },
  payMethod: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.ink,
  },
  payCaption: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(12),
    color: DESIGN_COLORS.muted,
    marginTop: dp(4),
  },
  payValueCol: {
    alignItems: 'flex-end',
  },
  payAmount: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(15.5),
    color: DESIGN_COLORS.ink,
  },
  paidPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.greenPill,
    borderRadius: dp(4),
    paddingHorizontal: dp(7),
    paddingVertical: dp(3),
    marginTop: dp(4),
  },
  paidPillText: {
    fontFamily: Fonts.lexend?.medium || Fonts.gilroyMedium,
    fontSize: dp(10),
    color: DESIGN_COLORS.green,
    marginLeft: dp(3),
  },

  // View Invoice Card
  invoiceCard: {
    backgroundColor: DESIGN_COLORS.card,
    borderRadius: dp(14),
    marginHorizontal: dp(16),
    marginTop: dp(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: dp(14),
    paddingVertical: dp(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceBody: {
    flex: 1,
    marginLeft: dp(12),
  },
  invoiceTitle: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.ink,
  },
  invoiceNo: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(11.5),
    color: DESIGN_COLORS.muted,
    marginTop: dp(2),
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: dp(16),
    marginVertical: dp(18),
  },

  // Tracking Section
  trackBlock: {
    backgroundColor: DESIGN_COLORS.screen,
    paddingHorizontal: dp(16),
  },
  trackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackThumbBox: {
    width: dp(54),
    height: dp(54),
    borderRadius: dp(10),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: DESIGN_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackThumb: {
    width: dp(46),
    height: dp(46),
    borderRadius: dp(8),
  },
  trackInfo: {
    flex: 1,
    marginLeft: dp(12),
  },
  trackEta: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(12.5),
    color: DESIGN_COLORS.green,
  },
  trackName: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.ink,
    marginTop: dp(3),
  },
  trackOrderNo: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(11.5),
    color: DESIGN_COLORS.muted,
    marginTop: dp(2),
  },
  trackPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.darkGreen,
    paddingHorizontal: dp(14),
    paddingVertical: dp(7),
    borderRadius: dp(6),
  },
  trackPillText: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(13),
    color: DESIGN_COLORS.white,
    marginRight: dp(3),
  },

  // Stepper
  stepper: {
    marginTop: dp(22),
  },
  stepperTrack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNode: {
    width: dp(18),
    height: dp(18),
    borderRadius: dp(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeDone: {
    backgroundColor: DESIGN_COLORS.darkGreen,
  },
  stepNodePending: {
    borderWidth: dp(1.5),
    borderColor: DESIGN_COLORS.stepPendingCircle,
    backgroundColor: DESIGN_COLORS.screen,
  },
  stepConnector: {
    flex: 1,
    height: dp(2),
  },
  stepConnectorDone: {
    backgroundColor: DESIGN_COLORS.darkGreen,
  },
  stepConnectorPending: {
    backgroundColor: DESIGN_COLORS.stepPending,
  },
  stepLabelRow: {
    flexDirection: 'row',
    marginTop: dp(8),
  },
  stepLabel: {
    flex: 1,
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(10.5),
    color: DESIGN_COLORS.body,
  },
  stepLabelStart: {
    textAlign: 'left',
  },
  stepLabelMid: {
    textAlign: 'center',
  },
  stepLabelEnd: {
    textAlign: 'right',
  },

  // Delivery To Card
  deliveryCard: {
    backgroundColor: DESIGN_COLORS.deliveryCard,
    borderRadius: dp(16),
    marginHorizontal: dp(16),
    marginTop: dp(18),
    padding: dp(18),
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAvatar: {
    width: dp(42),
    height: dp(42),
    borderRadius: dp(21),
    backgroundColor: DESIGN_COLORS.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryBody: {
    flex: 1,
    marginLeft: dp(12),
  },
  deliveryTitle: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  deliveryValue: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
    marginTop: dp(2),
  },
  deliveryRule: {
    height: 1,
    backgroundColor: DESIGN_COLORS.deliveryRule,
    marginVertical: dp(14),
  },
  deliveryRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryIconCol: {
    width: dp(26),
    alignItems: 'flex-start',
    paddingTop: dp(2),
  },
  deliverySectionTitle: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.ink,
  },
  deliveryAddress: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(12.5),
    lineHeight: dp(18),
    color: DESIGN_COLORS.muted,
    marginTop: dp(3),
  },
  deliveryGap: {
    height: dp(14),
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPriceLabel: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.muted,
  },
  itemPriceValue: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },

  // Group Order Section
  groupHeading: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
    marginHorizontal: dp(16),
    marginTop: dp(24),
    marginBottom: dp(12),
  },
  groupCard: {
    backgroundColor: DESIGN_COLORS.card,
    borderRadius: dp(16),
    marginHorizontal: dp(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: dp(16),
    marginBottom: dp(32),
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupThumbBox: {
    width: dp(54),
    height: dp(54),
    borderRadius: dp(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: DESIGN_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupThumb: {
    width: dp(46),
    height: dp(46),
  },
  groupInfo: {
    flex: 1,
    marginLeft: dp(12),
  },
  groupStatusText: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(12),
    color: DESIGN_COLORS.teal,
  },
  groupName: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.ink,
    marginTop: dp(3),
  },
  groupPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.darkGreen,
    paddingHorizontal: dp(14),
    paddingVertical: dp(6.5),
    borderRadius: dp(6),
  },
  groupPillText: {
    fontFamily: Fonts.lexend?.semiBold || Fonts.gilroySemiBold,
    fontSize: dp(12.5),
    color: DESIGN_COLORS.white,
    marginRight: dp(3),
  },
  groupMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: dp(14),
  },
  groupMetaLabel: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(12),
    color: DESIGN_COLORS.muted,
  },
  groupMetaValue: {
    fontFamily: Fonts.lexend?.medium || Fonts.gilroyMedium,
    fontSize: dp(13),
    color: DESIGN_COLORS.ink,
    marginTop: dp(2),
  },
  groupMetaRight: {
    alignItems: 'flex-end',
  },
  groupTotal: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
    marginTop: dp(2),
  },
  groupRule: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: dp(16),
  },

  // Rating & Feedback Block (Optional/if available)
  rateBlock: {
    alignItems: 'center',
    marginTop: dp(24),
    paddingBottom: dp(16),
  },
  rateCard: {
    paddingTop: dp(2),
    paddingBottom: dp(4),
  },
  rateTitle: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  rateCaption: {
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(12),
    color: DESIGN_COLORS.muted,
    marginTop: dp(4),
  },
  starRow: {
    flexDirection: 'row',
    marginTop: dp(12),
  },
  star: {
    marginHorizontal: dp(6),
  },
  rateInput: {
    alignSelf: 'stretch',
    marginHorizontal: dp(16),
    marginTop: dp(14),
    minHeight: dp(76),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: dp(10),
    paddingHorizontal: dp(12),
    paddingVertical: dp(10),
    fontFamily: Fonts.lexend?.regular || Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.ink,
  },
  rateSubmit: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dp(16),
    marginTop: dp(12),
    height: dp(44),
    borderRadius: dp(8),
    backgroundColor: DESIGN_COLORS.darkGreen,
  },
  rateSubmitText: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.white,
  },

  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dp(8),
    marginHorizontal: dp(16),
    marginTop: dp(12),
    height: dp(48),
    borderRadius: dp(10),
    backgroundColor: DESIGN_COLORS.darkGreen,
  },
  retryBtnText: {
    fontFamily: Fonts.lexend?.bold || Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.white,
  },
});

export default detailsStyles;
