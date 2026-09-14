import { Platform } from 'react-native';

const SCRIPT = Platform.select({
  ios: 'SnellRoundhand-Bold',
  android: 'cursive',
  default: 'cursive',
});

export const FONTS = {
  default: {
    light: 'CormorantGaramond-Light',
    regular: 'CormorantGaramond-Regular',
    medium: 'CormorantGaramond-Medium',
    semiBold: 'CormorantGaramond-SemiBold',
    bold: 'CormorantGaramond-Bold',
  },

  regular: 'CormorantGaramond-Regular',
  medium: 'CormorantGaramond-Medium',
  semiBold: 'CormorantGaramond-SemiBold',
  bold: 'CormorantGaramond-Bold',
  light: 'CormorantGaramond-Light',

  script: {
    regular: SCRIPT,
  },

  inter: {
    regular: 'Inter_18pt-Regular',
  },

  lexend: {
    light: 'Lexend-Light',
    regular: 'Lexend-Regular',
    medium: 'Lexend-Medium',
    semiBold: 'Lexend-SemiBold',
    bold: 'Lexend-Bold',
  },

  roboto: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },

  gilroy: {
    light: 'CormorantGaramond-Light',
    regular: 'CormorantGaramond-Regular',
    medium: 'CormorantGaramond-Medium',
    semiBold: 'CormorantGaramond-SemiBold',
    bold: 'CormorantGaramond-Bold',
    heavy: 'CormorantGaramond-Bold',
  },

  actualGilroy: {
    light: 'Gilroy-Light',
    regular: 'Gilroy-Regular',
    medium: 'Gilroy-Medium',
    semiBold: 'Gilroy-SemiBold',
    bold: 'Gilroy-Bold',
    heavy: 'Gilroy-Heavy',
  },

  cormorantGaramond: {
    light: 'CormorantGaramond-Light',
    lightItalic: 'CormorantGaramond-LightItalic',
    regular: 'CormorantGaramond-Regular',
    italic: 'CormorantGaramond-Italic',
    medium: 'CormorantGaramond-Medium',
    mediumItalic: 'CormorantGaramond-MediumItalic',
    semiBold: 'CormorantGaramond-SemiBold',
    semiBoldItalic: 'CormorantGaramond-SemiBoldItalic',
    bold: 'CormorantGaramond-Bold',
    boldItalic: 'CormorantGaramond-BoldItalic',
  },
};
