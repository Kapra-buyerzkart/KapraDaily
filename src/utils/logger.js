const SENSITIVE_KEY_PATTERNS = [
  'token',
  'authorization',
  'password',
  'pwd',
  'secret',
  'signature',
  'razorpay',
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
    return [REDACTED];
  }
};

const logger = {
  debug: (...args) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
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
