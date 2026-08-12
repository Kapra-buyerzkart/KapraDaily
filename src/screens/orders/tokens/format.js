const MONTHS = [
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

const clockOf = date =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const startOfDay = date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatOrderDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const now = new Date();
  const dayGap = Math.round(
    (startOfDay(now) - startOfDay(date)) / (24 * 60 * 60 * 1000),
  );

  if (dayGap === 0) return `Today · ${clockOf(date)}`;
  if (dayGap === 1) return `Yesterday · ${clockOf(date)}`;
  if (dayGap < 7) return `${dayGap} days ago · ${clockOf(date)}`;

  const stamp = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  const withYear =
    date.getFullYear() === now.getFullYear()
      ? stamp
      : `${stamp} ${date.getFullYear()}`;
  return `${withYear} · ${clockOf(date)}`;
};

export const formatMoney = value => {
  const amount = Number(value ?? 0);
  return `₹${(Number.isNaN(amount) ? 0 : amount).toFixed(2)}`;
};

export const formatItemCount = count => {
  const n = Number(count ?? 0);
  return `${n} ${n === 1 ? 'item' : 'items'}`;
};

export const orderIdOf = order =>
  order?.orderId ?? order?.id ?? order?.orderNumber;

export const orderLabelOf = order =>
  `#${order?.orderNumber ?? order?.orderId ?? order?.id ?? ''}`;

export const productImagesOf = order => {
  if (order?.productImagesCsv) {
    return order.productImagesCsv
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
  }
  const list = order?.items || order?.products || order?.selectedProducts || [];
  return list.map(entry => entry?.image).filter(Boolean);
};
