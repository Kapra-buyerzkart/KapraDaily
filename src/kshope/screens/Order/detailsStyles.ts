import { Dimensions, StyleSheet } from 'react-native';
import { Fonts } from '../../theme/fonts';

const DESIGN_WIDTH = 440;
const SCREEN_WIDTH = Dimensions.get('window').width;
const RATIO = SCREEN_WIDTH / DESIGN_WIDTH;

export const dp = (value: number) => Math.round(value * RATIO * 100) / 100;

export const DESIGN_COLORS = {
  screen: '#FFFFFF',
  canvas: '#F1F1F1',
  card: '#FFFFFF',
  orange: '#F25000',
  ink: '#1A1A1A',
  body: '#3D3D3D',
  muted: '#7A7A7A',
  green: '#12A150',
  greenDeep: '#0E8A44',
  greenStrip: '#C6F0D0',
  greenPill: '#D5F5DE',
  star: '#D6D6D6',
  rule: '#E6E6E6',
  deliveryCard: '#E7E7E7',
  deliveryRule: '#CFCFCF',
  avatar: '#BDBDBD',
  iconTile: '#EFEFEF',
  stepPending: '#BDBDBD',
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
    height: dp(56),
    backgroundColor: DESIGN_COLORS.screen,
  },
  backButton: {
    width: dp(28),
    height: dp(28),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: dp(8),
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(19),
    color: DESIGN_COLORS.ink,
  },
  headerCartBtn: {
    width: dp(30),
    height: dp(30),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingBottom: dp(40),
    backgroundColor: DESIGN_COLORS.canvas,
  },

  whiteBlock: {
    backgroundColor: DESIGN_COLORS.screen,
    paddingHorizontal: dp(16),
    marginHorizontal: dp(8),
    marginTop: dp(8),
    borderRadius: dp(12),
    overflow: 'hidden',
  },

  statusHeading: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(16.5),
    color: DESIGN_COLORS.ink,
    marginTop: dp(24),
  },

  itemBlock: {
    marginVertical: dp(20),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: dp(112),
    height: dp(104),
    borderRadius: dp(15),
  },
  itemInfo: {
    flex: 1,
    marginLeft: dp(20),
  },
  itemOrderNo: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  itemName: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.body,
    marginTop: dp(4),
  },
  itemQtyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: dp(10),
  },
  itemQty: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(21),
    color: DESIGN_COLORS.ink,
  },
  itemPrice: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.ink,
    marginBottom: dp(2),
  },

  returnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(26),
  },
  returnBtn: {
    width: dp(104),
    height: dp(42),
    borderRadius: dp(8),
    borderWidth: dp(1.2),
    borderColor: DESIGN_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnBtnText: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: dp(17),
    color: DESIGN_COLORS.ink,
  },
  returnNote: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnNoteText: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.ink,
    marginLeft: dp(6),
  },
  returnNoteAccent: {
    fontFamily: Fonts.gilroySemiBold,
    color: DESIGN_COLORS.orange,
  },

  rateBlock: {
    alignItems: 'center',
    marginTop: dp(34),
    paddingBottom: dp(24),
  },
  rateCard: {
    paddingTop: dp(2),
    paddingBottom: dp(4),
  },
  rateTitle: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(17),
    color: DESIGN_COLORS.ink,
  },
  rateCaption: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(12.5),
    color: DESIGN_COLORS.muted,
    marginTop: dp(5),
  },
  starRow: {
    flexDirection: 'row',
    marginTop: dp(14),
  },
  star: {
    marginHorizontal: dp(7),
  },
  rateInput: {
    alignSelf: 'stretch',
    marginHorizontal: dp(16),
    marginTop: dp(16),
    minHeight: dp(84),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DESIGN_COLORS.deliveryRule,
    borderRadius: dp(10),
    paddingHorizontal: dp(12),
    paddingVertical: dp(10),
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.ink,
  },
  rateSubmit: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dp(16),
    marginTop: dp(12),
    height: dp(46),
    borderRadius: dp(10),
    backgroundColor: DESIGN_COLORS.orange,
  },
  rateSubmitText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.white,
  },
  rateThanks: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
    marginTop: dp(12),
  },

  card: {
    backgroundColor: DESIGN_COLORS.card,
    borderRadius: dp(12),
    marginHorizontal: dp(8),
    marginTop: dp(12),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: dp(1) },
    shadowOpacity: 0.06,
    shadowRadius: dp(4),
    elevation: 2,
  },
  cardPad: {
    padding: dp(16),
  },

  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dp(14),
  },
  billLabel: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.ink,
  },
  billValue: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.ink,
  },
  billValueGreen: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(13.5),
    color: DESIGN_COLORS.green,
  },
  billRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DESIGN_COLORS.rule,
    marginBottom: dp(12),
  },
  toPayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  toPayLabel: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(17),
    color: DESIGN_COLORS.ink,
  },
  toPayNote: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(10),
    color: DESIGN_COLORS.muted,
    marginTop: dp(2),
  },
  toPayValue: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },
  savedStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.greenStrip,
    height: dp(34),
  },
  savedText: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: dp(12.5),
    color: DESIGN_COLORS.greenDeep,
    marginLeft: dp(6),
  },

  sectionTitle: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(16),
    color: DESIGN_COLORS.ink,
  },

  iconTile: {
    width: dp(34),
    height: dp(34),
    borderRadius: dp(6),
    backgroundColor: DESIGN_COLORS.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
  },

  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(14),
  },
  payBody: {
    flex: 1,
    marginLeft: dp(12),
  },
  payMethod: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(14.5),
    color: DESIGN_COLORS.ink,
  },
  payCaption: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
    marginTop: dp(6),
  },
  payValueCol: {
    alignItems: 'flex-end',
  },
  payAmount: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.ink,
  },
  paidPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_COLORS.greenPill,
    borderRadius: dp(4),
    paddingHorizontal: dp(6),
    paddingVertical: dp(3),
    marginTop: dp(6),
  },
  paidPillText: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: dp(10),
    color: DESIGN_COLORS.greenDeep,
    marginLeft: dp(4),
  },

  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceBody: {
    flex: 1,
    marginLeft: dp(12),
  },
  invoiceTitle: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.ink,
  },
  invoiceNo: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(11),
    color: DESIGN_COLORS.muted,
    marginTop: dp(3),
  },

  invoiceRule: {
    height: 1,
    backgroundColor: DESIGN_COLORS.rule,
    marginTop: dp(14),
    marginBottom: dp(4),
  },
  invoiceDownloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: dp(12),
    paddingBottom: dp(2),
  },
  invoiceDownloadText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.orange,
    marginLeft: dp(8),
  },
  invoiceDownloadTextDisabled: {
    color: DESIGN_COLORS.muted,
  },

  trackBlock: {
    backgroundColor: DESIGN_COLORS.screen,
    paddingHorizontal: dp(16),
    paddingTop: dp(20),
    paddingBottom: dp(22),
    marginHorizontal: dp(8),
    marginTop: dp(12),
    borderRadius: dp(12),
    overflow: 'hidden',
  },
  trackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackThumb: {
    width: dp(58),
    height: dp(58),
    borderRadius: dp(8),
  },
  trackInfo: {
    flex: 1,
    marginLeft: dp(12),
  },
  trackEta: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(13),
    color: DESIGN_COLORS.orange,
  },
  trackName: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.ink,
    marginTop: dp(3),
  },
  trackOrderNo: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(12),
    color: DESIGN_COLORS.muted,
    marginTop: dp(3),
  },
  trackCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.orange,
    height: dp(34),
    paddingHorizontal: dp(14),
    borderRadius: dp(6),
  },
  trackCtaText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.white,
    marginRight: dp(6),
  },

  stepper: {
    marginTop: dp(24),
  },
  stepperTrack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNode: {
    width: dp(19),
    height: dp(19),
    borderRadius: dp(9.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeDone: {
    backgroundColor: DESIGN_COLORS.orange,
  },
  stepNodePending: {
    borderWidth: dp(1.5),
    borderColor: DESIGN_COLORS.stepPending,
    backgroundColor: DESIGN_COLORS.screen,
  },
  stepConnector: {
    flex: 1,
    height: dp(2),
  },
  stepConnectorDone: {
    backgroundColor: DESIGN_COLORS.orange,
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
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(11),
    color: DESIGN_COLORS.ink,
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

  deliveryCard: {
    backgroundColor: DESIGN_COLORS.deliveryCard,
    borderRadius: dp(12),
    marginHorizontal: dp(8),
    marginTop: dp(4),
    padding: dp(16),
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryIconCol: {
    width: dp(28),
    alignItems: 'flex-start',
  },
  deliveryAvatar: {
    width: dp(44),
    height: dp(44),
    borderRadius: dp(22),
    backgroundColor: DESIGN_COLORS.avatar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryBody: {
    flex: 1,
    marginLeft: dp(12),
  },
  deliveryTitle: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(17),
    color: DESIGN_COLORS.ink,
  },
  deliveryValue: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
    marginTop: dp(3),
  },
  deliveryAddress: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    lineHeight: dp(19),
    color: DESIGN_COLORS.muted,
    marginTop: dp(4),
  },
  deliveryRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DESIGN_COLORS.deliveryRule,
    marginVertical: dp(16),
  },
  deliveryGap: {
    height: dp(20),
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPriceLabel: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
  },
  itemPriceValue: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(17),
    color: DESIGN_COLORS.ink,
  },

  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(16),
  },
  groupThumb: {
    width: dp(58),
    height: dp(52),
    borderRadius: dp(8),
  },
  groupInfo: {
    flex: 1,
    marginLeft: dp(12),
  },
  groupStatusText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(12.5),
    color: DESIGN_COLORS.orange,
  },
  groupName: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.ink,
    marginTop: dp(4),
  },
  groupCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN_COLORS.orange,
    height: dp(32),
    paddingHorizontal: dp(12),
    borderRadius: dp(6),
  },
  groupCtaText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(13),
    color: DESIGN_COLORS.white,
    marginRight: dp(6),
  },
  groupMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: dp(16),
  },
  groupMetaLabel: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(12.5),
    color: DESIGN_COLORS.body,
  },
  groupMetaValue: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: dp(13),
    color: DESIGN_COLORS.ink,
    marginTop: dp(3),
  },
  groupMetaRight: {
    alignItems: 'flex-end',
  },
  groupTotal: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(17),
    color: DESIGN_COLORS.ink,
    marginTop: dp(3),
  },
  groupRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DESIGN_COLORS.rule,
    marginTop: dp(16),
  },

  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dp(8),
    marginHorizontal: dp(8),
    marginTop: dp(12),
    height: dp(48),
    borderRadius: dp(10),
    backgroundColor: DESIGN_COLORS.orange,
  },
  retryBtnText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.white,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dp(12),
    paddingHorizontal: dp(16),
    paddingVertical: dp(12),
    backgroundColor: DESIGN_COLORS.screen,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DESIGN_COLORS.rule,
  },
  barGhostBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dp(8),
    height: dp(46),
    borderRadius: dp(10),
    borderWidth: dp(1.2),
    borderColor: DESIGN_COLORS.rule,
  },
  barGhostDanger: {
    borderColor: DESIGN_COLORS.danger,
  },
  barBtnText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.ink,
  },
  barBtnTextDanger: {
    fontFamily: Fonts.gilroyBold,
    fontSize: dp(15),
    color: DESIGN_COLORS.danger,
  },
});

export default detailsStyles;
