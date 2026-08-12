import { ACCENT } from '@/styles/homeTheme';

export const ORDER_GROUP = {
  active: 'active',
  delivered: 'delivered',
  cancelled: 'cancelled',
  pending: 'pending',
};

export const TRACK_STEPS = ['Placed', 'Packed', 'On the way', 'Delivered'];

const TONE = {
  running: {
    fg: '#0B63CE',
    bg: '#EAF2FE',
    border: 'rgba(11,99,206,0.18)',
  },
  moving: {
    fg: ACCENT.primary,
    bg: ACCENT.primarySoft,
    border: 'rgba(242,80,0,0.20)',
  },
  done: {
    fg: ACCENT.successText,
    bg: ACCENT.successSoft,
    border: 'rgba(11,122,61,0.18)',
  },
  failed: {
    fg: '#C0362C',
    bg: '#FDECEA',
    border: 'rgba(192,54,44,0.18)',
  },
  waiting: {
    fg: '#B45309',
    bg: '#FFF6E6',
    border: 'rgba(180,83,9,0.18)',
  },
};

const CATALOG = [
  {
    key: 'cancelled',
    match: s => s.includes('cancel') || s.includes('reject'),
    label: 'Cancelled',
    group: ORDER_GROUP.cancelled,
    tone: TONE.failed,
    icon: 'close-circle',
    step: -1,
  },
  {
    key: 'returned',
    match: s => s.includes('return') || s.includes('refund'),
    label: 'Returned',
    group: ORDER_GROUP.cancelled,
    tone: TONE.failed,
    icon: 'arrow-undo-circle',
    step: -1,
  },
  {
    key: 'failed',
    match: s => s.includes('fail'),
    label: 'Payment failed',
    group: ORDER_GROUP.cancelled,
    tone: TONE.failed,
    icon: 'alert-circle',
    step: -1,
  },
  {
    key: 'pending',
    match: s => s.includes('pending') || s.includes('await'),
    label: 'Payment pending',
    group: ORDER_GROUP.pending,
    tone: TONE.waiting,
    icon: 'time',
    step: 0,
  },
  {
    key: 'delivered',
    match: s => s.includes('deliver') && !s.includes('out'),
    label: 'Delivered',
    group: ORDER_GROUP.delivered,
    tone: TONE.done,
    icon: 'checkmark-circle',
    step: 3,
  },
  {
    key: 'onTheWay',
    match: s =>
      s.includes('out') || s.includes('dispatch') || s.includes('assign'),
    label: 'On the way',
    group: ORDER_GROUP.active,
    tone: TONE.moving,
    icon: 'bicycle',
    step: 2,
  },
  {
    key: 'packed',
    match: s => s.includes('pack') || s.includes('ready'),
    label: 'Packed',
    group: ORDER_GROUP.active,
    tone: TONE.running,
    icon: 'cube',
    step: 1,
  },
  {
    key: 'accepted',
    match: s => s.includes('accept') || s.includes('confirm'),
    label: 'Confirmed',
    group: ORDER_GROUP.active,
    tone: TONE.running,
    icon: 'checkmark-done-circle',
    step: 0,
  },
];

const FALLBACK = {
  key: 'placed',
  label: 'Order placed',
  group: ORDER_GROUP.active,
  tone: TONE.running,
  icon: 'receipt',
  step: 0,
};

export const resolveOrderStatus = order => {
  const raw = (order?.orderStatusText || order?.status || '').toString();
  const normalized = raw.toLowerCase().trim();
  const found = CATALOG.find(entry => entry.match(normalized));
  const base = found || FALLBACK;
  return { ...base, label: raw ? raw.trim() : base.label, raw: normalized };
};

export const isLiveOrder = status =>
  status.group === ORDER_GROUP.active || status.group === ORDER_GROUP.pending;
