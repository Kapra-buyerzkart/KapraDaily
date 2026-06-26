// Minimal, dependency-free JWT payload decoder.
//
// NOTE: This does NOT verify the signature — it only reads claims from a token
// the app already obtained over TLS from our own backend. Never use the decoded
// values to make trust decisions the backend hasn't already made.

// Base64URL -> string, tolerant of React Native's atob availability.
const base64UrlDecode = segment => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  // `atob` exists in the RN/Hermes runtime; `escape`/`decodeURIComponent`
  // recover UTF-8 characters that atob would otherwise mangle.
  return decodeURIComponent(escape(atob(padded)));
};

/**
 * Decode the payload (claims) of a JWT.
 * @param {string} token
 * @returns {object|null} the decoded payload, or null if the token is missing/malformed.
 */
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

/**
 * Extract the numeric `sub` (user id) claim from a JWT.
 * @param {string} token
 * @returns {number|null} the user id, or null if it can't be determined.
 */
export const getUserIdFromToken = token => {
  const payload = decodeJwtPayload(token);
  const sub = payload?.sub;
  if (sub == null) {
    return null;
  }
  const parsed = parseInt(sub, 10);
  return Number.isNaN(parsed) ? null : parsed;
};
