const base64UrlDecode = segment => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return decodeURIComponent(escape(atob(padded)));
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
  const sub = payload?.sub;
  if (sub == null) {
    return null;
  }
  const parsed = parseInt(sub, 10);
  return Number.isNaN(parsed) ? null : parsed;
};
