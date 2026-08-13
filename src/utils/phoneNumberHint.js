import { Platform } from 'react-native';
import PhoneNumberHint from '../specs/NativePhoneNumberHint';
import logger from './logger';

export const isPhoneNumberHintSupported = () =>
  Platform.OS === 'android' && PhoneNumberHint != null;

const toLocalNumber = value => {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
};

export const requestPhoneNumberHint = async () => {
  if (!isPhoneNumberHintSupported()) return null;

  try {
    const local = toLocalNumber(await PhoneNumberHint.requestPhoneNumber());
    return local.length === 10 ? local : null;
  } catch (error) {
    logger.log('PhoneNumberHint error:', error?.code, error?.message);
    return null;
  }
};
