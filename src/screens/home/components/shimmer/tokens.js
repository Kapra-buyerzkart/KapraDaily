import { CART_COLORS, CART_RADIUS, CART_SPACING } from '@/styles/cartTheme';
import { GUTTER, TYPE } from '@/styles/homeTheme';

export const SHIMMER_DURATION = 1400;

export const BONE = {
  base: '#E7E9EE',
  soft: '#EFF1F5',
  well: CART_COLORS.well,
};

export const SWEEP = [
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0.92)',
  'rgba(255,255,255,0)',
];

export const BONE_RADIUS = {
  bar: CART_RADIUS.xs,
  block: CART_RADIUS.sm,
  media: CART_RADIUS.productCard,
  card: CART_RADIUS.card,
  pill: CART_RADIUS.pill,
};

const bar = fontSize => Math.round(fontSize * 0.78);

export const BONE_HEIGHT = {
  micro: bar(TYPE.micro.fontSize),
  caption: bar(TYPE.caption.fontSize),
  label: bar(TYPE.label.fontSize),
  body: bar(TYPE.body.fontSize),
  heading: bar(TYPE.heading.fontSize),
  title: bar(TYPE.title.fontSize),
};

export const SURFACE = {
  fill: CART_COLORS.card,
  edge: CART_COLORS.border,
  radius: CART_RADIUS.card,
};

export { GUTTER, CART_SPACING as SPACING };
