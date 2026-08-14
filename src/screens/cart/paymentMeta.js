const ONLINE_KEYS = ['online', 'razorpay', 'upi'];

export const isCashOnDelivery = (name = '') => {
  const key = String(name).toLowerCase();
  return key === 'cod' || key.includes('cash');
};

export const getPaymentMeta = (name = '') => {
  const key = String(name).toLowerCase();

  if (isCashOnDelivery(key)) {
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
