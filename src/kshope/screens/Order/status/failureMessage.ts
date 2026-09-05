const GENERIC_MESSAGE =
  'The payment did not go through. No money has left your account.';

const REASON_MESSAGES: Record<string, string> = {
  payment_cancelled: 'The payment was cancelled before it completed.',
  payment_timeout: 'The payment timed out before the bank confirmed it.',
  payment_pending: 'The bank did not confirm the payment in time.',
  insufficient_funds: 'The account did not have enough balance for this order.',
  payment_limit_exceeded: 'This payment crossed your bank or UPI limit.',
  invalid_vpa: 'That UPI ID could not be verified. Try another UPI app.',
  invalid_card: 'Those card details could not be verified.',
  card_expired: 'That card has expired. Use another card during retry.',
  incorrect_otp: 'The OTP entered was incorrect.',
  payment_error: 'Your bank could not authenticate this payment.',
  authentication_failed: 'Your bank could not authenticate this payment.',
};

const CODE_MESSAGES: Record<string, string> = {
  GATEWAY_ERROR: 'The bank or payment provider rejected this payment.',
  NETWORK_ERROR: 'The connection dropped before the payment finished.',
  BAD_REQUEST_ERROR: 'Your bank could not complete this payment.',
  SERVER_ERROR: 'The payment provider had a problem completing this payment.',
};

const NETWORK_HINTS = ['network', 'timed out', 'timeout', 'offline'];
const CANCEL_HINTS = ['cancel', 'dismiss', 'aborted', 'user closed'];

const readErrorShape = (raw: any): any => {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'object') {
    return raw.error || raw;
  }
  const text = String(raw).trim();
  if (!text.startsWith('{')) {
    return { description: text };
  }
  try {
    const parsed = JSON.parse(text);
    return parsed.error || parsed;
  } catch {
    return { description: text };
  }
};

const isUsableDescription = (value: any): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  const text = value.trim();
  if (!text || text === 'undefined' || text === 'null') {
    return false;
  }
  return !text.startsWith('{') && !text.includes('_ERROR') && text.length < 140;
};

export const resolveFailureMessage = (raw: any): string => {
  const shape = readErrorShape(raw);
  if (!shape) {
    return GENERIC_MESSAGE;
  }

  const reason = String(shape.reason || '').toLowerCase();
  if (REASON_MESSAGES[reason]) {
    return REASON_MESSAGES[reason];
  }

  const code = String(shape.code || '').toUpperCase();
  if (CODE_MESSAGES[code]) {
    return CODE_MESSAGES[code];
  }

  const description = shape.description;
  if (isUsableDescription(description)) {
    const lower = description.toLowerCase();
    if (CANCEL_HINTS.some(hint => lower.includes(hint))) {
      return REASON_MESSAGES.payment_cancelled;
    }
    if (NETWORK_HINTS.some(hint => lower.includes(hint))) {
      return CODE_MESSAGES.NETWORK_ERROR;
    }
    return description.trim();
  }

  return GENERIC_MESSAGE;
};

export default resolveFailureMessage;
