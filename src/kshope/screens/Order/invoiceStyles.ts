import { StyleSheet } from 'react-native';
import { Fonts } from '../../theme/fonts';
import { DESIGN_COLORS, dp } from './detailsStyles';

export const INVOICE_CANVAS = '#EFEFF4';

export const invoiceStyles = StyleSheet.create({
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
  headerTextWrap: {
    flex: 1,
    marginHorizontal: dp(8),
  },
  headerTitle: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(19),
    color: DESIGN_COLORS.ink,
  },
  headerSubtitle: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(11),
    color: DESIGN_COLORS.muted,
    marginTop: dp(2),
  },
  downloadButton: {
    width: dp(30),
    height: dp(30),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  pdfWrapper: {
    flex: 1,
    backgroundColor: INVOICE_CANVAS,
  },
  pdf: {
    flex: 1,
    backgroundColor: INVOICE_CANVAS,
  },

  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INVOICE_CANVAS,
  },
  loaderText: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
    marginTop: dp(10),
  },

  pageBadge: {
    position: 'absolute',
    bottom: dp(20),
    alignSelf: 'center',
    paddingHorizontal: dp(14),
    paddingVertical: dp(6),
    borderRadius: dp(20),
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  pageBadgeText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(12),
    color: DESIGN_COLORS.white,
  },

  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: dp(36),
  },
  stateIconTile: {
    width: dp(58),
    height: dp(58),
    borderRadius: dp(29),
    backgroundColor: DESIGN_COLORS.iconTile,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dp(16),
  },
  errorTitle: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(16.5),
    color: DESIGN_COLORS.ink,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: Fonts.gilroyRegular,
    fontSize: dp(13),
    color: DESIGN_COLORS.muted,
    textAlign: 'center',
    marginTop: dp(8),
    lineHeight: dp(19),
  },
  actionButton: {
    marginTop: dp(20),
    paddingHorizontal: dp(28),
    paddingVertical: dp(12),
    borderRadius: dp(8),
    backgroundColor: DESIGN_COLORS.orange,
  },
  actionButtonText: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: dp(14),
    color: DESIGN_COLORS.white,
  },
});
