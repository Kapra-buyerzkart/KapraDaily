import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';
import COLORS from '@/styles/colors';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backgroundImage: {
    height: hp('40%'),
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('4%'),
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('5%'),
    color: COLORS.white,
  },
  backArrow: {
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  headerSpacer: {
    width: wp('5%'),
  },
  kapraLogo: {
    width: wp('40%'),
    height: hp('8%'),
    resizeMode: 'contain',
    marginTop: hp('2%'),
    tintColor:COLORS.white
  },
  formContainer: {
    flex: 1,
    zIndex: 1000,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('5%'),
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp('10%'),
    borderTopRightRadius: wp('10%'),
  },
  scrollView: {
    flex: 1,
    marginTop: -hp('5%'),
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: hp('2%'),
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  label: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: '#616161',
    marginBottom: hp('0.5%'),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('6%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: wp('4%'),
    backgroundColor: COLORS.white,
  },
  inputWrapperDisabled: {
    backgroundColor: '#F9F9F9',
  },
  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: wp('4%'),
    fontFamily: FONTS.gilroy.regular,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: hp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.5%'),
    marginTop: hp('4%'),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#FFCCBC',
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.5%'),
    color: '#FFFFFF',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.5%'),
  },
  genderButton: {
    flex: 1,
    height: hp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginHorizontal: wp('1%'),
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: '#616161',
  },
  genderButtonTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.gilroy.medium,
  },
});
