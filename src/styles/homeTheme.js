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

// The search field, as one object across two screens.
//
// Home's bar and the Search screen's input are the same control: pressing the
// former pushes the latter, and the transition only reads as that object moving
// if the geometry matches on both sides. It didn't — Home carried a
// width-derived radius (wp('5.5%'), a true pill on a tablet and a soft rect on
// a small phone) that also interpolated by ~4pt on scroll, against Search's
// fixed RADIUS.lg. Both now take their shape from here.
//
// Height is fixed rather than a percentage for the same reason it is on Search:
// it is a touch target before it is a proportion of the screen, and hp('5.4%')
// fell under the 44pt minimum on short devices.
//
// 16 rather than the near-pill it replaces: at 93% of a full pill the old
// corner read as a miss rather than a decision. A committed rounded rect is the
// current quick-commerce idiom and it lets the bar sit under banner artwork
// without floating off it as a lozenge.
export const SEARCH_FIELD = {
  height: 48,
  radius: RADIUS.md,
};

// The vertical rule inside the field, and the clear button's disc. HAIRLINE is
// tuned for a full-bleed horizontal rule — over 20pt of vertical run at 5%
// alpha it disappears entirely, so both sit a little heavier.
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

// A full-bleed hairline between two adjacent dense sections. Inset from the
// gutter so it reads as a typographic rule, not a panel edge.
export const divider = {
  height: StyleSheet.hairlineWidth,
  backgroundColor: HAIRLINE,
  marginHorizontal: GUTTER,
};

export const CATEGORY_WELL = '#F7F4F1';

// Shop-by-category wells. One flat neutral across the whole grid made eight
// tiles read as one grey slab; a light tint per tile gives each category its
// own patch of colour without the art having to carry it. All eight sit at the
// same very low saturation and near-identical luminance, so the row still reads
// as a set and cut-out merchandise photography (which is mostly light) keeps
// its edge against them. Kept pale enough that INK.base labels below and any
// dark packaging on top stay well clear of contrast minimums.
export const CATEGORY_TINTS = [
  '#FFF0E8', // peach — the brand accent, softened
  '#EAF4FF', // sky
  '#EAF7EE', // mint
  '#FFF6E0', // butter
  '#F3EDFF', // lilac
  '#FFECEF', // blush
  '#E7F6F6', // aqua
  '#F1F3E7', // sage
];

// Indexed by grid position rather than by name: category order is stable within
// a render of the home feed, and hashing the label instead would let a rename
// upstream silently recolour half the grid.
export const categoryTint = index =>
  CATEGORY_TINTS[index % CATEGORY_TINTS.length];

// The account flow's hero wash. Home is a catalogue and stays flat white — the
// merchandise supplies its colour. Profile and Edit Profile have no merchandise
// on them, so they open on a warm block that carries the identity and then
// dissolves into the same white sheet. Defined once here because the two
// screens push onto each other: a shade of difference between them would show
// up as a flicker at the top of the transition.
export const HERO_TOP = '#FFF2E8';
export const HERO_GRADIENT = [HERO_TOP, '#FFFAF6', CANVAS];

// The shadow those pages use to lift a white card off the peach. Warm and
// shallow — a neutral shadow leaves a grey halo on a tint.
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
  CATEGORY_TINTS,
  categoryTint,
  HERO_TOP,
  HERO_GRADIENT,
  HERO_LIFT,
};
