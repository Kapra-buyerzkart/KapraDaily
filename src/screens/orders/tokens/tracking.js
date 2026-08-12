import { ACCENT, INK } from '@/styles/homeTheme';

export const TRACK_STAGES = [
  {
    key: 'placed',
    label: 'Order placed',
    hint: 'We have received your order',
    icon: 'receipt-outline',
  },
  {
    key: 'accepted',
    label: 'Order confirmed',
    hint: 'The store is preparing your items',
    icon: 'checkmark-done-outline',
  },
  {
    key: 'packed',
    label: 'Packed',
    hint: 'Your bag is sealed and ready to leave',
    icon: 'cube-outline',
  },
  {
    key: 'dispatched',
    label: 'Out for delivery',
    hint: 'Heading to your address',
    icon: 'bicycle-outline',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    hint: 'Handed over at your doorstep',
    icon: 'home-outline',
  },
];

const TONE = {
  brand: {
    fg: ACCENT.primary,
    bg: '#FFF1E9',
    border: 'rgba(242,80,0,0.20)',
    wash: ['#FFF3EC', '#FFFFFF'],
  },
  info: {
    fg: '#0B63CE',
    bg: '#EAF2FE',
    border: 'rgba(11,99,206,0.18)',
    wash: ['#EDF4FE', '#FFFFFF'],
  },
  success: {
    fg: ACCENT.successText,
    bg: ACCENT.successSoft,
    border: 'rgba(11,122,61,0.18)',
    wash: ['#E9F8F0', '#FFFFFF'],
  },
  danger: {
    fg: '#C0362C',
    bg: '#FDECEA',
    border: 'rgba(192,54,44,0.18)',
    wash: ['#FDEEEC', '#FFFFFF'],
  },
  waiting: {
    fg: '#B45309',
    bg: '#FFF6E6',
    border: 'rgba(180,83,9,0.18)',
    wash: ['#FFF7EA', '#FFFFFF'],
  },
};

const CATALOG = {
  pending: {
    title: 'Payment pending',
    caption: 'Complete the payment to confirm this order',
    badge: 'ACTION NEEDED',
    icon: 'hourglass-outline',
    tone: TONE.waiting,
    completedThrough: -1,
    live: true,
  },
  placed: {
    title: 'Order placed',
    caption: 'Waiting for the store to accept',
    badge: 'LIVE ORDER',
    icon: 'receipt',
    tone: TONE.info,
    completedThrough: 0,
    live: true,
  },
  accepted: {
    title: 'Order confirmed',
    caption: 'The store is picking and packing your items',
    badge: 'LIVE ORDER',
    icon: 'basket',
    tone: TONE.info,
    completedThrough: 1,
    live: true,
  },
  packed: {
    title: 'Packed and ready',
    caption: 'Waiting for a delivery partner to pick it up',
    badge: 'LIVE ORDER',
    icon: 'cube',
    tone: TONE.brand,
    completedThrough: 2,
    live: true,
  },
  assigned: {
    title: 'Partner assigned',
    caption: 'Your delivery partner is collecting the order',
    badge: 'LIVE ORDER',
    icon: 'bicycle',
    tone: TONE.brand,
    completedThrough: 2,
    live: true,
  },
  dispatched: {
    title: 'Arriving soon',
    caption: 'Your order is out for delivery',
    badge: 'ON THE WAY',
    icon: 'bicycle',
    tone: TONE.brand,
    completedThrough: 3,
    live: true,
  },
  delivered: {
    title: 'Delivered',
    caption: 'Hope everything arrived just right',
    badge: 'COMPLETED',
    icon: 'checkmark-done',
    tone: TONE.success,
    completedThrough: 4,
    live: false,
  },
  cancelled: {
    title: 'Order cancelled',
    caption: 'This order was cancelled',
    badge: 'CANCELLED',
    icon: 'close-circle',
    tone: TONE.danger,
    completedThrough: -1,
    live: false,
  },
  returned: {
    title: 'Order returned',
    caption: 'A return was raised for this order',
    badge: 'RETURNED',
    icon: 'arrow-undo-circle',
    tone: TONE.danger,
    completedThrough: 4,
    live: false,
  },
};

const FALLBACK = CATALOG.placed;

export const resolveTracking = status => {
  const entry = CATALOG[status] || FALLBACK;
  const activeIndex =
    entry.completedThrough + 1 < TRACK_STAGES.length
      ? entry.completedThrough + 1
      : -1;
  return { ...entry, key: status, activeIndex };
};

export const CANCELLED_STATUSES = ['cancelled', 'returned'];

export const CANCELLABLE_STATUSES = ['pending', 'placed', 'accepted', 'packed'];

export const AWAITING_PARTNER_STATUSES = [
  'pending',
  'placed',
  'accepted',
  'packed',
];

export const INVOICE_STATUSES = [
  'packed',
  'assigned',
  'dispatched',
  'delivered',
];

export const paymentLabelOf = method => {
  if (!method) return 'Cash on delivery';
  const normalized = method.toUpperCase();
  if (normalized === 'COD') return 'Cash on delivery';
  if (normalized === 'ONLINE' || normalized === 'UPI') return 'Online payment';
  return method;
};

export const isOnlineMethod = method =>
  ['online', 'prepaid', 'razorpay', 'upi'].includes(
    (method || '').toLowerCase(),
  );

export const STAR_TONE = {
  on: '#F2C94C',
  off: '#DDE1E7',
};

export const CHIP_TONE = {
  brand: { bg: '#FFF1E9', fg: ACCENT.primary },
  success: { bg: ACCENT.successSoft, fg: ACCENT.successText },
  info: { bg: '#EAF2FE', fg: '#0B63CE' },
  neutral: { bg: '#F1F2F5', fg: INK.muted },
};
