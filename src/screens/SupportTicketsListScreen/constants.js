import { LUXURY_COLORS } from './supportLuxuryTheme';

export const SKELETON_COUNT = 3;

export const MAX_STAGGER = 4;

const STATUS_META = {
  open: {
    label: 'Open',
    fg: LUXURY_COLORS.emerald,
    bg: LUXURY_COLORS.emeraldTint,
    border: LUXURY_COLORS.emeraldBorder,
    dot: LUXURY_COLORS.emerald,
  },
  pending: {
    label: 'Pending',
    fg: LUXURY_COLORS.gold,
    bg: LUXURY_COLORS.goldTint,
    border: LUXURY_COLORS.goldBorder,
    dot: LUXURY_COLORS.gold,
  },
  'in progress': {
    label: 'In Progress',
    fg: LUXURY_COLORS.gold,
    bg: LUXURY_COLORS.goldTint,
    border: LUXURY_COLORS.goldBorder,
    dot: LUXURY_COLORS.gold,
  },
  resolved: {
    label: 'Resolved',
    fg: '#2C5E43',
    bg: '#EAF4EE',
    border: '#C8E4D3',
    dot: '#2C5E43',
  },
  closed: {
    label: 'Closed',
    fg: LUXURY_COLORS.textMuted,
    bg: '#F2F1EE',
    border: '#E2E0D8',
    dot: LUXURY_COLORS.textMuted,
  },
};

const PRIORITY_META = {
  high: {
    label: 'High Priority',
    fg: LUXURY_COLORS.danger,
    bg: LUXURY_COLORS.dangerTint,
    border: LUXURY_COLORS.dangerBorder,
    dot: LUXURY_COLORS.danger,
  },
  medium: {
    label: 'Medium Priority',
    fg: LUXURY_COLORS.warning,
    bg: LUXURY_COLORS.warningTint,
    border: LUXURY_COLORS.warningBorder,
    dot: LUXURY_COLORS.warning,
  },
  low: {
    label: 'Low Priority',
    fg: LUXURY_COLORS.emerald,
    bg: LUXURY_COLORS.emeraldTint,
    border: LUXURY_COLORS.emeraldBorder,
    dot: LUXURY_COLORS.emerald,
  },
};

const normalize = value =>
  String(value || '')
    .toLowerCase()
    .trim();

const titleCase = value =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

export const statusMeta = status => {
  const key = normalize(status);
  return (
    STATUS_META[key] || {
      label: titleCase(key) || 'Open',
      fg: LUXURY_COLORS.emerald,
      bg: LUXURY_COLORS.emeraldTint,
      border: LUXURY_COLORS.emeraldBorder,
      dot: LUXURY_COLORS.emerald,
    }
  );
};

export const priorityMeta = priority => {
  const key = normalize(priority);
  if (!key) return null;
  return (
    PRIORITY_META[key] || {
      label: `${titleCase(key)} Priority`,
      fg: LUXURY_COLORS.textSecondary,
      bg: LUXURY_COLORS.well,
      border: LUXURY_COLORS.border,
      dot: LUXURY_COLORS.textMuted,
    }
  );
};
