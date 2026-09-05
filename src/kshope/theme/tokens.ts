import { Platform, TextStyle, ViewStyle } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Fonts } from './fonts';

const TYPE_SCALE = Math.min(Math.max(wp('100%') / 390, 0.92), 1.1);
export const pt = (size: number) => Math.round(size * TYPE_SCALE * 10) / 10;

export const MAX_FONT_SCALE = 1.3;
export const TOUCH_MIN = 44;

export const hitSlopTo = (visualSize: number) => {
  const pad = Math.max(0, Math.round((TOUCH_MIN - visualSize) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
};

export const UI_COLORS = {
  background: '#F4F5F7',
  canvas: '#F4F5F7',
  card: '#FFFFFF',
  well: '#F6F7F9',
  primary: '#F25000',
  primarySoft: '#FF7A00',
  primaryTint: '#FFF1E9',
  primaryEdge: 'rgba(242,80,0,0.22)',
  ink: '#12131A',
  inkSoft: '#3A3D47',
  inkTint: '#F1F2F5',
  inkEdge: 'rgba(17,19,26,0.12)',
  success: '#0E9F4F',
  successDeep: '#0B7A3D',
  successTint: '#E7F7EE',
  successEdge: 'rgba(11,122,61,0.28)',
  token: '#312E81',
  tokenTint: '#EEF0FF',
  tokenEdge: 'rgba(49,46,129,0.18)',
  border: 'rgba(17,19,26,0.08)',
  borderStrong: 'rgba(17,19,26,0.14)',
  textPrimary: '#12131A',
  textSecondary: '#2B2D36',
  textMuted: '#6B7280',
  textFaint: '#9CA3AF',
  pink: '#FF0066',
  pinkTint: '#FFF0F4',
  danger: '#D93025',
  dangerTint: '#FEF1F0',
  onPrimary: '#FFFFFF',
  overlay: 'rgba(9,10,14,0.45)',
};

export const UI_RADIUS = {
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

export const UI_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const UI_GUTTER = UI_SPACING.lg;

const TYPE = {
  display: { fontSize: pt(26), lineHeight: pt(32) },
  title: { fontSize: pt(20), lineHeight: pt(26) },
  heading: { fontSize: pt(17), lineHeight: pt(22) },
  body: { fontSize: pt(15), lineHeight: pt(20) },
  label: { fontSize: pt(13), lineHeight: pt(18) },
  caption: { fontSize: pt(12), lineHeight: pt(16) },
  micro: { fontSize: pt(11), lineHeight: pt(14) },
};

export const UI_TYPE = {
  display: { ...TYPE.display, fontFamily: Fonts.gilroyBold },
  title: { ...TYPE.title, fontFamily: Fonts.gilroyBold },
  heading: { ...TYPE.heading, fontFamily: Fonts.gilroySemiBold },
  body: { ...TYPE.body, fontFamily: Fonts.gilroyRegular },
  bodyStrong: { ...TYPE.body, fontFamily: Fonts.gilroySemiBold },
  label: { ...TYPE.label, fontFamily: Fonts.gilroyMedium },
  labelStrong: { ...TYPE.label, fontFamily: Fonts.gilroySemiBold },
  caption: { ...TYPE.caption, fontFamily: Fonts.gilroyRegular },
  captionStrong: { ...TYPE.caption, fontFamily: Fonts.gilroySemiBold },
  micro: { ...TYPE.micro, fontFamily: Fonts.gilroyMedium },
  microStrong: { ...TYPE.micro, fontFamily: Fonts.gilroySemiBold },
  price: { ...TYPE.body, fontFamily: Fonts.gilroyBold },
  priceLarge: { ...TYPE.heading, fontFamily: Fonts.gilroyBold },
  cta: { ...TYPE.body, fontFamily: Fonts.gilroyExtraBold },
} satisfies Record<string, TextStyle>;

export type UITypeVariant = keyof typeof UI_TYPE;

export const UI_ELEVATION = {
  none: {} as ViewStyle,
  card: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 0 },
  }) as ViewStyle,
  raised: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.09,
      shadowRadius: 16,
    },
    android: { elevation: 1 },
  }) as ViewStyle,
  bar: Platform.select({
    ios: {
      shadowColor: '#0B1020',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
    },
    android: { elevation: 2 },
  }) as ViewStyle,
};

export const UI_SHADOW = UI_ELEVATION.card;

export { wp, hp };
