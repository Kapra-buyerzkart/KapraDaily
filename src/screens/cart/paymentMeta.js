const ONLINE_KEYS = ['online', 'razorpay', 'upi'];

export const getPaymentMeta = (name = '') => {
  const key = String(name).toLowerCase();

  if (key === 'cod' || key.includes('cash')) {
    return { label: 'Cash on delivery', icon: 'cash' };
  }

  if (ONLINE_KEYS.includes(key) || key.includes('online') || key.includes('upi')) {
    return { label: 'Online delivery', icon: 'web' };
  }

  return { label: name || 'Select payment', icon: 'cellphone-check' };
};
