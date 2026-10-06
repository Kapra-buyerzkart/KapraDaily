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

export const TOKEN = {
  tint: '#FFF3D4',
  ink: '#8A5A00',
  inkSoft: 'rgba(138,90,0,0.78)',
  edge: 'rgba(138,90,0,0.20)',
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
  radius: RADIUS.pill,
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

export const CATEGORY_SELECT = {
  rail: ACCENT.action,
  tint: ACCENT.actionSoft,
  edge: 'rgba(49,46,129,0.35)',
  text: ACCENT.actionDeep,
};

export const CATEGORY_FOCUS = {
  track: '#F4F5F8',
  trackEdge: 'rgba(17,19,26,0.06)',
  card: SURFACE.base,
  cardEdge: 'rgba(17,19,26,0.07)',
  well: '#E9EAF0',
  wellEdge: 'rgba(49,46,129,0.18)',
  shadow: '#0B1020',
};

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

// -------------------------------------------------------------
// Backend Color Scheme & Dynamic Theming
// -------------------------------------------------------------

export const DEFAULT_HOME_COLOR_SCHEME = {
  primary: '#889C54',
  secondary: '#97A965',
  gradient: ['#97A965', '#91A45F', '#889C54'],
  accent: '#FF5722',
  accentSoft: '#FFF0EB',
  background: '#FFFFFF',
  containerBackground: '#889C54',
  tabActive: '#000000',
  tabStroke: '#000000',
  tabBackground: ['#E1E8CD', '#EFF4E3', '#FFFFFF'],
  cartBackground: '#1E3A2F',
  searchIcon: '#889C54',
};

export const normalizeHex = (hex, fallback = '#889C54') => {
  if (!hex || typeof hex !== 'string') return fallback;
  const clean = hex.trim();
  const prefixed = clean.startsWith('#') ? clean : `#${clean}`;
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(prefixed)
    ? prefixed
    : fallback;
};

export const adjustBrightness = (hex, percent) => {
  const norm = normalizeHex(hex, '#889C54');
  const clean = norm.replace('#', '');
  const fullHex = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean.slice(0, 6);
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return norm;
  const factor = Math.round((255 * percent) / 100);
  let r = (num >> 16) + factor;
  let g = ((num >> 8) & 0x00ff) + factor;
  let b = (num & 0x0000ff) + factor;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const hexToRgba = (hex, alpha = 1) => {
  const norm = normalizeHex(hex, '#889C54');
  const clean = norm.replace('#', '');
  const fullHex = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean.slice(0, 6);
  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return `rgba(136, 156, 84, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const resolveHomeColorScheme = (rawScheme) => {
  if (!rawScheme) return DEFAULT_HOME_COLOR_SCHEME;

  let scheme = rawScheme;
  if (typeof rawScheme === 'string') {
    const trimmed = rawScheme.trim();
    if (trimmed.startsWith('#') || /^[0-9a-fA-F]{6}$/.test(trimmed)) {
      scheme = { primary: trimmed };
    } else {
      try {
        scheme = JSON.parse(trimmed);
      } catch {
        scheme = { primary: trimmed };
      }
    }
  }

  if (typeof scheme !== 'object' || scheme === null) {
    return DEFAULT_HOME_COLOR_SCHEME;
  }

  const primaryRaw =
    scheme.primary ||
    scheme.primaryColor ||
    scheme.primary_color ||
    scheme.headerColor ||
    scheme.header_color ||
    scheme.main;

  const primary = primaryRaw
    ? normalizeHex(primaryRaw, DEFAULT_HOME_COLOR_SCHEME.primary)
    : DEFAULT_HOME_COLOR_SCHEME.primary;

  const secondaryRaw =
    scheme.secondary ||
    scheme.secondaryColor ||
    scheme.secondary_color;
  const secondary = secondaryRaw
    ? normalizeHex(secondaryRaw, adjustBrightness(primary, 8))
    : adjustBrightness(primary, 8);

  const rawGradient =
    scheme.gradient ||
    scheme.headerGradient ||
    scheme.header_gradient ||
    scheme.colors;

  let gradient = DEFAULT_HOME_COLOR_SCHEME.gradient;
  if (Array.isArray(rawGradient) && rawGradient.length >= 2) {
    gradient = rawGradient.map(c => normalizeHex(c, primary));
  } else if (typeof rawGradient === 'string') {
    const parts = rawGradient.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      gradient = parts.map(c => normalizeHex(c, primary));
    } else {
      gradient = [
        adjustBrightness(primary, 10),
        adjustBrightness(primary, 5),
        primary,
      ];
    }
  } else if (primaryRaw) {
    gradient = [
      adjustBrightness(primary, 10),
      adjustBrightness(primary, 5),
      primary,
    ];
  }

  const accentRaw =
    scheme.accent ||
    scheme.accentColor ||
    scheme.accent_color;
  const accent = accentRaw
    ? normalizeHex(accentRaw, DEFAULT_HOME_COLOR_SCHEME.accent)
    : DEFAULT_HOME_COLOR_SCHEME.accent;

  const backgroundRaw =
    scheme.background ||
    scheme.backgroundColor ||
    scheme.background_color;
  const background = backgroundRaw
    ? normalizeHex(backgroundRaw, '#FFFFFF')
    : '#FFFFFF';

  const tabActiveRaw =
    scheme.tabActive ||
    scheme.tabActiveColor ||
    scheme.tab_active ||
    scheme.activeTab ||
    scheme.tabColor;
  const tabActive = tabActiveRaw
    ? normalizeHex(tabActiveRaw, '#000000')
    : '#000000';

  const tabBackgroundRaw =
    scheme.tabBackground ||
    scheme.tab_background ||
    scheme.categoryBackground;
  let tabBackground = DEFAULT_HOME_COLOR_SCHEME.tabBackground;
  if (Array.isArray(tabBackgroundRaw) && tabBackgroundRaw.length >= 2) {
    tabBackground = tabBackgroundRaw.map(c => normalizeHex(c, '#FFFFFF'));
  } else if (primaryRaw) {
    tabBackground = [
      adjustBrightness(primary, 70),
      adjustBrightness(primary, 82),
      '#FFFFFF',
    ];
  }

  const cartBgRaw =
    scheme.cartBackground ||
    scheme.cart_background ||
    scheme.cartBg;
  const cartBackground = cartBgRaw
    ? normalizeHex(cartBgRaw, adjustBrightness(primary, -60))
    : adjustBrightness(primary, -60);

  return {
    primary,
    secondary,
    gradient,
    accent,
    accentSoft: hexToRgba(accent, 0.12),
    background,
    containerBackground: primary,
    tabActive,
    tabStroke: tabActive,
    tabBackground,
    cartBackground,
    searchIcon: primary,
  };
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
  CATEGORY_SELECT,
  CATEGORY_FOCUS,
  EXPLORE_PANEL,
  EXPLORE_PANEL_EDGE,
  CATEGORY_TINTS,
  categoryTint,
  HERO_TOP,
  HERO_GRADIENT,
  HERO_LIFT,
  DEFAULT_HOME_COLOR_SCHEME,
  resolveHomeColorScheme,
  normalizeHex,
  adjustBrightness,
  hexToRgba,
};
