import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';

export const INK = '#111111';
export const ORANGE = '#FF6A00';
export const RED = '#FF3B30';
export const GRAY_50 = '#FFF';
export const GRAY_300 = '#D8D6CE';
export const GRAY_500 = '#9A9A92';
export const GRAY_600 = '#707070';
export const BG = '#ffffffff';
export const DIVIDER = '#EFEFEF';

export const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: BG,
  },

  headerImage: {
    resizeMode: 'stretch',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '',
  },
  profileHeaderText: {
    color: INK,
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.2%'),
    marginLeft: wp('4%'),
  },
  avatarWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: hp('2.2%'),
  },
  avatarInner: {
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: wp('6.5%'),
    height: wp('6.5%'),
    borderRadius: wp('3.25%'),
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfoWrapper: {
    alignItems: 'center',
    paddingBottom: hp('1.9%'),
    paddingHorizontal: wp('6%'),
  },
  userNameText: {
    color: INK,
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.6%'),
    textAlign: 'center',
  },
  phoneNumberStyle: {
    fontSize: wp('3.4%'),
    fontFamily: FONTS.gilroy.medium,
    color: 'black',
    marginTop: hp('0.4%'),
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('2.5%'),
    marginTop: hp('2.2%'),
    paddingHorizontal: wp('5%'),
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('9.5%'),
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: INK,
    textAlign: 'center',
    marginTop: hp('0.7%'),
  },
  sectionHeader: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: INK,
    marginBottom: hp('1%'),
    marginTop: hp('1.8%'),
  },
  sectionsContainer: {
    paddingHorizontal: wp('5%'),
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DIVIDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    // elevation: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: hp('5.5%'),
    paddingHorizontal: wp('4%'),
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp('2%'),
  },
  listIconWrapper: {
    width: wp('7%'),
    height: wp('7%'),
    backgroundColor: BG,
    borderRadius: wp('3.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    marginLeft: wp('3%'),
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: INK,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginHorizontal: wp('4%'),
  },
  logoutButton: {
    minHeight: hp('6.5%'),
    marginTop: hp('2.4%'),
    marginHorizontal: wp('5%'),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DIVIDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: RED,
  },
  sendContainer: {
    alignItems: 'center',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('5%'),
  },
  sendContainerTextOne: {
    fontFamily: FONTS.gilroy.regular,
    color: INK,
    fontSize: wp('3.72%'),
    paddingBottom: 10,
    lineHeight: wp('3.72%') * 1.2,
  },
  sendContainerTextTwo: {
    color: GRAY_600,
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('3.25%'),
    textAlign: 'center',
  },
  sendContainerInnerView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: GRAY_300,
    borderRadius: 50,
    alignItems: 'center',
    height: hp('6.3%'),
    marginTop: hp('3%'),
    paddingHorizontal: wp('2%'),
    width: '100%',
  },
  sendTextInput: {
    flex: 1,
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('3.72%'),
    color: INK,
    paddingHorizontal: wp('2%'),
  },
  sendButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 40,
    height: hp('4.3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
  },
  suggestSheetBackground: {
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
  },
  suggestSheetHandle: {
    backgroundColor: GRAY_300,
    width: wp('12%'),
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: hp('2%'),
    marginBottom: hp('12%'),
  },
  footerLogo: {
    width: wp('28%'),
    height: hp('6%'),
    resizeMode: 'contain',
  },
  logoWrapper: {
    paddingHorizontal: wp('4%'),
  },
  versionText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3%'),
    color: GRAY_500,
    marginTop: hp('0.1%'),
  },
});
