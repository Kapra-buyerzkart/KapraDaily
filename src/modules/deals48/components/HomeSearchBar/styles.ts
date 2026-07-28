import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { fonts } from '../../assets/theme/typography';
import { Fonts } from '../../assets/theme/fonts';
import { wp } from '../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24, // Pill shape match from Figma
    paddingHorizontal: 12,
    marginHorizontal: 16,
    height: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24, // Pill shape match from Figma
    paddingHorizontal: 12,
    height: 45,
    width: wp('70%'),
  },
  kIcon: {
    width: 20,
    height: 17,
    resizeMode: 'contain',
  },
  iconLeftContainer: {
    marginRight: 8,
  },
  kIconText: {
    fontWeight: '800',
    fontSize: 20,
    color: '#F25000', // Bright cyan matching Figma "K"
    fontFamily: fonts.h1.fontFamily,
  },
  input: {
    flex: 1,
    width: wp('60%'),
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },

  micContainer: {
    paddingLeft: 8,
  },
  micIconText: {
    fontSize: 12,
    color: colors.black,
  },
});
