import { Platform } from 'react-native';

// The brush script from the UdenDeal logo ("Deal") is baked into the PNG — we
// have no TTF for it. Until one is bundled into src/assets/fonts, fall back to
// each platform's built-in cursive so the treatment can ship. Swapping in the
// real face is a one-line change here; nothing else references a script name.
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
