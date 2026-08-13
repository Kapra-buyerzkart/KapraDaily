import { STATUS_TONE } from '../theme';

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

const CATALOG = {
  pending: {
    title: 'Payment pending',
    caption: 'Complete the payment to confirm this order',
    badge: 'ACTION NEEDED',
    icon: 'hourglass-outline',
    tone: STATUS_TONE.waiting,
    completedThrough: -1,
    live: true,
  },
  placed: {
    title: 'Order placed',
    caption: 'Waiting for the store to accept',
    badge: 'LIVE ORDER',
    icon: 'receipt',
    tone: STATUS_TONE.progress,
    completedThrough: 0,
    live: true,
  },
  accepted: {
    title: 'Order confirmed',
    caption: 'The store is picking and packing your items',
    badge: 'LIVE ORDER',
    icon: 'basket',
    tone: STATUS_TONE.progress,
    completedThrough: 1,
    live: true,
  },
  packed: {
    title: 'Packed and ready',
    caption: 'Waiting for a delivery partner to pick it up',
    badge: 'LIVE ORDER',
    icon: 'cube',
    tone: STATUS_TONE.progress,
    completedThrough: 2,
    live: true,
  },
  assigned: {
    title: 'Partner assigned',
    caption: 'Your delivery partner is collecting the order',
    badge: 'LIVE ORDER',
    icon: 'bicycle',
    tone: STATUS_TONE.progress,
    completedThrough: 2,
    live: true,
  },
  dispatched: {
    title: 'Arriving soon',
    caption: 'Your order is out for delivery',
    badge: 'ON THE WAY',
    icon: 'bicycle',
    tone: STATUS_TONE.moving,
    completedThrough: 3,
    live: true,
  },
  delivered: {
    title: 'Delivered',
    caption: 'Hope everything arrived just right',
    badge: 'COMPLETED',
    icon: 'checkmark-done',
    tone: STATUS_TONE.done,
    completedThrough: 4,
    live: false,
  },
  cancelled: {
    title: 'Order cancelled',
    caption: 'This order was cancelled',
    badge: 'CANCELLED',
    icon: 'close-circle',
    tone: STATUS_TONE.failed,
    completedThrough: -1,
    live: false,
  },
  returned: {
    title: 'Order returned',
    caption: 'A return was raised for this order',
    badge: 'RETURNED',
    icon: 'arrow-undo-circle',
    tone: STATUS_TONE.failed,
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
