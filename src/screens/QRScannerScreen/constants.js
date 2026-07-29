import COLORS from '@/styles/colors';

export const FIELD_KEYS = {
  event: ['eventName', 'event', 'eventTitle'],
  attendee: ['attendeeName', 'customerName', 'custName', 'userName'],
  category: ['ticketCategory', 'ticketCategoryName', 'ticketType', 'category'],
  ticketNo: ['ticketNumber', 'ticketNo', 'ticketId'],
  quantity: ['quantity', 'qty'],
  checkedInAt: ['checkedInAt', 'checkInTime', 'validatedAt'],
};

export const RESULT_STYLES = {
  valid: {
    icon: 'checkmark-circle',
    title: 'Ticket Valid',
    color: COLORS.success,
    tint: COLORS.successTint,
  },
  invalid: {
    icon: 'close-circle',
    title: 'Ticket Rejected',
    color: COLORS.danger,
    tint: COLORS.errorTint,
  },
  error: {
    icon: 'alert-circle',
    title: 'Could Not Verify',
    color: COLORS.warning,
    tint: COLORS.warningTint,
  },
};

export const VALID_DISMISS_MS = 2000;

// The two platforms spell the "this lens has no flash unit" error differently.
export const TORCH_ERROR_CODES = [
  'device/flash-unavailable',
  'device/flash-not-available',
];
