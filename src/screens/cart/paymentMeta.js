const ONLINE_KEYS = ['online', 'razorpay', 'upi'];

export const getPaymentMeta = (name = '') => {
  const key = String(name).toLowerCase();

  if (key === 'cod' || key.includes('cash')) {
    return {
      label: 'Cash on delivery',
      icon: 'cash',
      subtitle: 'Pay the delivery partner at your door',
    };
  }

  if (ONLINE_KEYS.includes(key) || key.includes('online') || key.includes('upi')) {
    return {
      label: 'Online payment',
      icon: 'credit-card-outline',
      subtitle: 'UPI, cards, netbanking & wallets',
    };
  }

  return {
    label: name || 'Select payment',
    icon: 'cellphone-check',
    subtitle: 'Secure checkout',
  };
};
