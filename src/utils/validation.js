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
