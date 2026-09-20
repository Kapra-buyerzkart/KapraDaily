import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Fonts } from '../../theme/fonts';

export const LUXURY_COLORS = {
  emerald: '#0C382E',
  emeraldDeep: '#082821',
  emeraldLight: '#164E40',
  emeraldTint: '#E8F2EE',
  gold: '#B68D40',
  goldMetallic: '#C5A869',
  goldTint: '#FAF5EE',
  goldBorder: '#EFE7DB',
  canvas: '#FBFBFA',
  card: '#FFFFFF',
  border: '#ECEAE5',
  borderLight: '#F3F1ED',
  borderStrong: '#D6D2CA',
  textPrimary: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textMuted: '#757575',
  textFaint: '#A0A0A0',
  well: '#FAF9F6',
  white: '#FFFFFF',
  shadow: '#0C382E',
};

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.canvas,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8%'),
    borderBottomWidth: 1,
    borderBottomColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.canvas,
  },
  headerLeftBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: LUXURY_COLORS.card,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  headerTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: wp('5.8%'),
    color: LUXURY_COLORS.emerald,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: wp('10%'),
  },

  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('5%'),
  },

  // Hero Card
  heroCard: {
    backgroundColor: LUXURY_COLORS.emerald,
    borderRadius: 20,
    padding: wp('5.5%'),
    borderWidth: 1,
    borderColor: 'rgba(182, 141, 64, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.5%'),
  },
  clubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(182, 141, 64, 0.18)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(197, 168, 105, 0.35)',
  },
  clubBadgeText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.goldMetallic,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginLeft: wp('1.5%'),
  },
  heroTitle: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: wp('6.2%'),
    color: LUXURY_COLORS.white,
    lineHeight: wp('7.5%'),
    marginBottom: hp('0.5%'),
  },
  heroSubtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: wp('3.2%'),
    color: 'rgba(255, 255, 255, 0.78)',
    lineHeight: wp('4.6%'),
    marginBottom: hp('2.2%'),
  },

  // Rewards Tile inside Hero
  rewardTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  rewardTileLeft: {
    flex: 1,
  },
  rewardTileLabel: {
    fontFamily: Fonts.lexend.regular,
    fontSize: wp('3%'),
    color: 'rgba(255, 255, 255, 0.72)',
    marginBottom: hp('0.3%'),
  },
  rewardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  rewardTileValue: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: wp('6.5%'),
    color: LUXURY_COLORS.goldMetallic,
  },

  // Referral Code Pill
  codeSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2.2%'),
    borderWidth: 1,
    borderColor: 'rgba(182, 141, 64, 0.3)',
  },
  codeLeft: {
    flex: 1,
  },
  codeLabel: {
    fontFamily: Fonts.lexend.regular,
    fontSize: wp('2.6%'),
    color: 'rgba(255, 255, 255, 0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeValue: {
    fontFamily: Fonts.lexend.bold,
    fontSize: wp('4.2%'),
    color: LUXURY_COLORS.white,
    letterSpacing: 1.5,
    marginTop: hp('0.2%'),
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LUXURY_COLORS.gold,
    paddingHorizontal: wp('3.2%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 8,
  },
  copyBtnText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.white,
    marginLeft: wp('1%'),
  },

  // Share CTA Button
  heroShareBtn: {
    backgroundColor: LUXURY_COLORS.gold,
    borderRadius: 14,
    paddingVertical: hp('1.6%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldMetallic,
    ...Platform.select({
      ios: {
        shadowColor: LUXURY_COLORS.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroShareBtnText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: wp('3.8%'),
    color: LUXURY_COLORS.white,
    marginLeft: wp('2%'),
    letterSpacing: 0.4,
  },

  // Benefit Steps Rail
  stepsContainer: {
    backgroundColor: LUXURY_COLORS.card,
    borderRadius: 16,
    padding: wp('4.5%'),
    marginTop: hp('2.2%'),
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  stepsTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: wp('4.6%'),
    color: LUXURY_COLORS.emerald,
    marginBottom: hp('1.5%'),
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp('1%'),
  },
  stepIconCircle: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  stepStepNumber: {
    position: 'absolute',
    top: -wp('1.2%'),
    right: -wp('1.2%'),
    backgroundColor: LUXURY_COLORS.emerald,
    width: wp('4.5%'),
    height: wp('4.5%'),
    borderRadius: wp('2.25%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontFamily: Fonts.lexend.bold,
    fontSize: wp('2.4%'),
    color: LUXURY_COLORS.white,
  },
  stepTitle: {
    fontFamily: Fonts.lexend.medium,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: hp('0.2%'),
  },
  stepDesc: {
    fontFamily: Fonts.lexend.regular,
    fontSize: wp('2.5%'),
    color: LUXURY_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: wp('3.4%'),
  },

  // History Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('3%'),
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: wp('5%'),
    color: LUXURY_COLORS.emerald,
  },
  countBadge: {
    backgroundColor: LUXURY_COLORS.emeraldTint,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 999,
  },
  countBadgeText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.emerald,
  },

  // History List
  historyCard: {
    backgroundColor: LUXURY_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.6%'),
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarDisc: {
    width: wp('10.5%'),
    height: wp('10.5%'),
    borderRadius: wp('5.25%'),
    backgroundColor: LUXURY_COLORS.emeraldTint,
    borderWidth: 1,
    borderColor: 'rgba(12, 56, 46, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  avatarText: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: wp('4.6%'),
    color: LUXURY_COLORS.emerald,
  },
  nameCol: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.lexend.medium,
    fontSize: wp('3.6%'),
    color: LUXURY_COLORS.textPrimary,
  },
  userDate: {
    fontFamily: Fonts.lexend.regular,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
    marginTop: hp('0.2%'),
  },
  itemRight: {
    alignItems: 'flex-end',
    marginLeft: wp('2%'),
  },
  statusBadge: {
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    paddingHorizontal: wp('2.4%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 6,
  },
  statusBadgeText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: wp('2.6%'),
    color: LUXURY_COLORS.gold,
  },
  itemDivider: {
    height: 1,
    backgroundColor: LUXURY_COLORS.borderLight,
    marginHorizontal: wp('4%'),
  },

  // Empty State
  emptyBox: {
    backgroundColor: LUXURY_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: LUXURY_COLORS.emeraldTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.5%'),
  },
  emptyTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: wp('4.8%'),
    color: LUXURY_COLORS.textPrimary,
    marginBottom: hp('0.5%'),
  },
  emptySubtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: wp('3.2%'),
    color: LUXURY_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: wp('4.5%'),
    marginBottom: hp('2%'),
  },
  emptyActionBtn: {
    backgroundColor: LUXURY_COLORS.emerald,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: 10,
  },
  emptyActionBtnText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: wp('3.2%'),
    color: LUXURY_COLORS.white,
  },
});
