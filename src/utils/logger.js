// Centralized, redacting logger.
//
// Goals:
//  - In production builds (__DEV__ === false), `log` and `info` are no-ops so we
//    never leak data to logcat / Console / crash collectors.
//  - `warn` and `error` are kept in production (useful for diagnostics) but every
//    argument is deep-redacted so tokens, payment data and PII never appear.
//
// Usage: import logger from '../utils/logger'; logger.log('label', payload)
// Prefer this over console.* anywhere a value could contain user/auth/payment data.

const SENSITIVE_KEY_PATTERNS = [
  'token',
  'authorization',
  'password',
  'pwd',
  'secret',
  'signature',
  'razorpay', // razorpayPaymentId / razorpaySignature / razorpay_order_id
  'otp',
  'phone',
  'contact',
  'email',
  'custid',
  'addline',
  'address',
  'pincode',
  'cardnumber',
  'cvv',
  'cvc',
  'apikey',
  'key',
];

const REDACTED = '«redacted»';

const isSensitiveKey = key => {
  const k = String(key).toLowerCase();
  return SENSITIVE_KEY_PATTERNS.some(pattern => k.includes(pattern));
};

// Deep-clone `value` while masking any property whose key looks sensitive.
// Guards against cycles and very deep objects.
const redact = (value, depth = 0, seen = new WeakSet()) => {
  if (value == null || typeof value !== 'object') {
    return value;
  }
  if (depth > 6 || seen.has(value)) {
    return value;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map(item => redact(item, depth + 1, seen));
  }

  const out = {};
  for (const key of Object.keys(value)) {
    if (isSensitiveKey(key)) {
      out[key] = REDACTED;
    } else {
      out[key] = redact(value[key], depth + 1, seen);
    }
  }
  return out;
};

const redactArgs = args => {
  try {
    return args.map(arg => redact(arg));
  } catch {
    // If anything goes wrong while redacting, fail closed (don't log raw values).
    return [REDACTED];
  }
};

const logger = {
  log: (...args) => {
    if (__DEV__) {
      console.log(...redactArgs(args));
    }
  },
  info: (...args) => {
    if (__DEV__) {
      console.info(...redactArgs(args));
    }
  },
  warn: (...args) => {
    console.warn(...redactArgs(args));
  },
  error: (...args) => {
    console.error(...redactArgs(args));
  },
};

export default logger;
