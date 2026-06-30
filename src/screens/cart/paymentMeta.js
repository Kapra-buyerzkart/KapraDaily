/**
 * paymentMeta
 *
 * Maps a backend payment-mode name (e.g. "COD", "Online", "Razorpay") to the
 * customer-facing label and icon used across the cart UI. Keeping this in one
 * place ensures the sticky checkout chip and the payment bottom sheet always
 * show the same text/icon for a given mode. The raw paymentModeName is still
 * what gets stored in state and sent to the order API — this is display only.
 */
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
