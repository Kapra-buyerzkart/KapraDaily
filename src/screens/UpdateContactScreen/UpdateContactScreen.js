import React from 'react';
import { View, StatusBar, Platform, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusModal from '@/components/StatusModal';
import { entrance } from '@/styles/motion';
import { useUpdateContact } from './useUpdateContact';
import { styles } from './styles';
import UpdateContactHeader from './organisms/UpdateContactHeader';
import ContactStepCard from './organisms/ContactStepCard';
import VerifyStepCard from './organisms/VerifyStepCard';
import UpdateActionBar from './organisms/UpdateActionBar';

const TOTAL_STEPS = 2;

const UpdateContactScreen = () => {
  const insets = useSafeAreaInsets();
  const {
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
  } = useUpdateContact();

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
          step={step}
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
          {step === 1 ? (
            <Animated.View key="step-contact" entering={entrance(0)}>
              <ContactStepCard
                isPhone={isPhone}
                value={value}
                originalValue={originalValue}
                error={fieldError}
                onChangeText={handleChangeValue}
                onSubmitEditing={canRequestOtp ? handleRequestOtp : undefined}
              />
            </Animated.View>
          ) : (
            <Animated.View key="step-verify" entering={FadeIn.duration(220)}>
              <VerifyStepCard
                isPhone={isPhone}
                value={value}
                otp={otp}
                otpRefs={otpRefs}
                error={otpError}
                timer={timer}
                canResend={canResend}
                onChangeDigit={handleOtpChange}
                onKeyPress={handleBackspace}
                onResend={handleRequestOtp}
                onEdit={handleEditContact}
              />
            </Animated.View>
          )}
        </ScrollView>

        <UpdateActionBar
          enabled={action.enabled}
          label={action.label}
          hint={action.hint}
          onPress={action.onPress}
        />
      </KeyboardAvoidingView>

      <StatusModal
        visible={statusConfig.visible}
        onClose={handleStatusClose}
        type={statusConfig.type}
        title={statusConfig.title}
        message={statusConfig.message}
      />
    </View>
  );
};

export default UpdateContactScreen;
