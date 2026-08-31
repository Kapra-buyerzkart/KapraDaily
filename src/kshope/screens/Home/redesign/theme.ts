import { Dimensions } from 'react-native';
import { Fonts } from '../../../theme/fonts';

const DESIGN_WIDTH = 440;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const s = (n: number) => (n / DESIGN_WIDTH) * SCREEN_WIDTH;

const TYPE_RATIO = Math.min(Math.max(SCREEN_WIDTH / DESIGN_WIDTH, 0.92), 1.1);

export const fs = (n: number) => Math.round(n * TYPE_RATIO * 10) / 10;

export const HOME_COLORS = {
  headerBlue: '#1F79A6',
  tabRule: '#72CBF7',
  cream: '#F8EAD8',
  creamRule: '#F3D0A2',
  peach: '#FFDFB8',
  peachRule: '#E4A85D',
  heading: '#3B1010',
  script: '#6A0000',
  cocoa: '#592626',
  orange: '#F25000',
  orangeSoft: '#FFA87E',
  searchField: '#D9D9D9',
  searchDivider: '#6A6A6A',
  placeholder: '#868686',
  cardBorder: '#BCBCBC',
  tileBorder: '#BABABA',
  recCardBorder: '#C9C9C9',
  muted: '#656565',
  strike: '#5C5C5C',
  white: '#FFFFFF',
  black: '#000000',
};

export const HOME_FONTS = {
  regular: Fonts.poppins.regular,
  medium: Fonts.poppins.medium,
  semiBold: Fonts.poppins.semiBold,
  light: Fonts.poppins.light,
  script: Fonts.italic,
};

export const GUTTER = s(17);
