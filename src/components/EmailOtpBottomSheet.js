import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CustomBottomModal from './CustomBottomModal';
import { sendLoginOtpToEmail } from '../api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * EmailOtpBottomSheet
 *
 * Reusable, ref-controlled bottom sheet that lets the user request the
 * login OTP be delivered to their email instead of SMS. It only triggers
 * delivery — verification still happens through the existing
 * verifyLoginOtp (auth/verifyotp) flow on the parent OTP screen.
 *
 * Built on top of CustomBottomModal so it inherits the same backdrop,
 * keyboard-safe, and hardware-back-button behaviour as the rest of the app.
 */
const EmailOtpBottomSheet = forwardRef((props, ref) => {
  const { phone, onSuccess, onError } = props;

  const sheetRef = useRef(null);
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);
  const showError = touched && email.length > 0 && !isValidEmail;

  // Wipes form state once the sheet is fully dismissed (success, cancel,
  // backdrop tap, or swipe-down) so it always opens fresh next time.
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
      const response = await sendLoginOtpToEmail({
        phone,
        email: trimmedEmail,
      });

      if (response?.success) {
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
  }, [email, isValidEmail, submitting, phone, handleClose, onSuccess, onError]);

  const renderContent = useCallback(
    () => (
      <View style={styles.container}>
        <Text style={styles.title}>Send OTP to Email</Text>
        <Text style={styles.subtitle}>
          We'll send a one-time password to this email address.
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
            onPress={handleSend}
            disabled={!isValidEmail || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
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
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.25%'),
    color: '#616161',
    marginTop: hp('0.5%'),
    marginBottom: hp('2.5%'),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: wp('2.33%'),
    paddingHorizontal: wp('3.5%'),
    height: hp('6.11%'),
    backgroundColor: '#FAFAFA',
  },
  inputWrapperError: {
    borderColor: '#D32F2F',
  },
  inputIcon: {
    marginRight: wp('2.5%'),
  },
  input: {
    flex: 1,
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    color: '#000000',
    padding: 0,
  },
  errorText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#D32F2F',
    marginTop: hp('0.8%'),
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp('3%'),
    gap: wp('3%'),
  },
  button: {
    flex: 1,
    height: hp('6.11%'),
    borderRadius: wp('2.33%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
  },
  cancelButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.72%'),
    color: '#616161',
  },
  sendButton: {
    backgroundColor: '#F25000',
  },
  sendButtonDisabled: {
    backgroundColor: '#F2A98A',
  },
  sendButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.72%'),
    color: '#FFFFFF',
  },
});

export default React.memo(EmailOtpBottomSheet);
