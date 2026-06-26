import CONFIG from '../globals/config';

export const validatePhoneNumbers = (phoneStr) => {
    if (!phoneStr) return false;
    // Just the numbers
    const justNumbers = phoneStr.replace(/\D/g, '');
    return justNumbers.length === CONFIG.phone_length;
};

export const sanitizePhoneNumber = (phoneStr) => {
    if (!phoneStr) return '';
    const justNumbers = phoneStr.replace(/\D/g, '');
    return justNumbers.substring(0, CONFIG.phone_length);
};

// Pragmatic email check — not RFC-exhaustive, but rejects the obviously
// malformed input (missing @, spaces, missing TLD) before it hits the backend.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    return EMAIL_REGEX.test(email.trim());
};

// OTP must be digits only. Pass the expected length (defaults to 4).
export const validateOtp = (otp, length = 4) => {
    if (otp == null) return false;
    const digits = String(otp).trim();
    return new RegExp(`^\\d{${length}}$`).test(digits);
};

// Mask a phone number for logs/UI: keeps only the last 4 digits.
export const maskPhoneNumber = (phoneStr) => {
    if (!phoneStr) return '';
    const justNumbers = String(phoneStr).replace(/\D/g, '');
    if (justNumbers.length <= 4) return justNumbers;
    return `••••${justNumbers.slice(-4)}`;
};
