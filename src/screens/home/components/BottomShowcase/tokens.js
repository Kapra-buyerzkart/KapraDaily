import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RADIUS, SPACE, GUTTER } from '@/styles/homeTheme';

export const PANEL_RADIUS = RADIUS.xl;
export const PANEL_INSET = GUTTER;
export const PANEL_PAD = SPACE.base;

export const CARD_WIDTH = wp('40%');
export const CARD_GAP = SPACE.md;
export const CARD_SNAP = CARD_WIDTH + CARD_GAP;
export const CARD_RADIUS = RADIUS.lg;
export const STAGE_HEIGHT = wp('34%');

export const HALO_SIZE = wp('30%');

export const PROGRESS_WIDTH = wp('18%');
export const PROGRESS_HEIGHT = 3;

export const PANEL = {
  colors: ['#FFF4EE', '#FFFBF8', '#FFFFFF'],
  locations: [0, 0.42, 1],
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
};

export const PANEL_EDGE = 'rgba(242,80,0,0.14)';

export const STAGE_TINT = {
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const ACCENT_SOFT = 'rgba(242,80,0,0.10)';
export const ACCENT_EDGE = 'rgba(242,80,0,0.28)';

export const DEFAULTS = {
  eyebrow: 'CURATED PICKS',
  title: 'Bathroom Essentials',
  subtitle: 'Everything your washroom needs',
  cta: 'See all',
};
