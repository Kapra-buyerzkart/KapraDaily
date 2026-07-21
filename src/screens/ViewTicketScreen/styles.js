import { StyleSheet } from 'react-native';
import { wp, hp } from '../../utils/responsive';
import COLORS from '@/styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: wp(5),
  },
  closeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(2),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeBtnText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Gilroy-Medium',
    lineHeight: 24,
  },
});

export default styles;
