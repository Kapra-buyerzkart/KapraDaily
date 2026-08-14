import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const CANVAS = '#FFFFFF';

export const SURFACE = {
  base: '#FFFFFF',
  sunken: '#F5F6F8',
  tint: '#FFF6F2',
};

export const HAIRLINE = 'rgba(17,19,26,0.05)';

export const INK = {
  strong: '#12131A',
  base: '#2B2D36',
  muted: '#6B7280',
  faint: '#6E7480',
  onDark: '#FFFFFF',
};

export const ACCENT = {
  primary: '#F25000',
  primarySoft: '#FFE9E0',
  primaryDeep: '#9A3200',
  success: '#0E9F4F',
  successSoft: '#E7F7EE',
  successText: '#0B7A3D',
  savings: '#0B7A3D',
  discount: '#C2410C',
  action: '#312E81',
  actionSoft: '#EEF0FF',
  actionDeep: '#1E1B4B',
};

export const RADIUS = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
};

export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const SEARCH_FIELD = {
  height: 48,
  radius: RADIUS.md,
};

export const FIELD_RULE = 'rgba(17,19,26,0.12)';
export const CLEAR_DISC = 'rgba(17,19,26,0.08)';

const TYPE_SCALE = Math.min(Math.max(wp('100%') / 390, 0.92), 1.1);
const pt = size => Math.round(size * TYPE_SCALE * 10) / 10;

export const TYPE = {
  display: { fontSize: pt(26), lineHeight: pt(32) },
  title: { fontSize: pt(20), lineHeight: pt(26) },
  heading: { fontSize: pt(17), lineHeight: pt(22) },
  body: { fontSize: pt(15), lineHeight: pt(20) },
  label: { fontSize: pt(13), lineHeight: pt(18) },
  caption: { fontSize: pt(12), lineHeight: pt(16) },
  micro: { fontSize: pt(11), lineHeight: pt(14) },
};
export const MAX_FONT_SCALE = 1.3;

export const TOUCH_MIN = 44;

export const hitSlopTo = visualSize => {
  const pad = Math.max(0, Math.round((TOUCH_MIN - visualSize) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
};

export const ELEVATION = {
  none: {},

  md: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const GUTTER_PCT = 4.6;
export const GUTTER = wp(`${GUTTER_PCT}%`);

export const divider = {
  height: StyleSheet.hairlineWidth,
  backgroundColor: HAIRLINE,
  marginHorizontal: GUTTER,
};

export const CATEGORY_WELL = '#F7F4F1';

export const EXPLORE_PANEL = '#FFF0E7';
export const EXPLORE_PANEL_EDGE = 'rgba(242,80,0,0.26)';

export const CATEGORY_TINTS = [
  '#EAF4FF',
  '#EAF7EE',
  '#FFF6E0',
  '#F3EDFF',
  '#FFECEF',
  '#E7F6F6',
  '#F1F3E7',
];

export const categoryTint = index =>
  CATEGORY_TINTS[index % CATEGORY_TINTS.length];

export const HERO_TOP = '#FFF2E8';
export const HERO_GRADIENT = [HERO_TOP, '#FFFAF6', CANVAS];

export const HERO_LIFT = {
  shadowColor: '#8A4A25',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 2,
};

export default {
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  SEARCH_FIELD,
  FIELD_RULE,
  CLEAR_DISC,
  TYPE,
  ELEVATION,
  MAX_FONT_SCALE,
  TOUCH_MIN,
  hitSlopTo,
  GUTTER,
  divider,
  CATEGORY_WELL,
  EXPLORE_PANEL,
  EXPLORE_PANEL_EDGE,
  CATEGORY_TINTS,
  categoryTint,
  HERO_TOP,
  HERO_GRADIENT,
  HERO_LIFT,
};
