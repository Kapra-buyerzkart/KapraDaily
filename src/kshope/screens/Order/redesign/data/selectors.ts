import { resolveImageSource } from '../../../Home/redesign/data/mappers';
import type { OrderLineItem, OrderListItem } from '../../../../types/order';

export type OrderBucket = 'active' | 'delivered' | 'cancelled';

export const TRACKER_STEPS = [
  'Confirmed',
  'Shipped',
  'Out for delivery',
  'Delivered',
];

const normalise = (value?: string) =>
  (value || '').toString().trim().toLowerCase();

export const parseItems = (order?: OrderListItem): OrderLineItem[] => {
  const raw = order?.items;
  if (!raw) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw !== 'string') {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const statusBucket = (order?: OrderListItem): OrderBucket => {
  const status = normalise(order?.orderStatusText || order?.orderStatus);
  if (status.includes('cancel') || status.includes('reject')) {
    return 'cancelled';
  }
  if (status.includes('return')) {
    return 'delivered';
  }
  if (status.includes('deliver') && !status.includes('out for')) {
    return status.includes('agent') ? 'active' : 'delivered';
  }
  return 'active';
};

export const trackerStep = (order?: OrderListItem): number => {
  const status = normalise(order?.orderStatusText || order?.orderStatus);
  if (status.includes('deliver') && !status.includes('out for') && !status.includes('agent')) {
    return 3;
  }
  if (status.includes('out for') || status.includes('agent')) {
    return 2;
  }
  if (status.includes('ship') || status.includes('dispatch') || status.includes('packed')) {
    return 1;
  }
  return 0;
};

export const orderTimestamp = (order?: OrderListItem): number => {
  const parsed = order?.orderDate ? Date.parse(order.orderDate) : NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const sortByNewest = (orders: OrderListItem[]): OrderListItem[] =>
  [...orders].sort((a, b) => orderTimestamp(b) - orderTimestamp(a));

export const bucketOrders = (orders?: OrderListItem[] | null) => {
  const safe = Array.isArray(orders) ? orders : [];
  const grouped: Record<OrderBucket, OrderListItem[]> = {
    active: [],
    delivered: [],
    cancelled: [],
  };
  safe.forEach(order => {
    grouped[statusBucket(order)].push(order);
  });
  return {
    active: sortByNewest(grouped.active),
    delivered: sortByNewest(grouped.delivered),
    cancelled: sortByNewest(grouped.cancelled),
  };
};

const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const formatOrderDate = (value?: string): string => {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  const day = `${parsed.getDate()}`.padStart(2, '0');
  return `${day} ${MONTHS[parsed.getMonth()]} ${parsed.getFullYear()}`;
};

export const formatAmount = (value?: number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '₹0/-';
  }
  const fixed = Number.isInteger(value) ? `${value}` : value.toFixed(2);
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₹${fraction ? `${grouped}.${fraction}` : grouped}/-`;
};

export const formatOrderNumber = (value?: string | number): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return `#${value}`.replace('##', '#');
};

export const itemCountLabel = (count: number): string =>
  `${count} ${count === 1 ? 'Item' : 'Items'}`;

export const primaryItem = (order?: OrderListItem): OrderLineItem | undefined =>
  parseItems(order)[0];

export const lineItemImage = (item?: OrderLineItem) =>
  resolveImageSource(item?.featuredImage);

export const detailParams = (order: OrderListItem) => {
  const item = primaryItem(order);
  return {
    order,
    selectedItem: item
      ? { ...item, orderId: order?.orderId, orderNumber: order?.orderNumber }
      : {},
  };
};
