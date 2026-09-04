import {
  UI_COLORS,
  UI_ELEVATION,
  UI_GUTTER,
  UI_RADIUS,
  UI_SPACING,
} from '../../theme/tokens';

const TOKEN_INK = '#8A5A00';
const TOKEN_TINT = '#FFF3D4';

export const PALETTE = {
  gold: '#F6C445',
  goldDeep: '#B8860B',
  goldTint: '#FDF6E3',
  token: TOKEN_INK,
  tokenTint: TOKEN_TINT,
  orange: UI_COLORS.primary,
  orangeTint: UI_COLORS.primaryTint,
  surface: UI_COLORS.card,
  canvas: UI_COLORS.canvas,
  well: UI_COLORS.well,
  line: UI_COLORS.border,
  lineStrong: UI_COLORS.borderStrong,
  textPrimary: UI_COLORS.textPrimary,
  textSecondary: UI_COLORS.textSecondary,
  textMuted: UI_COLORS.textMuted,
  textFaint: UI_COLORS.textFaint,
  credit: UI_COLORS.successDeep,
  creditTint: UI_COLORS.successTint,
  debit: UI_COLORS.danger,
  debitTint: UI_COLORS.dangerTint,
  disabled: UI_COLORS.well,
  disabledText: UI_COLORS.textFaint,
  selected: UI_COLORS.textPrimary,
  selectedTint: 'rgba(17,19,26,0.06)',
  overlay: UI_COLORS.overlay,
};

export const RADIUS = UI_RADIUS;
export const SPACING = UI_SPACING;
export const GUTTER = UI_GUTTER;

export const SHADOW = {
  card: UI_ELEVATION.card,
  float: UI_ELEVATION.raised,
  bar: UI_ELEVATION.bar,
};
