import { Dimensions, StyleSheet } from 'react-native';
import { colors } from './theme/colours';
import { fonts } from './theme/typography';
import { Fonts } from './theme/fonts';

// Export a function that returns the styles
const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard design screen (e.g. iPhone X)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const useCommonStyles = () => {
  const colour = colors;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colour.background,
    },
    title: {
      fontSize: 20,
      color: colour.text,
    },

    horizontalScrollPadding: {
      paddingHorizontal: 16,
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    // Generic Text Styles
    heading1: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colour.text,
    },
    body1: {
      fontSize: 16,
      color: colour.text,
    },
    body2: {
      fontSize: 14,
      color: colour.text,
    },
    caption: {
      fontSize: 12,
      color: colour.black,
      fontFamily: Fonts.regular,
      fontWeight: '300',
    },
    label1: {
      fontSize: 16,
      fontWeight: '600',
      color: colour.text,
    },

    // Text Utilities
    textPrimary: { color: colour.primary },
    textWhite: { color: colour.white },
    textBold: { fontWeight: 'bold' },

    cardExample: {
      padding: 30,
      marginTop: 10,
      color: colour.text,
      backgroundColor: colour.themeTeal,
    },
    headingTextStyle: {
      ...fonts.h4,
      color: colour.text,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colour.text,
    },
    cardDescription: {
      fontSize: 14,
      color: colour.text,
    },
    buttonTextStyle: {
      ...fonts.h4,
      color: colour.white,
    },
    confirmButton: {
      width: '45%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      width: '100%',
      margin: 6,
    },
    // Product Screen Styles
    productFloatingCartContainer: {
      position: 'absolute',
      bottom: 20,
      left: 16,
      right: 16,
    },
    productCartButton: {
      backgroundColor: colour.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      shadowColor: colour.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    productCartLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // Order Details Screen Styles

    // Transaction Success Screen Styles
    iconContainer: {
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Order History Screen Styles

    // Filter Button

    // Filter Modal

    // Radio Buttons

    // Date Inputs

    // Filter Action Button

    // Section Headers for Daily Grouping

    // Updated Transaction Cards

    // Side Menu Styles
    sideMenuOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
    },
    sideMenuContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: '80%',
      maxWidth: 320,
      backgroundColor: colour.primary,
      paddingTop: 50, // For status bar
      paddingBottom: 20,
      zIndex: 2001,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sideMenuHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sideMenuAppIcon: {
      width: 32,
      height: 32,
      backgroundColor: 'white',
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    sideMenuUserInfo: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sideMenuBranchSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginHorizontal: 20,
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    sideMenuAppIconImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    sideMenuScrollContent: {
      flex: 1,
    },
    sideMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    sideMenuFooter: {
      paddingHorizontal: 20,
      marginTop: 20,
    },
    sideMenuLastLoginContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    sideMenuLastLoginIcon: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    sideMenuLastLoginContent: {
      flex: 1,
    },

    // Home Screen specific styles
    headerSectionWrapper: {
      height: 480,
      width: width,
      position: 'relative',
    },
    headerSectionImageBackground: {
      height: 480,
      width: width,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    profileArea: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImageReal: {
      width: 32,
      height: 32,
      borderRadius: 30,
      backgroundColor: colour.white,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userName: {
      fontFamily: Fonts.medium,
      fontSize: 17,
      color: colour.black,
      fontWeight: '400',
    },
    actionsPill: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 20,
      width: 101,
      height: 34,
      paddingHorizontal: 10,
    },
    actionIcon: {
      //marginLeft: 12,
      position: 'relative',
    },
    notificationDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E74C3C',
      zIndex: 1,
    },
    headerDotsContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 16,
      alignSelf: 'center',
    },
    headerDot: {
      width: 32,
      height: 8,
      borderRadius: 3,
      backgroundColor: colour.white,
      marginHorizontal: 3,
      //opacity: 0.8
    },

    sectionContainer: {
      marginTop: 30,
    },
    sectionTitle: {
      fontFamily: Fonts.semiBold,
      fontSize: 16,
      color: colour.black,
      fontWeight: '500',
    },

    goatDealCard: {
      width: (width - 32 - 16) / 2,
      backgroundColor: colour.white,
      borderRadius: 26,
      marginBottom: 24,
      //borderWidth: 1,
      //borderColor: colors.outlineTeal,
      height: 140,
      overflow: 'visible',
    },
    goatDealBg: {
      width: '100%',
      height: '100%',
      borderRadius: 14,
      resizeMode: 'cover',
    },
    goatDealTitle: {
      position: 'absolute',
      top: 12,
      left: 12,
      fontSize: 18,
      fontFamily: Fonts.bold,
      color: colour.black,
      zIndex: 1,
    },
    goatDealImage: {
      width: 140,
      height: 140,
      //position:'absolute',
      right: '25%',
      borderRadius: 25,
    },
    goatDealBadge: {
      position: 'absolute',
      bottom: -14,
      alignSelf: 'center',
      backgroundColor: '#2A2A2A',
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      height: 32,
      width: 160,
      justifyContent: 'center',
    },
    goatDealBadgeText: {
      color: colour.white,
      fontSize: 16,
      marginRight: 8,
      fontFamily: Fonts.regular,
      fontWeight: '400',
    },
    goatDealArrowCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colour.outlineTeal,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },

    exploreItemCard: {
      width: 150,
      //height:250,
      marginRight: 16,
      backgroundColor: colour.white,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.greyborder,
      paddingTop: 10,
    },
    exploreTopBadgesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginBottom: '-25%',
      zIndex: 2,
    },
    discountCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.greyborder,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: colour.white,
      //flex: 1
    },
    discountCircleText: {
      color: colors.tealIconFont,
      fontSize: 9,
      fontFamily: Fonts.medium,
      fontWeight: '400',
      textAlign: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    exploreItemImage: {
      width: '100%',
      height: 132,
      resizeMode: 'contain',
    },
    pricePill: {
      backgroundColor: colors.tealButton,
      borderRadius: 9,
      paddingHorizontal: 2,
      height: 29,
      //width: 65,
      //   elevation: 2,
      //   shadowColor: colors.black,
      //   shadowOffset: { width: 0, height: 2 },
      //   shadowOpacity: 0.85,
      //   shadowRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 65,
    },
    pricePillText: {
      color: colour.white,
      fontSize: 14,
      fontFamily: Fonts.extraBold,
      fontWeight: 'bold',
    },
    originalPriceText: {
      fontSize: 10,
      color: colour.grey,
      textDecorationLine: 'line-through',
      fontFamily: Fonts.regular,
      fontWeight: '300',
    },

    bestSellingContainer: {
      marginHorizontal: 16,
      backgroundColor: '#F25000',
      borderRadius: 24,
      height: 280,
      justifyContent: 'flex-end',
      padding: 16,
      overflow: 'hidden',
    },
    carouselArrowLeft: {
      position: 'absolute',
      left: 16,
      top: 120,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colour.white,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    carouselArrowRight: {
      position: 'absolute',
      right: 16,
      top: 120,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colour.white,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    chevronArrowText: {
      fontSize: 16,
      color: colour.black,
      fontFamily: Fonts.medium,
    },
    bestSellingImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '80%',
      resizeMode: 'contain',
      zIndex: 1,
      top: 20,
    },
    bestSellingTextRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      zIndex: 2,
    },
    bestSellingTitle: {
      fontSize: 26,
      fontFamily: Fonts.bold,
      color: colors.darkFontOne,
      fontWeight: '600',
    },
    bestSellingOriginalPrice: {
      fontSize: 12,
      color: colors.darkFontOne,
      textDecorationLine: 'line-through',
      textAlign: 'right',
      fontFamily: Fonts.medium,
      fontWeight: '500',
    },
    bestSellingCurrentPrice: {
      fontSize: 30,
      fontFamily: Fonts.semiBold,
      color: colors.darkFontOne,
      fontWeight: '600',
    },
    topBrandBg: {
      position: 'absolute',
      left: '1%',
      right: 6,
      top: 0,
      bottom: 0,
      borderTopRightRadius: 14,
      borderBottomRightRadius: 14,
      //overflow: 'hidden',
    },
    brandItemCard: {
      width: (width - 32) / 3 - 6,
      height: 225,
      borderRadius: 16,
      backgroundColor: colors.outlineTeal,
      overflow: 'hidden',
      marginHorizontal: 4,
      alignItems: 'center',
      paddingTop: 10,
    },
    brandImageArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      //width: '100%',
      width: (width - 32) / 3 - 6,
      height: '80%',
    },
    brandLogoText: {
      fontSize: 20,
      fontFamily: Fonts.bold,
      color: colour.black,
      zIndex: 1,
    },
    brandItemImage: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 110,
    },
    brandLogo: {
      width: (width - 32) / 3 - 6,
      height: 215,
      borderRadius: 16,
    },

    gShockSectionWrapper: {
      //backgroundColor: colour.black,
      marginTop: 30,
      paddingBottom: 20,
    },
    gShockTopBanner: {
      width: width,
      height: 700,
    },
    gShockSmallCard: {
      width: (width - 32 - 16) / 2,
      borderRadius: 20,
      marginBottom: 16,
      height: 90,
      overflow: 'hidden',
    },
    gShockSmallImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    onlyAt: {
      fontFamily: Fonts.medium,
      fontSize: 16,
      color: colors.black,
      fontWeight: '400',
    },
    priceOnly: {
      fontFamily: Fonts.regular,
      color: colors.outlineTeal,
      fontSize: 21,
      fontWeight: '600',
    },

    superSaleBannerImage: {
      width: width - 32,
      height: 200,
      marginHorizontal: 10,
      borderRadius: 20,
      alignSelf: 'center',
    },
    superSaleDotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 12,
    },
    superSalePill: {
      width: 32,
      height: 8,
      borderRadius: 3,
      backgroundColor: colors.grey,
      marginHorizontal: 5,
    },

    flashSaleContainer: {
      //backgroundColor: '#A4E8DF',
      paddingBottom: 20,
      marginTop: 10,
    },
    hugeFlashText: {
      color: colour.white,
      fontSize: 64,
      fontFamily: Fonts.bold,
      position: 'absolute',
      bottom: 20,
      left: -10,
      opacity: 0.8,
    },
    podiumImageBackground: {
      width: width,
      height: 720,
      resizeMode: 'cover',
      //opacity: 0.6
    },
    flashSaleItemCard: {
      alignItems: 'center',
      marginRight: 16,
      width: 110,
    },
    flashSaleImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colour.white,
      marginBottom: 20,
    },
    flashBadgeDark: {
      backgroundColor: '#2A2A2A',
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 12,
      position: 'absolute',
      bottom: 25,
    },
    flashBadgeTextDark: {
      color: colour.white,
      fontSize: 10,
      fontFamily: Fonts.bold,
    },
    flashSalePrice: {
      color: colour.white,
      fontSize: 16,
      fontFamily: Fonts.bold,
    },

    //Review linear radient
    reviewFilterPillActiveGradient: {
      //paddingHorizontal: 16,
      //paddingVertical: 8,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      //marginRight: 12,
      //borderWidth: 1,
      borderColor: 'transparent',
      width: 100,
      //flex: 1,
    },
    reviewFilterText: {
      fontFamily: Fonts.regular,
      fontSize: 14,
      color: colors.black,
      fontWeight: '300',
    },
    reviewFilterTextActive: {
      fontFamily: Fonts.regular,
      fontSize: 18,
      color: colors.themeWhite,
      fontWeight: '600',
      //marginHorizontal: 20,
    },

    // Client Module Styles
    // Shared header styles for all Client screens

    // Calculator Screen Styles

    // Profile Styles

    // ClientList specific styles

    // ClientDetails specific styles

    // ClientAdd specific styles

    // Common Utils

    // Refactored Order History Styles
  });
};
