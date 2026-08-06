import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';
import COLORS from '@/styles/colors';

export const FRAME_SIZE = wp('68%');

const LOGO_ASPECT = 246 / 141;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
  },
  headerSpacer: {
    flex: 1,
  },
  iconButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    flex: 1,
  },
  scrimFill: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  overlayMiddleRow: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  corner: {
    position: 'absolute',
    width: wp('8%'),
    height: wp('8%'),
    borderColor: COLORS.white,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: wp('1%'),
    borderLeftWidth: wp('1%'),
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: wp('1%'),
    borderRightWidth: wp('1%'),
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: wp('1%'),
    borderLeftWidth: wp('1%'),
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: wp('1%'),
    borderRightWidth: wp('1%'),
  },
  hintText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: COLORS.white,
    textAlign: 'center',
    marginTop: hp('3%'),
    paddingHorizontal: wp('12%'),
  },

  brandZone: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: hp('3%'),
  },
  brandLockup: {
    alignItems: 'center',
  },
  brandLogo: {
    width: wp('30%'),
    aspectRatio: LOGO_ASPECT,
    resizeMode: 'contain',
  },
  brandKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
    marginTop: hp('0.4%'),
  },
  brandRule: {
    width: wp('7%'),
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  brandKicker: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.8%'),
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.75)',
  },

  resultWrap: {
    position: 'absolute',
    left: wp('4%'),
    right: wp('4%'),
    bottom: hp('4%'),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 14,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: wp('5%'),
    overflow: 'hidden',
  },
  validatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('3%'),
    paddingVertical: hp('3%'),
  },
  validatingText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: COLORS.textPrimary,
  },

  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8%'),
  },
  verdictWatermarkWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: wp('4%'),
  },
  verdictWatermark: {
    width: wp('22%'),
    aspectRatio: LOGO_ASPECT,
    resizeMode: 'contain',
    opacity: 0.22,
  },
  verdictIconWrap: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  verdictTitle: {
    flex: 1,
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    letterSpacing: 0.4,
    color: COLORS.white,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp('0.5%'),
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  progressBar: {
    flex: 1,
    backgroundColor: COLORS.white,
    transformOrigin: 'left',
  },

  cardBody: {
    padding: wp('5%'),
  },
  confirmText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.6%'),
    color: COLORS.textMuted,
  },
  reasonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.3%'),
    lineHeight: wp('6%'),
    color: COLORS.textPrimary,
  },

  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginTop: hp('1.6%'),
  },
  attendeeCol: {
    flex: 1,
  },
  attendeeName: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.2%'),
    color: COLORS.textPrimary,
  },
  eventName: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: COLORS.textMuted,
    marginTop: hp('0.3%'),
  },
  categoryPill: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
    borderRadius: wp('5%'),
    borderWidth: 1.5,
    maxWidth: wp('32%'),
  },
  categoryPillText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3%'),
    letterSpacing: 0.6,
  },

  metaRow: {
    flexDirection: 'row',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('2%'),
  },
  metaCell: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.7%'),
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  metaValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.7%'),
    color: COLORS.textPrimary,
    marginTop: hp('0.3%'),
  },

  resultActions: {
    flexDirection: 'row',
    marginTop: hp('2.2%'),
    gap: wp('3%'),
  },
  primaryButton: {
    flex: 1,
    height: hp('5.6%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: COLORS.white,
  },
  secondaryButton: {
    flex: 1,
    height: hp('5.6%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: COLORS.primary,
  },

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('10%'),
  },
  messageBrand: {
    marginBottom: hp('5%'),
  },
  messageIconRing: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  messageTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5%'),
    color: COLORS.white,
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  messageText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: hp('1%'),
    lineHeight: wp('5.5%'),
  },
  messageButton: {
    marginTop: hp('3%'),
    paddingHorizontal: wp('8%'),
    height: hp('5.6%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
});
