import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const CART_COLORS = {
  background: '#F7F8FA',
  card: '#FFFFFF',
  primary: '#F25000',
  lightOrnage: '#F57333',
  primaryTint: '#FFF5F0',
  success: '#0CA201',
  successTint: '#E9F8E8',
  border: '#ECECEC',
  textPrimary: '#000000',
  textMuted: '#757575',
  textGray: '#777777',
  textFaint: '#9E9E9E',
  pink: '#FF0066',
  pinkTint: '#FFF0F4',
  danger: '#D32F2F',
  graySoftColor: '#E5E7EB',
};

export const CART_RADIUS = {
  card: 20,
  button: 16,
  input: 16,
  productCard: 18,
  stepper: 14,
  icon: 12,
  sm: 10,
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

export const CART_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
};

export { wp, hp };
