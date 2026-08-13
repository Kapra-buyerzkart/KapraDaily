import { MONTHS_SHORT } from './constants';

export const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr.split('T')[0];
  return `${date.getDate().toString().padStart(2, '0')} ${
    MONTHS_SHORT[date.getMonth()]
  }`;
};

export const formatAmount = value => {
  if (value == null) return '';
  const str = value.toString().replace(/[^0-9.-]+/g, '');
  const num = parseFloat(str)?.toFixed(2);
  if (isNaN(num)) return value;
  return `₹${num.toLocaleString('en-IN')}`;
};

export const maskPhone = phone => {
  if (!phone) return '';
  const phoneStr = String(phone);
  if (phoneStr.length <= 4) return phoneStr;
  return `${phoneStr.slice(0, 2)}******${phoneStr.slice(-2)}`;
};

export const deriveListItem = (item, type, index) => {
  const name =
    type === 'orders'
      ? item.orderNumber || item.id || item.orderId || `#ORD${index}`
      : type === 'payouts'
      ? item.payMode || item.type || item.payoutMethod || 'Transfer'
      : item.name || item.custName || 'User';

  const rawSub =
    type === 'orders'
      ? item.orderStatusKey || item.status || item.orderStatus
      : type === 'payouts'
      ? 'Success'
      : item.phone || item.phoneNo || '';
  const sub =
    type !== 'orders' && type !== 'payouts' && rawSub ? maskPhone(rawSub) : rawSub;

  let value =
    type === 'copartners'
      ? item.type || item.status || 'Registered on'
      : item.status || '';
  if (type === 'orders' || type === 'payouts') {
    value = formatAmount(item.grandTotal || item.amount || item.totalAmount || 0);
  }
  if (type === 'customers') {
    value = formatDate(item.createdDate);
  }

  const rawDate =
    type === 'payouts'
      ? item.paidOn
      : type === 'copartners'
      ? item.addedOn
      : item.orderDate || item.date || item.createdAt || '';

  return { name, sub, value, date: formatDate(rawDate) };
};

export const getSummaryStats = summary => [
  {
    key: 'referrals',
    icon: 'account-multiple',
    label: 'Referrals',
    value: summary?.totalReferrals ?? summary?.referrals ?? '0',
  },
  {
    key: 'occupancy',
    icon: 'hand-heart',
    label: 'Occupancy',
    value:
      summary?.areaOccupancy != null
        ? `${summary.areaOccupancy}%`
        : summary?.occupancy || summary?.occupancyPercentage || '0%',
  },
  {
    key: 'customers',
    icon: 'account-group',
    label: 'Customers',
    value: summary?.totalCustomers ?? summary?.customers ?? '0',
  },
  {
    key: 'credited',
    icon: 'credit-card',
    label: 'Credited',
    tone: 'success',
    value:
      summary?.creditedProfit != null
        ? formatAmount(summary.creditedProfit)
        : summary?.credited || summary?.totalCredited || '₹0',
  },
  {
    key: 'expected',
    icon: 'trending-up',
    label: 'Expected',
    tone: 'success',
    value:
      summary?.expectedProfit != null
        ? formatAmount(summary.expectedProfit)
        : summary?.expected || summary?.expectedEarnings || '₹0',
  },
  {
    key: 'orders',
    icon: 'package-variant',
    label: 'Orders',
    value: summary?.orders || summary?.totalOrders || '0',
  },
];
