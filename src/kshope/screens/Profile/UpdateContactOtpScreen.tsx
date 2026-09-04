import React, { useState, useEffect, useRef } from 'react';
import { View, Platform, ScrollView, StatusBar } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import {
  verifyEmailOtpApi,
  verifyPhoneOtpApi,
  requestPhoneOtpApi,
  requestEmailOtpApi,
} from '../../api/services/userService';
import { styles } from './redesign/contact/styles';
import { OTP_LENGTH, RESEND_SECONDS } from './redesign/contact/constants';
import UpdateContactHeader from './redesign/contact/sections/UpdateContactHeader';
import VerifyStepCard from './redesign/contact/sections/VerifyStepCard';
import UpdateActionBar from './redesign/contact/sections/UpdateActionBar';

const TOTAL_STEPS = 2;

const emptyOtp = () => Array(OTP_LENGTH).fill('');

const UpdateContactOtpScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { type, contactValue } = route.params || {};
  const { loadProfile } = useUser();
  const isPhone = type === 'phone';

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
    onCloseCallback?: () => void;
  }>({ title: '', message: '', type: 'success' });

  const showModal = (
    title: string,
    message: string,
    modalType: 'success' | 'error',
    onCloseCallback?: () => void,
  ) => {
    setModalConfig({ title, message, type: modalType, onCloseCallback });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalConfig.onCloseCallback) {
      modalConfig.onCloseCallback();
    }
  };

  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<any>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);
      const payload = isPhone
        ? { phone: contactValue }
        : { email: contactValue };
      const response = isPhone
        ? await requestPhoneOtpApi(payload as any)
        : await requestEmailOtpApi(payload as any);

      if (response?.success) {
        setTimer(RESEND_SECONDS);
        setCanResend(false);
        setOtp(emptyOtp());
        setOtpError(null);
        otpRefs.current[0]?.focus();
      } else {
        showModal(
          'Error',
          response?.message || 'Failed to request OTP',
          'error',
        );
      }
    } catch {
      showModal('Error', 'Failed to request OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== OTP_LENGTH) {
      setOtpError(`Please enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }

    try {
      setIsLoading(true);
      const payload = isPhone
        ? { phone: contactValue, otp: otpValue }
        : { email: contactValue, otp: otpValue };

      const response = isPhone
        ? await verifyPhoneOtpApi(payload as any)
        : await verifyEmailOtpApi(payload as any);

      if (response?.success) {
        await loadProfile();
        showModal(
          'Success',
          `${isPhone ? 'Phone Number' : 'Email ID'} updated successfully`,
          'success',
          () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'KshopeProfile' }],
            });
          },
        );
      } else {
        setOtpError(response?.message || 'Verification failed');
      }
    } catch {
      setOtpError('Invalid OTP or verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    setOtpError(null);
    const digits = text.replace(/\D/g, '');

    if (digits.length > 1) {
      const next = emptyOtp();
      digits
        .slice(0, OTP_LENGTH)
        .split('')
        .forEach((digit, i) => {
          next[i] = digit;
        });
      setOtp(next);
      otpRefs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digits;
    setOtp(newOtp);

    if (digits && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const canVerify = otp.join('').length === OTP_LENGTH && !isLoading;

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <UpdateContactHeader
          isPhone={isPhone}
          step={2}
          totalSteps={TOTAL_STEPS}
          onBack={() => navigation.goBack()}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeIn.duration(220)}>
            <VerifyStepCard
              isPhone={isPhone}
              value={contactValue}
              otp={otp}
              otpRefs={otpRefs}
              error={otpError}
              timer={timer}
              canResend={canResend}
              onChangeDigit={handleOtpChange}
              onKeyPress={handleBackspace}
              onResend={handleRequestOtp}
              onEdit={() => navigation.goBack()}
            />
          </Animated.View>
        </ScrollView>

        <UpdateActionBar
          enabled={canVerify}
          loading={isLoading}
          label="Verify & Update"
          hint={`Enter the ${OTP_LENGTH}-digit code to continue`}
          onPress={handleVerifyOtp}
        />
      </KeyboardAvoidingView>

      <StatusModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleModalClose}
      />
    </View>
  );
};

export default UpdateContactOtpScreen;
