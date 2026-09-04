import React, { useState, useEffect } from 'react';
import { View, Platform, ScrollView, StatusBar } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import {
  requestEmailOtpApi,
  requestPhoneOtpApi,
} from '../../api/services/userService';
import { entrance } from './redesign/motion';
import { styles } from './redesign/contact/styles';
import UpdateContactHeader from './redesign/contact/sections/UpdateContactHeader';
import ContactStepCard from './redesign/contact/sections/ContactStepCard';
import UpdateActionBar from './redesign/contact/sections/UpdateActionBar';

const TOTAL_STEPS = 2;

const UpdateContactScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { type } = route.params || { type: 'phone' };
  const { profile } = useUser();
  const isPhone = type === 'phone';

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ title: '', message: '', type: 'success' });

  const showModal = (
    title: string,
    message: string,
    modalType: 'success' | 'error',
  ) => {
    setModalConfig({ title, message, type: modalType });
    setModalVisible(true);
  };

  const [value, setValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const normalizePhone = (ph: string) => {
    const digits = ph.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      return digits.substring(2);
    }
    if (digits.length > 10 && digits.startsWith('91')) {
      return digits.slice(-10);
    }
    return digits.slice(-10);
  };

  useEffect(() => {
    if (profile) {
      const currentVal = isPhone
        ? normalizePhone(profile.phoneNo || '')
        : profile.emailId;
      setValue(currentVal || '');
      setOriginalValue(currentVal || '');
    }
  }, [profile, isPhone]);

  const validatePhoneNumbers = (ph: string) => /^[6-9]\d{9}$/.test(ph);

  const handleTextChange = (text: string) => {
    setFieldError(null);
    if (isPhone) {
      setValue(text.replace(/\D/g, '').slice(0, 10));
    } else {
      setValue(text);
    }
  };

  const handleRequestOtp = async () => {
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

    try {
      setIsLoading(true);
      const payload = isPhone ? { phone: value } : { email: value };
      const response = isPhone
        ? await requestPhoneOtpApi(payload as any)
        : await requestEmailOtpApi(payload as any);

      if (response?.success) {
        navigation.navigate('KshopeUpdateContactOtp', {
          type,
          contactValue: value,
        });
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

  const isDifferent = value.trim() !== originalValue.trim();
  const isInputValid = isPhone
    ? validatePhoneNumbers(value)
    : value.includes('@');
  const canRequestOtp = isDifferent && isInputValid && !isLoading;

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
          step={1}
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
          <Animated.View entering={entrance(0)}>
            <ContactStepCard
              isPhone={isPhone}
              value={value}
              originalValue={originalValue}
              error={fieldError}
              onChangeText={handleTextChange}
              onSubmitEditing={canRequestOtp ? handleRequestOtp : undefined}
            />
          </Animated.View>
        </ScrollView>

        <UpdateActionBar
          enabled={canRequestOtp}
          loading={isLoading}
          label="Send OTP"
          hint={`Enter a new ${
            isPhone ? 'mobile number' : 'email ID'
          } to continue`}
          onPress={handleRequestOtp}
        />
      </KeyboardAvoidingView>

      <StatusModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default UpdateContactScreen;
