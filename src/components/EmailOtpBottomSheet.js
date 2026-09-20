import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CustomBottomModal from './CustomBottomModal';
import { sendLoginOtpToEmail } from '../api';
import BallPulse from './BallPulse';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailOtpBottomSheet = forwardRef((props, ref) => {
  const { onSuccess, onError } = props;

  const sheetRef = useRef(null);
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);
  const showError = touched && email.length > 0 && !isValidEmail;

  const resetState = useCallback(() => {
    setEmail('');
    setTouched(false);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: () => sheetRef.current?.open(),
      close: handleClose,
    }),
    [handleClose],
  );

  const handleSend = useCallback(async () => {
    setTouched(true);
    if (!isValidEmail || submitting) {
      return;
    }

    const trimmedEmail = email.trim();

    try {
      setSubmitting(true);
      const response = await sendLoginOtpToEmail(trimmedEmail);

      if (response?.success) {
        console.log(response, 'success process=====>');
        handleClose();
        onSuccess?.(trimmedEmail);
      } else {
        onError?.(response?.message || 'Failed to send OTP to email');
      }
    } catch (error) {
      onError?.(error?.message || 'Failed to send OTP to email');
    } finally {
      setSubmitting(false);
    }
  }, [email, isValidEmail, submitting, handleClose, onSuccess, onError]);

  const renderContent = useCallback(
    () => (
      <View style={styles.container}>
        <Text style={styles.title}>Send OTP to Email</Text>
        <Text style={styles.subtitle}>
          We'll send a one-time verification code to this email address.
        </Text>

        <View
          style={[styles.inputWrapper, showError && styles.inputWrapperError]}
        >
          <MaterialIcons
            name="email"
            size={wp('5%')}
            color="#9E9E9E"
            style={styles.inputIcon}
          />
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#9E9E9E"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched(true)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!submitting}
          />
        </View>

        {showError ? (
          <Text style={styles.errorText}>
            Please enter a valid email address
          </Text>
        ) : null}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            activeOpacity={0.8}
            onPress={handleClose}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.sendButton,
              (!isValidEmail || submitting) && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.88}
            onPress={handleSend}
            disabled={!isValidEmail || submitting}
          >
            {submitting ? (
              <BallPulse size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    ),
    [email, showError, submitting, isValidEmail, handleClose, handleSend],
  );

  return (
    <CustomBottomModal
      ref={sheetRef}
      snapPoints={['42%']}
      onClose={resetState}
      renderContent={renderContent}
    />
  );
});

EmailOtpBottomSheet.displayName = 'EmailOtpBottomSheet';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('0.5%'),
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.4%'),
    color: '#12372A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.3%'),
    color: '#666666',
    marginTop: hp('0.5%'),
    marginBottom: hp('2.5%'),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    borderRadius: 14,
    paddingHorizontal: wp('3.5%'),
    height: hp('5.8%'),
    backgroundColor: '#FAF8F5',
  },
  inputWrapperError: {
    borderColor: '#B83A3A',
  },
  inputIcon: {
    marginRight: wp('2.5%'),
  },
  input: {
    flex: 1,
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.6%'),
    color: '#12372A',
    padding: 0,
  },
  errorText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3%'),
    color: '#B83A3A',
    marginTop: hp('0.8%'),
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp('2.5%'),
    gap: wp('3%'),
  },
  button: {
    flex: 1,
    height: hp('5.6%'),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D4CC',
  },
  cancelButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#12372A',
  },
  sendButton: {
    backgroundColor: '#0C382E',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1DDD8',
  },
  sendButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default React.memo(EmailOtpBottomSheet);
