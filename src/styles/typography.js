import { Platform } from 'react-native';

const SCRIPT = Platform.select({
  ios: 'SnellRoundhand-Bold',
  android: 'cursive',
  default: 'cursive',
});

export const FONTS = {
  script: {
    regular: SCRIPT,
  },

  inter: {
    regular: 'Inter_18pt-Regular',
  },

  lexend: {
    medium: 'Lexend-Medium',
    semiBold: 'Lexend-SemiBold',
  },

  roboto: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },

  gilroy: {
    light: 'Gilroy-Light',
    regular: 'Gilroy-Regular',
    medium: 'Gilroy-Medium',
    semiBold: 'Gilroy-SemiBold',
    bold: 'Gilroy-Bold',
    heavy: 'Gilroy-Heavy',
  },
};
