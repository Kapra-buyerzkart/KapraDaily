import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Design tokens for the home surface.
//
// The screen is deliberately *flat*: one continuous white page, no floating
// cards, no drop shadows. Sections are separated by whitespace and typography
// alone, with a hairline rule only where two dense blocks would otherwise run
// together. What the tokens standardise is the rhythm — the per-section ad-hoc
// margins and three different rail insets are what made the old screen drift.

// The page. Sections do not sit *on* a canvas here, they *are* the page.
export const CANVAS = '#FFFFFF';

export const SURFACE = {
  base: '#FFFFFF',
  sunken: '#F5F6F8',
  tint: '#FFF6F2', // primary at ~4% — used for active chips and accents
};

export const HAIRLINE = 'rgba(17,19,26,0.05)';

export const INK = {
  strong: '#12131A', // section titles          — 17.6:1
  base: '#2B2D36', // body / product names      — 13.4:1
  muted: '#6B7280', // weights, sublabels        — 4.9:1
  faint: '#6E7480', // struck-through MRP, meta  — 4.8:1
  onDark: '#FFFFFF',
};

export const ACCENT = {
  primary: '#F25000',
  primarySoft: '#FFE9E0',
  success: '#0E9F4F',
  successSoft: '#E7F7EE',
  successText: '#0B7A3D',
  savings: '#0B7A3D',
  discount: '#C2410C',
};

export const RADIUS = {
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

// A full-bleed hairline between two adjacent dense sections. Inset from the
// gutter so it reads as a typographic rule, not a panel edge.
export const divider = {
  height: StyleSheet.hairlineWidth,
  backgroundColor: HAIRLINE,
  marginHorizontal: GUTTER,
};

export const CATEGORY_WELL = '#F7F4F1';

export default {
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  ELEVATION,
  MAX_FONT_SCALE,
  TOUCH_MIN,
  hitSlopTo,
  GUTTER,
  divider,
  CATEGORY_WELL,
};
