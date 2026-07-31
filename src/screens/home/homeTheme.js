import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
  // The only non-white fill in the system: image wells, shimmer bodies and
  // other "something goes here" placeholders.
  sunken: '#F5F6F8',
  tint: '#FFF6F2', // primary at ~4% — used for active chips and accents
};

// Hairline separators do the work drop shadows used to. Kept barely-there so
// the page still reads as one sheet rather than a stack of panels.
export const HAIRLINE = 'rgba(17,19,26,0.07)';

export const INK = {
  strong: '#12131A', // section titles
  base: '#2B2D36', // body / product names
  muted: '#6B7280', // weights, sublabels
  faint: '#9CA3AF', // struck-through MRP, meta
  onDark: '#FFFFFF',
};

export const ACCENT = {
  primary: '#F25000',
  primarySoft: '#FFE9E0',
  success: '#0E9F4F',
  successSoft: '#E7F7EE',
  savings: '#1F8A5B',
};

export const RADIUS = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
};

// A 4pt-derived scale expressed in responsive units so it tracks screen size
// the same way the rest of the app's spacing does.
export const SPACE = {
  xs: hp('0.5%'),
  sm: hp('1%'),
  md: hp('1.6%'),
  lg: hp('2.4%'),
  xl: hp('3.2%'),
};

// Kept as a raw percentage too, so grid column math can divide the content box
// exactly instead of guessing at a cell width.
export const GUTTER_PCT = 4.6;
export const GUTTER = wp(`${GUTTER_PCT}%`);

// A full-bleed hairline between two adjacent dense sections. Inset from the
// gutter so it reads as a typographic rule, not a panel edge.
export const divider = {
  height: StyleSheet.hairlineWidth,
  backgroundColor: HAIRLINE,
  marginHorizontal: GUTTER,
};

// Pastel tile backgrounds for the category grid, cycled by index. Picking from
// a fixed ring (rather than hashing the name) keeps neighbouring tiles visibly
// different, which is what stops the grid reading as a grey slab. Flat fills —
// no shadow, no border.
export const CATEGORY_TINTS = [
  '#FFF0E8',
  '#EEF4FF',
  '#EAF8F0',
  '#FFF6E3',
  '#F6EFFF',
  '#FFEFF3',
  '#E9F7FA',
  '#F2F5E9',
];

export const categoryTint = index =>
  CATEGORY_TINTS[index % CATEGORY_TINTS.length];

export default {
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  GUTTER,
  divider,
  categoryTint,
};
