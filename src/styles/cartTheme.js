import { Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from './typography';
import { TYPE, MAX_FONT_SCALE, TOUCH_MIN, hitSlopTo } from './homeTheme';

export const CART_COLORS = {
  background: '#F4F5F7',
  canvas: '#F4F5F7',
  card: '#FFFFFF',
  well: '#F6F7F9',
  primary: '#F25000',
  lightOrnage: '#F57333',
  primaryTint: '#FFF1E9',
  primaryEdge: 'rgba(242,80,0,0.22)',
  success: '#0E9F4F',
  successDeep: '#0B7A3D',
  successTint: '#E7F7EE',
  border: 'rgba(17,19,26,0.08)',
  borderStrong: 'rgba(17,19,26,0.14)',
  textPrimary: '#12131A',
  textSecondary: '#2B2D36',
  textMuted: '#6B7280',
  textGray: '#6B7280',
  textFaint: '#9CA3AF',
  pink: '#FF0066',
  pinkTint: '#FFF0F4',
  danger: '#D93025',
  dangerTint: '#FEF1F0',
  graySoftColor: 'rgba(17,19,26,0.08)',
  onPrimary: '#FFFFFF',
};

export const CART_RADIUS = {
  card: 20,
  button: 14,
  input: 14,
  productCard: 16,
  stepper: 12,
  icon: 12,
  sm: 10,
  xs: 8,
  pill: 999,
};

export const CART_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const CART_GUTTER = CART_SPACING.lg;

export const CART_TYPE = {
  display: { ...TYPE.display, fontFamily: FONTS.gilroy.bold },
  title: { ...TYPE.title, fontFamily: FONTS.gilroy.bold },
  heading: { ...TYPE.heading, fontFamily: FONTS.gilroy.semiBold },
  body: { ...TYPE.body, fontFamily: FONTS.gilroy.regular },
  bodyStrong: { ...TYPE.body, fontFamily: FONTS.gilroy.semiBold },
  label: { ...TYPE.label, fontFamily: FONTS.gilroy.medium },
  labelStrong: { ...TYPE.label, fontFamily: FONTS.gilroy.semiBold },
  caption: { ...TYPE.caption, fontFamily: FONTS.gilroy.regular },
  captionStrong: { ...TYPE.caption, fontFamily: FONTS.gilroy.semiBold },
  micro: { ...TYPE.micro, fontFamily: FONTS.gilroy.medium },
  price: { ...TYPE.body, fontFamily: FONTS.gilroy.bold },
  priceLarge: { ...TYPE.heading, fontFamily: FONTS.gilroy.bold },
  cta: { ...TYPE.body, fontFamily: FONTS.gilroy.heavy },
};

export const CART_ELEVATION = {
  none: {},
  card: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 0 },
  }),
  raised: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.09,
      shadowRadius: 16,
    },
    android: { elevation: 1 },
  }),
  bar: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
    },
    android: { elevation: 2 },
  }),
};

export const CART_SHADOW = CART_ELEVATION.card;

export { wp, hp, MAX_FONT_SCALE, TOUCH_MIN, hitSlopTo };
