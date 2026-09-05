const ONLINE_KEYS = ['online', 'razorpay', 'upi'];

export const isCashOnDelivery = (name = '') => {
  const key = String(name).toLowerCase();
  return key === 'cod' || key.includes('cash');
};

export const getPaymentLabel = (name = '') => {
  const key = String(name).toLowerCase();

  if (isCashOnDelivery(key)) {
    return 'Cash on delivery';
  }

  if (
    ONLINE_KEYS.includes(key) ||
    key.includes('online') ||
    key.includes('upi')
  ) {
    return 'Online payment';
  }

  return name || 'Online payment';
};
