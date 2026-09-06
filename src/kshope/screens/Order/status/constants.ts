import type { StatusBullet } from './components';

export const SUCCESS_COPY = {
  topBarTitle: 'Order status',
  topBarSubtitle: 'Your 48hrs Deals order is confirmed',
  statusLabel: 'CONFIRMED',
  statusTitle: 'Order placed',
  statusSubtitle:
    'Thank you for shopping 48hrs Deals. Your order is confirmed and being packed.',
  summaryTitle: 'Order summary',
  stepsTitle: 'What happens next',
  supportTitle: 'Need help with this order?',
  supportSubtitle: 'Contact support from the order details page anytime.',
  footerNote: 'Keep this order number handy for any query about this order.',
  trackCta: 'Track order',
  homeCta: 'Continue shopping',
};

export const SUCCESS_STEPS: StatusBullet[] = [
  {
    id: 'packing',
    icon: 'package',
    title: 'Packing your order',
    description: 'Sellers are preparing the items you just bought.',
  },
  {
    id: 'dispatch',
    icon: 'truck',
    title: 'Out for delivery',
    description: 'You get an update the moment the order is dispatched.',
  },
  {
    id: 'delivered',
    icon: 'check-circle',
    title: 'Delivery to your door step',
    description: 'Track every step from the My Orders section.',
  },
];

export const PENDING_COPY = {
  topBarTitle: 'Order status',
  topBarSubtitle: 'Payment under verification',
  statusLabel: 'PENDING',
  statusTitle: 'Payment pending',
  statusSubtitle:
    'We are verifying this payment with your bank. It usually takes a few minutes.',
  paymentLabel: 'Online payment',
  assuranceNote: 'Your money is safe. Failed payments are refunded in full.',
  stepsTitle: 'What happens next',
  supportTitle: 'Need help with this order?',
  supportSubtitle: 'Contact support from the order details page anytime.',
  footerNote:
    'Keep this order number handy while the payment is being confirmed.',
  trackCta: 'Check order status',
  homeCta: 'Continue shopping',
};

export const PENDING_STEPS: StatusBullet[] = [
  {
    id: 'confirm',
    icon: 'check-circle',
    title: 'Order confirmation',
    description: 'Your order is confirmed as soon as the payment is verified.',
  },
  {
    id: 'track',
    icon: 'package',
    title: 'Live tracking',
    description: 'Follow the status anytime from the My Orders section.',
  },
  {
    id: 'refund',
    icon: 'rotate-ccw',
    title: 'Automatic refund',
    description:
      'If the payment fails, the amount returns to your original method.',
  },
];

export const FAILED_COPY = {
  topBarTitle: 'Payment status',
  topBarSubtitle: 'This order was not placed',
  statusLabel: 'FAILED',
  statusTitle: 'Payment failed',
  statusSubtitle:
    'We could not process this payment. Your order has not been placed yet.',
  refundNote: 'If any amount was debited, it is refunded automatically.',
  summaryTitle: 'Order summary',
  reasonsTitle: 'Common reasons',
  supportTitle: 'Still facing an issue?',
  supportSubtitle: 'Reach support from the order details page anytime.',
  footerNote:
    'Refunds reach your original payment method within 5-7 working days.',
  retryCta: 'Retry payment',
  homeCta: 'Continue shopping',
};

export const FAILED_REASONS: StatusBullet[] = [
  {
    id: 'bank',
    icon: 'credit-card',
    title: 'Bank declined the payment',
    description: 'Try another card, UPI app or wallet during retry.',
  },
  {
    id: 'network',
    icon: 'wifi-off',
    title: 'Connection dropped mid-payment',
    description: 'Check your network and start the payment again.',
  },
  {
    id: 'limit',
    icon: 'alert-circle',
    title: 'Limit or balance issue',
    description: 'Daily limits and low balance can stop a transaction.',
  },
];
