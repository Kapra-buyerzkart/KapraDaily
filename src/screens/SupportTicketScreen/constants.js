import { LUXURY_COLORS } from '../SupportTicketsListScreen/supportLuxuryTheme';

export const PRIORITY_OPTIONS = [
  {
    key: 'normal',
    label: 'Normal',
    icon: 'clock-outline',
    tint: LUXURY_COLORS.emerald,
    soft: LUXURY_COLORS.emeraldTint,
    border: LUXURY_COLORS.emeraldBorder,
    hint: 'General question — we will review and resolve it promptly.',
  },
  {
    key: 'urgent',
    label: 'Urgent',
    icon: 'flash-outline',
    tint: LUXURY_COLORS.gold,
    soft: LUXURY_COLORS.goldTint,
    border: LUXURY_COLORS.goldBorder,
    hint: 'Time-sensitive matter — priority queue attention.',
  },
  {
    key: 'high',
    label: 'High',
    icon: 'alert-outline',
    tint: LUXURY_COLORS.danger,
    soft: LUXURY_COLORS.dangerTint,
    border: LUXURY_COLORS.dangerBorder,
    hint: 'Critical inquiry or urgent order issue requiring immediate review.',
  },
];

export const DEFAULT_PRIORITY = PRIORITY_OPTIONS[0].key;

export const priorityOption = key =>
  PRIORITY_OPTIONS.find(option => option.key === key) || PRIORITY_OPTIONS[0];

export const MESSAGE_LINES = 5;
