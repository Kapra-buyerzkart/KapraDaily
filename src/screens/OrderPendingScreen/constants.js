export const PENDING_COPY = {
  topBarTitle: 'Order status',
  topBarSubtitle: 'Payment under verification',
  liveLabel: 'PENDING',
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
};

export const PENDING_STEPS = [
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
