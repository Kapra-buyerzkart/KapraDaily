export const FOCUS_FADE = { duration: 160 };
export const METER_FADE = { duration: 220 };
export const METER_SEGMENTS = 4;

export const STRENGTH_COPY = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export const RULES = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: value => value.length >= 8,
  },
  {
    key: 'letter',
    label: 'A letter',
    test: value => /[A-Za-z]/.test(value),
  },
  {
    key: 'number',
    label: 'A number',
    test: value => /[0-9]/.test(value),
  },
];
