/**
 * Validates if the provided phone number is a valid 10-digit Indian mobile number.
 * @param {string} phone The phone number to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const validatePhoneNumbers = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};
