import { StyleSheet } from 'react-native';
import { Fonts } from '../../assets/theme/fonts';
import { colors } from '../../assets/theme/colours';

const figmaTeal = '#F25000';

export default StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: figmaTeal,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: 50
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    color: colors.darkFontOne,
    fontWeight: '300',
    marginRight: 6,
  },
  chevronText: {
    fontSize: 16,
    color: figmaTeal,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 2,
  }
});
