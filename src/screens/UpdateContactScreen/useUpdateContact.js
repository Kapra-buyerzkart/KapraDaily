import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoaderContext } from '@/context/loaderContext';
import { AppContext } from '@/context/appContext';
import { validatePhoneNumbers } from '@/utils/validation';
import {
  requestEmailOtpApi,
  verifyEmailOtpApi,
  requestPhoneOtpApi,
  verifyPhoneOtpApi,
} from '@/api/userService';
import { OTP_LENGTH, RESEND_SECONDS } from './constants';

export const useUpdateContact = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || { type: 'phone' };
  const isPhone = type !== 'email';
  const { showLoader } = useContext(LoaderContext);
  const { profile, loadProfile } = useContext(AppContext);

  const [value, setValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [otpError, setOtpError] = useState('');

  const [statusConfig, setStatusConfig] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });
  const closeActionRef = useRef(null);

  const otpRefs = useRef([]);

  const label = isPhone ? 'Phone Number' : 'Email ID';

  useEffect(() => {
    if (profile) {
      const currentVal = isPhone ? profile.phoneNo : profile.emailId;
      setOriginalValue(currentVal || '');
    }
  }, [profile, isPhone]);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (step === 2 && timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const showError = useCallback(message => {
    setStatusConfig({
      visible: true,
      type: 'error',
      title: 'Error',
      message,
    });
  }, []);

  const handleRequestOtp = useCallback(async () => {
    if (!value.trim()) {
      setFieldError(
        `Please enter a valid ${isPhone ? 'phone number' : 'email ID'}`,
      );
      return;
    }

    if (isPhone && !validatePhoneNumbers(value)) {
      setFieldError('Please enter a valid 10-digit mobile number');
      return;
    }

    setFieldError('');

    try {
      showLoader(true);
      const payload = isPhone ? { newPhone: value } : { newEmail: value };
      const response = isPhone
        ? await requestPhoneOtpApi(payload)
        : await requestEmailOtpApi(payload);

      if (response?.success) {
        setOtp(Array(OTP_LENGTH).fill(''));
        setOtpError('');
        setStep(2);
        setTimer(RESEND_SECONDS);
        setCanResend(false);
        setTimeout(() => otpRefs.current[0]?.focus(), 350);
      } else {
        showError(response?.message || 'Failed to request OTP');
      }
    } catch (error) {
      console.error('Request OTP Error:', error);
      showError('Failed to request OTP. Please try again.');
    } finally {
      showLoader(false);
    }
  }, [isPhone, showError, showLoader, value]);

  const handleVerifyOtp = useCallback(async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== OTP_LENGTH) {
      setOtpError(`Please enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }

    setOtpError('');

    try {
      showLoader(true);
      const payload = isPhone
        ? { newPhone: value, otp: otpValue }
        : { newEmail: value, otp: otpValue };

      const response = isPhone
        ? await verifyPhoneOtpApi(payload)
        : await verifyEmailOtpApi(payload);

      if (response?.success) {
        await loadProfile();
        closeActionRef.current = () => navigation.goBack();
        setStatusConfig({
          visible: true,
          type: 'success',
          title: 'Success',
          message: `${label} updated successfully`,
        });
      } else {
        setOtpError(response?.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setOtpError('Invalid OTP. Please check and try again.');
    } finally {
      showLoader(false);
    }
  }, [isPhone, label, loadProfile, navigation, otp, showLoader, value]);

  const handleOtpChange = useCallback(
    (text, index) => {
      setOtpError('');
      const digits = text.replace(/[^0-9]/g, '');

      if (digits.length > 1) {
        const merged = [...otp];
        digits
          .slice(0, OTP_LENGTH - index)
          .split('')
          .forEach((digit, offset) => {
            merged[index + offset] = digit;
          });
        setOtp(merged);
        const landed = Math.min(index + digits.length, OTP_LENGTH - 1);
        otpRefs.current[landed]?.focus();
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = digits;
      setOtp(newOtp);

      if (digits && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleBackspace = useCallback(
    (event, index) => {
      if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleStatusClose = useCallback(() => {
    setStatusConfig(prev => ({ ...prev, visible: false }));
    const action = closeActionRef.current;
    closeActionRef.current = null;
    if (action) {
      action();
    }
  }, []);

  const handleEditContact = useCallback(() => {
    setStep(1);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
  }, []);

  const handleChangeValue = useCallback(text => {
    setFieldError('');
    setValue(text);
  }, []);

  const isDifferent = value.trim() !== originalValue.trim();
  const isInputValid = isPhone
    ? validatePhoneNumbers(value)
    : value.includes('@');
  const canRequestOtp = isDifferent && isInputValid;
  const otpComplete = otp.every(digit => digit !== '');

  const action = useMemo(() => {
    if (step === 1) {
      return {
        enabled: canRequestOtp,
        label: 'Get OTP',
        hint: isDifferent
          ? `Enter a valid ${isPhone ? 'phone number' : 'email ID'}`
          : `Enter a new ${isPhone ? 'number' : 'email'}`,
        onPress: handleRequestOtp,
      };
    }

    return {
      enabled: otpComplete,
      label: 'Verify & Update',
      hint: `Enter all ${OTP_LENGTH} digits`,
      onPress: handleVerifyOtp,
    };
  }, [
    canRequestOtp,
    handleRequestOtp,
    handleVerifyOtp,
    isDifferent,
    isPhone,
    otpComplete,
    step,
  ]);

  return {
    navigation,
    isPhone,
    step,
    value,
    originalValue,
    otp,
    otpRefs,
    timer,
    canResend,
    fieldError,
    otpError,
    statusConfig,
    action,
    canRequestOtp,
    handleChangeValue,
    handleRequestOtp,
    handleOtpChange,
    handleBackspace,
    handleEditContact,
    handleStatusClose,
  };
};
