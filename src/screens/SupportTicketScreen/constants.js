import { INK, SURFACE } from '@/styles/homeTheme';

export const PRIORITY_OPTIONS = [
  {
    key: 'normal',
    label: 'Normal',
    icon: 'clock-outline',
    tint: INK.base,
    soft: SURFACE.sunken,
    hint: 'General question — we will get to it in turn.',
  },
  {
    key: 'urgent',
    label: 'Urgent',
    icon: 'flash-outline',
    tint: '#B27A00',
    soft: '#FBF3E0',
    hint: 'Time-sensitive — needs a quicker look.',
  },
  {
    key: 'high',
    label: 'High',
    icon: 'alert-outline',
    tint: '#C2352B',
    soft: '#FDECEA',
    hint: 'Something is blocked or badly wrong.',
  },
];

export const DEFAULT_PRIORITY = PRIORITY_OPTIONS[0].key;

export const priorityOption = key =>
  PRIORITY_OPTIONS.find(option => option.key === key) || PRIORITY_OPTIONS[0];

export const MESSAGE_LINES = 5;
