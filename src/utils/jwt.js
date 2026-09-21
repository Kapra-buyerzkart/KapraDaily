// Standard RFC 4648 Base64 alphabet lookup table (A-Z, a-z, 0-9, +, /) used to decode JWT payloads
const BASE64_ALPHABET_LOOKUP =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const b64Decode = (input = '') => {
  let str = input.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const clean = str.replace(/=+$/, '');
  let output = '';
  for (
    let bc = 0, bs = 0, buffer, idx = 0;
    (buffer = clean.charAt(idx++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = BASE64_ALPHABET_LOOKUP.indexOf(buffer);
  }
  return output;
};

const base64UrlDecode = segment => {
  const raw = b64Decode(segment);
  try {
    return decodeURIComponent(
      raw
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch {
    return raw;
  }
};

export const decodeJwtPayload = token => {
  if (!token || typeof token !== 'string') {
    return null;
  }
  const payloadSegment = token.split('.')[1];
  if (!payloadSegment) {
    return null;
  }
  try {
    return JSON.parse(base64UrlDecode(payloadSegment));
  } catch {
    return null;
  }
};

export const getUserIdFromToken = token => {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }
  const sub =
    payload?.sub ??
    payload?.nameid ??
    payload?.[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ] ??
    payload?.userId ??
    payload?.id ??
    payload?.custId;
  if (sub == null) {
    return null;
  }
  const parsed = parseInt(sub, 10);
  return Number.isNaN(parsed) ? sub : parsed;
};
