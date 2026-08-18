import CONFIG from '@/globals/config';
import { validatePhoneNumbers } from '@/utils/validation';

export const PINCODE_LENGTH = 6;

export const FORM_OPTIONS = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  criteriaMode: 'firstError',
  shouldFocusError: true,
};

export const ADDRESS_MESSAGES = {
  addLine1: {
    required: 'House / flat / block number is required',
    tooShort: 'Add at least 3 characters so the rider can find you',
    tooLong: 'Keep this under 120 characters',
  },
  addLine2: {
    tooLong: 'Keep this under 120 characters',
  },
  pincode: {
    required: 'PIN code is required',
    pattern: `Enter a valid ${PINCODE_LENGTH}-digit PIN code`,
  },
  pincodeAreaId: {
    required: 'Select the area for this PIN code',
  },
  landmark: {
    tooLong: 'Keep the landmark under 160 characters',
  },
  custName: {
    required: 'Tell us who should receive the order',
    tooShort: 'Name must be at least 2 characters',
    pattern: 'Name can only contain letters, spaces and . -',
  },
  phone: {
    required: 'Mobile number is required',
    length: `Enter a valid ${CONFIG.phone_length}-digit mobile number`,
    prefix: 'Mobile number must start with 6, 7, 8 or 9',
  },
  addressType: {
    required: 'Pick a label for this address',
  },
  submitBlocked: 'Please fix the highlighted fields',
};

const trimmed = value => String(value ?? '').trim();

export const ADDRESS_RULES = {
  addLine1: {
    required: ADDRESS_MESSAGES.addLine1.required,
    validate: {
      notBlank: value =>
        trimmed(value).length > 0 || ADDRESS_MESSAGES.addLine1.required,
      minLength: value =>
        trimmed(value).length >= 3 || ADDRESS_MESSAGES.addLine1.tooShort,
      maxLength: value =>
        trimmed(value).length <= 120 || ADDRESS_MESSAGES.addLine1.tooLong,
    },
  },
  addLine2: {
    validate: {
      maxLength: value =>
        trimmed(value).length <= 120 || ADDRESS_MESSAGES.addLine2.tooLong,
    },
  },
  pincode: {
    required: ADDRESS_MESSAGES.pincode.required,
    pattern: {
      value: /^[1-9][0-9]{5}$/,
      message: ADDRESS_MESSAGES.pincode.pattern,
    },
  },
  pincodeAreaId: {
    validate: {
      selected: value =>
        (value !== null && value !== undefined && value !== '') ||
        ADDRESS_MESSAGES.pincodeAreaId.required,
    },
  },
  landmark: {
    validate: {
      maxLength: value =>
        trimmed(value).length <= 160 || ADDRESS_MESSAGES.landmark.tooLong,
    },
  },
  custName: {
    required: ADDRESS_MESSAGES.custName.required,
    validate: {
      notBlank: value =>
        trimmed(value).length > 0 || ADDRESS_MESSAGES.custName.required,
      minLength: value =>
        trimmed(value).length >= 2 || ADDRESS_MESSAGES.custName.tooShort,
      pattern: value =>
        /^[\p{L} .'-]+$/u.test(trimmed(value)) ||
        ADDRESS_MESSAGES.custName.pattern,
    },
  },
  phone: {
    required: ADDRESS_MESSAGES.phone.required,
    validate: {
      length: value =>
        validatePhoneNumbers(value) || ADDRESS_MESSAGES.phone.length,
      prefix: value =>
        /^[6-9]/.test(String(value ?? '').replace(/\D/g, '')) ||
        ADDRESS_MESSAGES.phone.prefix,
    },
  },
  addressType: {
    required: ADDRESS_MESSAGES.addressType.required,
  },
};

export const buildDefaultValues = editAddress => ({
  custName: editAddress?.custName || '',
  addLine1: editAddress?.addLine1 || '',
  addLine2: editAddress?.addLine2 || '',
  landmark: editAddress?.landmark || '',
  phone: editAddress?.phone || '',
  pincode: editAddress?.pincode || '',
  pincodeAreaId: editAddress?.pincodeAreaId ?? null,
  addressType: editAddress?.addressType || 'HOME',
});
