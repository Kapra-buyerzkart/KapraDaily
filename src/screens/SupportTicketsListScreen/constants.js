import { ACCENT, INK, SURFACE } from '@/styles/homeTheme';

export const SKELETON_COUNT = 3;

export const MAX_STAGGER = 4;

const STATUS_META = {
  open: { label: 'Open', fg: '#1D4ED8', bg: '#EDF2FF' },
  pending: { label: 'Pending', fg: '#8A6100', bg: '#FBF3E0' },
  'in progress': { label: 'In progress', fg: '#8A6100', bg: '#FBF3E0' },
  resolved: {
    label: 'Resolved',
    fg: ACCENT.successText,
    bg: ACCENT.successSoft,
  },
  closed: { label: 'Closed', fg: ACCENT.successText, bg: ACCENT.successSoft },
};

const PRIORITY_META = {
  high: { label: 'High priority', dot: ACCENT.discount },
  medium: { label: 'Medium priority', dot: '#B27A00' },
  low: { label: 'Low priority', dot: ACCENT.success },
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
      fg: INK.base,
      bg: SURFACE.sunken,
    }
  );
};

export const priorityMeta = priority => {
  const key = normalize(priority);
  if (!key) return null;
  return (
    PRIORITY_META[key] || {
      label: `${titleCase(key)} priority`,
      dot: INK.faint,
    }
  );
};
