import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PWD_COLORS } from './theme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: PWD_COLORS.canvas,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  topBar: {
    backgroundColor: PWD_COLORS.canvas,
    borderBottomWidth: 1,
    borderBottomColor: PWD_COLORS.border,
    zIndex: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('4.5%'),
    gap: hp('2%'),
  },
});
