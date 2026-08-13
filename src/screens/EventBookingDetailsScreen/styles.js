import { StyleSheet } from 'react-native';
import COLORS from '@/styles/colors';
import {
  AVATAR_GAP,
  AVATAR_SIZE,
  BACK_BUTTON_GAP,
  BACK_BUTTON_SIZE,
  BANNER_HEIGHT,
  BANNER_RADIUS,
  HEADER_H_PADDING,
  HEADER_PADDING_BOTTOM,
} from './constants';

const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.10)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HEADER_H_PADDING,
    paddingBottom: HEADER_PADDING_BOTTOM,
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: BACK_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: BACK_BUTTON_GAP,
  },
  headerTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
  headerTitleDocked: {
    paddingLeft: AVATAR_SIZE + AVATAR_GAP,
    fontSize: 18,
  },
  headerDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: BANNER_HEIGHT,
    paddingBottom: 40,
  },

  banner: {
    position: 'absolute',
    borderRadius: BANNER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#141414',
    zIndex: 5,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  daysPill: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(110,52,192,0.28)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  daysPillText: {
    color: '#D9C4FF',
    fontSize: 12,
    fontFamily: 'Gilroy-SemiBold',
  },

  titleBlock: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: 'Gilroy-Bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    marginTop: 4,
  },

  bookingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 12,
  },
  bookingNumber: {
    flex: 1,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    letterSpacing: 0.5,
  },
  copyButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusChipText: {
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
    textTransform: 'capitalize',
  },

  stateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  stateText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontFamily: 'Gilroy-Medium',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 4,
    backgroundColor: 'rgba(110,52,192,0.22)',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  retryText: {
    color: '#D9C4FF',
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemRowDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
    textTransform: 'capitalize',
  },
  itemMeta: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    marginTop: 3,
  },
  itemPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
  },
  ticketNumbers: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    gap: 10,
  },
  ticketNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketNumberText: {
    flex: 1,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    letterSpacing: 0.3,
  },
  ticketNumberStatus: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontFamily: 'Gilroy-SemiBold',
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    marginRight: 12,
  },
  summaryValue: {
    flexShrink: 1,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontFamily: 'Gilroy-SemiBold',
    textAlign: 'right',
  },
  summaryValueMuted: {
    color: '#4CD98A',
  },
  summaryTotalRow: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  summaryTotalLabel: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
  },
  summaryTotalValue: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
  },
  paymentMeta: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  detailIconTile: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  detailLabel: {
    width: 96,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
  },
  detailSeparator: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontFamily: 'Gilroy-SemiBold',
    marginRight: 8,
  },
  detailValue: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
  },
  detailHtml: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  detailHtmlScroll: {
    maxHeight: 220,
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  viewTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(110,52,192,0.15)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(179,140,255,0.5)',
    paddingVertical: 15,
    gap: 8,
  },
  viewTicketText: {
    color: 'rgba(217,196,255,0.9)',
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
  },
  viewTicketHint: {
    color: 'rgba(179,140,255,0.6)',
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
  },
});

export default styles;
