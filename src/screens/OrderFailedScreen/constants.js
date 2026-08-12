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
  helpTitle: 'Still facing an issue?',
  helpSubtitle: 'Reach support from the order details page anytime.',
  footerNote:
    'Refunds reach your original payment method within 5-7 working days.',
  retryCta: 'Retry payment',
  homeCta: 'Continue shopping',
};

export const FAILED_REASONS = [
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
