import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS } from './contactTheme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CONTACT_COLORS.canvas,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  topBar: {
    backgroundColor: CONTACT_COLORS.canvas,
    borderBottomWidth: 1,
    borderBottomColor: CONTACT_COLORS.border,
    zIndex: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('4.5%'),
  },
});
