import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';
import COLORS from '@/styles/colors';

// The clear window the user aims the code at. Kept square so the framing hint
// matches how QR codes are actually shaped.
export const FRAME_SIZE = wp('68%');

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
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.6%'),
    color: COLORS.white,
  },
  iconButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  // Scrim: four dim bands around the transparent middle window.
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
    borderColor: COLORS.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: wp('1%'),
    borderLeftWidth: wp('1%'),
    borderTopLeftRadius: wp('4%'),
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: wp('1%'),
    borderRightWidth: wp('1%'),
    borderTopRightRadius: wp('4%'),
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: wp('1%'),
    borderLeftWidth: wp('1%'),
    borderBottomLeftRadius: wp('4%'),
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: wp('1%'),
    borderRightWidth: wp('1%'),
    borderBottomRightRadius: wp('4%'),
  },
  hintText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: COLORS.white,
    textAlign: 'center',
    marginTop: hp('3%'),
    paddingHorizontal: wp('12%'),
  },

  // Result sheet shown once a code is decoded.
  resultCard: {
    position: 'absolute',
    left: wp('5%'),
    right: wp('5%'),
    bottom: hp('4%'),
    backgroundColor: COLORS.white,
    borderRadius: wp('4%'),
    padding: wp('5%'),
  },
  resultLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
    color: COLORS.textMuted,
    marginBottom: hp('0.6%'),
  },
  resultValue: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: COLORS.textPrimary,
  },
  resultActions: {
    flexDirection: 'row',
    marginTop: hp('2%'),
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

  // Permission / no-camera fallback.
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('10%'),
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
    backgroundColor: COLORS.primary,
  },
});
