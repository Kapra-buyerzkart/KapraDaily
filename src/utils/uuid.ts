/* eslint-disable no-bitwise */
/**
 * RFC4122 v4 UUID generator backed by react-native-get-random-values
 */
try {
  require('react-native-get-random-values');
} catch {
  // Polyfilled by runtime environment or index.js
}

export const generateUUID = (): string => {
  // 1. Try uuid library if available and working
  try {
    const uuidLib = require('uuid');
    const v4Fn = uuidLib?.v4 || uuidLib?.default?.v4;
    if (typeof v4Fn === 'function') {
      const generated = v4Fn();
      if (typeof generated === 'string' && generated.length >= 32) {
        return generated;
      }
    }
  } catch {
    // Fall through if native CSPRNG not linked yet
  }

  // 2. Hardware-backed OS CSPRNG via crypto.getRandomValues
  try {
    const cryptoObj = (globalThis as any)?.crypto;
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      cryptoObj.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122
      const hex = Array.from(bytes, b =>
        b.toString(16).padStart(2, '0'),
      ).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  } catch {
    // Fall through if native module is not yet compiled
  }

  // 3. Fallback: RFC4122 v4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const uuidv4 = generateUUID;
export default generateUUID;
