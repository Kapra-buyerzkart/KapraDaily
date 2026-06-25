import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';

export const INK = '#1A1A1A';
export const ORANGE = '#FF6A00';
export const GRAY_50 = '#FFF';
export const GRAY_300 = '#D8D6CE';
export const GRAY_500 = '#9A9A92';
export const GRAY_600 = '#6B6B6B';

export const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: hp(10),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('1%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_50,
  },
  profileHeaderText: {
    color: INK,
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('5.2%'),
    marginLeft: wp('4%'),
  },
  profileCard: {
    backgroundColor: GRAY_50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    marginTop: hp('1%'),
    marginHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  userView: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  userAvatarContainer: {
    position: 'relative',
  },
  userNamePhoneView: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  userNameText: {
    color: INK,
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('4.8%'),
    flexShrink: 1,
  },
  phoneNumberStyle: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.poppins.medium,
    color: GRAY_600,
    marginTop: hp('0.2%'),
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INK,
    borderRadius: 20,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    gap: wp('1.5%'),
  },
  tokenBadgeIcon: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenBadgeIconText: {
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('2.8%'),
    color: '#FFFFFF',
  },
  tokenText: {
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
  },
  containerTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('2.5%'),
    marginTop: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  saveAddressContainer: {
    flex: 1,
    alignItems: 'center',
    height: hp('10%'),
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: INK,
    paddingVertical: hp('0.5%'),
  },
  saveAddressAccent: {
    backgroundColor: ORANGE,
  },
  actionIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.2%'),
  },
  saveAddressText: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.1%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sectionHeader: {
    fontFamily: FONTS.outfit.semiBold,
    fontSize: wp('4.2%'),
    color: INK,
    marginBottom: hp('1.2%'),
    marginTop: hp('1%'),
  },
  sectionsContainer: {
    paddingHorizontal: wp('5%'),
    marginTop: hp('2%'),
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRAY_300,
    paddingVertical: hp('0.5%'),
    marginBottom: hp('0.5%'),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconWrapper: {
    width: wp('6%'),
    height: wp('6%'),
    backgroundColor: GRAY_50,
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    marginLeft: wp('3%'),
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3.2%'),
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: GRAY_50,
    marginHorizontal: wp('4%'),
  },
  circle: {
    width: wp('4.2%'),
    height: wp('4.2%'),
  },
  sendContainer: {
    borderColor: GRAY_300,
    marginHorizontal: wp('5%'),
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: wp('3%'),
    marginTop: hp('1.5%'),
    paddingHorizontal: wp('2%'),
  },
  sendContainerTextOne: {
    fontFamily: FONTS.poppins.regular,
    color: INK,
    fontSize: wp('3.72%'),
    paddingBottom: 10,
    lineHeight: wp('3.72%') * 1.2,
  },
  sendContainerTextTwo: {
    color: GRAY_600,
    fontFamily: FONTS.poppins.light,
    fontSize: wp('3.25%'),
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
  },
  sendTextInput: {
    flex: 1,
    fontFamily: FONTS.poppins.light,
    fontSize: wp('3.72%'),
    color: INK,
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
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('3.5%'),
  },
  sendImage: {
    width: wp('18.6%'),
    height: hp('4.3%'),
    resizeMode: 'contain',
  },
  footerBranding: {
    alignItems: 'center',
    paddingVertical: hp('2%'),
    marginBottom: hp('4%'),
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
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3%'),
    color: GRAY_500,
    marginTop: hp('0.1%'),
  },
});
