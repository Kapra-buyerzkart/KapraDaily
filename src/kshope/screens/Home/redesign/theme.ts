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
  heading: '#1A1A1A',
  script: '#0C382E',
  cocoa: '#592626',
  orange: '#F25000',
  orangeSoft: '#FFA87E',
  searchField: '#FFFFFF',
  searchDivider: '#E5E5E5',
  placeholder: '#8E8E8E',
  cardBorder: '#EBE6DF',
  tileBorder: '#E5DFD7',
  recCardBorder: '#EBE6DF',
  muted: '#686868',
  strike: '#8E8E8E',
  white: '#FFFFFF',
  black: '#000000',

  // Kapra Gold & Diamonds Luxury Palette
  darkEmerald: '#0C382E',
  deepEmerald: '#082B22',
  emeraldTint: '#E8F1EE',
  gold: '#B68D40',
  goldMetallic: '#C5A869',
  goldLight: '#F3DFBF',
  goldBorder: '#E3CFA8',
  luxuryCream: '#FBF9F5',
  cardBg: '#F7F5F0',
  pillBg: '#0C382E',
  textDark: '#1A1A1A',
  textMuted: '#686868',
  textFaint: '#9E9E9E',
  borderLight: '#EBE6DF',
  heartRed: '#C45A5A',
  certifiedBadge: '#0C382E',
};

export const TOKEN_COLORS = {
  tint: '#FFF3D4',
  ink: '#8A5A00',
  inkSoft: 'rgba(138,90,0,0.78)',
  edge: 'rgba(138,90,0,0.20)',
};

export const TILE_TINTS = [
  '#F5EFE6',
  '#F7F4EE',
  '#F3ECE3',
  '#F9F6F0',
  '#F5EFE6',
  '#F7F4EE',
];

export const HOME_FONTS = {
  regular: Fonts.cormorantGaramond.regular,
  medium: Fonts.cormorantGaramond.medium,
  semiBold: Fonts.cormorantGaramond.semiBold,
  bold: Fonts.cormorantGaramond.bold,
  light: Fonts.cormorantGaramond.light,
  italic: Fonts.cormorantGaramond.italic,
  semiBoldItalic: Fonts.cormorantGaramond.semiBoldItalic,
  boldItalic: Fonts.cormorantGaramond.boldItalic,
  script: Fonts.madelyn || Fonts.cormorantGaramond.italic,
  lexend: Fonts.lexend.regular,
  lexendMedium: Fonts.lexend.medium,
  lexendBold: Fonts.lexend.bold,
};

export const GUTTER = s(16);

export const SPACE = {
  xxs: s(4),
  xs: s(6),
  sm: s(8),
  md: s(12),
  lg: s(16),
  xl: s(20),
  xxl: s(28),
};

export const SECTION_GAP = s(28);

export const TITLE_GAP = s(14);

export const CARD_GAP = s(12);

export const RADIUS = {
  sm: s(8),
  md: s(12),
  lg: s(16),
  pill: s(999),
};

export const colWidth = (
  columns: number,
  gap: number = CARD_GAP,
  gutter: number = GUTTER,
) => (SCREEN_WIDTH - gutter * 2 - gap * (columns - 1)) / columns;

export { SCREEN_WIDTH };
