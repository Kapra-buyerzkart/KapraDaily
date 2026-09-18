import { resolveImageSource } from '../../../Home/redesign/data/mappers';
import type { OrderLineItem, OrderListItem } from '../../../../types/order';

export type OrderBucket =
  | 'all'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'active'; // keep 'active' for backwards compatibility

export type OrderStatusType =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

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

export const getOrderStatusType = (order?: OrderListItem): OrderStatusType => {
  const status = normalise(order?.orderStatusText || order?.orderStatus);
  if (status.includes('cancel') || status.includes('reject')) {
    return 'cancelled';
  }
  if (
    (status.includes('deliver') || status.includes('return')) &&
    !status.includes('out for') &&
    !status.includes('agent')
  ) {
    return 'delivered';
  }
  if (
    status.includes('ship') ||
    status.includes('dispatch') ||
    status.includes('transit') ||
    status.includes('out for') ||
    status.includes('agent')
  ) {
    return 'shipped';
  }
  return 'processing';
};

export const statusBucket = (order?: OrderListItem): 'active' | 'delivered' | 'cancelled' => {
  const statusType = getOrderStatusType(order);
  if (statusType === 'cancelled') return 'cancelled';
  if (statusType === 'delivered') return 'delivered';
  return 'active';
};

export const trackerStep = (order?: OrderListItem): number => {
  const status = normalise(order?.orderStatusText || order?.orderStatus);
  if (
    status.includes('deliver') &&
    !status.includes('out for') &&
    !status.includes('agent')
  ) {
    return 3;
  }
  if (status.includes('out for') || status.includes('agent')) {
    return 2;
  }
  if (
    status.includes('ship') ||
    status.includes('dispatch') ||
    status.includes('packed')
  ) {
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
  const grouped: Record<string, OrderListItem[]> = {
    all: safe,
    active: [],
    processing: [],
    shipped: [],
    delivered: [],
    cancelled: [],
  };
  safe.forEach(order => {
    const type = getOrderStatusType(order);
    grouped[type].push(order);
    if (type === 'processing' || type === 'shipped') {
      grouped.active.push(order);
    }
  });
  return {
    all: sortByNewest(grouped.all),
    active: sortByNewest(grouped.active),
    processing: sortByNewest(grouped.processing),
    shipped: sortByNewest(grouped.shipped),
    delivered: sortByNewest(grouped.delivered),
    cancelled: sortByNewest(grouped.cancelled),
  };
};

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatOrderDateCard = (value?: string): string => {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const day = parsed.getDate();
  return `${day} ${MONTHS_SHORT[parsed.getMonth()]} ${parsed.getFullYear()}`;
};

export const formatOrderDate = (value?: string): string => {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  const day = `${parsed.getDate()}`.padStart(2, '0');
  return `${day} ${MONTHS_SHORT[parsed.getMonth()].toLowerCase()} ${parsed.getFullYear()}`;
};

export const formatAmountCurrency = (value?: number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '₹0';
  }
  const fixed = Math.round(value);
  return `₹${fixed.toLocaleString('en-IN')}`;
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

export const formatOrderId = (value?: string | number): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  const clean = `${value}`.replace(/^#+/, '');
  return `Order ID #${clean}`;
};

export const formatOrderNumber = (value?: string | number): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return `#${value}`.replace('##', '#');
};

export const formatItemCount = (count?: number): string => {
  const n = Math.max(1, count || 1);
  return `${n} ${n === 1 ? 'item' : 'items'}`;
};

export const itemCountLabel = (count: number): string =>
  `${count} ${count === 1 ? 'Item' : 'Items'}`;

export const primaryItem = (order?: OrderListItem): OrderLineItem | undefined =>
  parseItems(order)[0];

export const lineItemImage = (item?: OrderLineItem) => {
  if (!item?.featuredImage) return undefined;
  if (typeof item.featuredImage === 'number') return item.featuredImage;
  return resolveImageSource(item.featuredImage);
};

export const getDeliveryInfo = (
  order?: OrderListItem,
): { label: string; date: string } => {
  if (order?.deliveryDate && order?.deliveryLabel) {
    return { label: order.deliveryLabel, date: order.deliveryDate };
  }
  if (order?.deliveryDate) {
    const type = getOrderStatusType(order);
    return {
      label:
        type === 'delivered'
          ? 'Delivered on'
          : type === 'cancelled'
          ? 'Cancelled on'
          : 'Est. Delivery',
      date: order.deliveryDate,
    };
  }

  const type = getOrderStatusType(order);
  const orderDate = order?.orderDate ? new Date(order.orderDate) : new Date();

  if (type === 'delivered') {
    return {
      label: 'Delivered on',
      date: formatOrderDateCard(order?.orderDate),
    };
  }

  if (type === 'cancelled') {
    return {
      label: 'Cancelled on',
      date: formatOrderDateCard(order?.orderDate),
    };
  }

  // Processing or Shipped: estimate 3 - 5 days after order date
  const estStart = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const estEnd = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const dateStr = `${estStart.getDate()} ${MONTHS_SHORT[estStart.getMonth()]} - ${estEnd.getDate()} ${MONTHS_SHORT[estEnd.getMonth()]} ${estEnd.getFullYear()}`;

  return {
    label: 'Est. Delivery',
    date: dateStr,
  };
};

export const detailParams = (order: OrderListItem) => {
  const item = primaryItem(order);
  return {
    orderId: order?.orderId,
    order,
    selectedItem: item
      ? { ...item, orderId: order?.orderId, orderNumber: order?.orderNumber }
      : {},
  };
};
