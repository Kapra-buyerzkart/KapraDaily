import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import icons from '@/assets/icons';
import { FONTS } from '../styles/typography';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';
import { validatePhoneNumbers } from '../utils/validation';
import StatusModal from '../components/StatusModal';
import {
  requestEmailOtpApi,
  verifyEmailOtpApi,
  requestPhoneOtpApi,
  verifyPhoneOtpApi,
} from '../api/userService';
import {
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  GUTTER,
  HERO_TOP,
  HERO_GRADIENT,
  HERO_LIFT,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';
import {
  BAR_SOLID_AT,
  BORDER_FADE_RANGE,
  PRESS_IN,
  PRESS_OUT,
  entrance,
} from '@/styles/motion';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 30;
const FOCUS_FADE = { duration: 160 };

const UpdateContactScreen = () => {
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

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [onModalClose, setOnModalClose] = useState(null);

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

  const showError = message => {
    setStatusType('error');
    setStatusTitle('Error');
    setStatusMessage(message);
    setStatusModalVisible(true);
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
  };

  const handleVerifyOtp = async () => {
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
        setStatusType('success');
        setStatusTitle('Success');
        setStatusMessage(`${label} updated successfully`);
        setOnModalClose(() => () => navigation.goBack());
        setStatusModalVisible(true);
      } else {
        setOtpError(response?.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setOtpError('Invalid OTP. Please check and try again.');
    } finally {
      showLoader(false);
    }
  };

  const handleOtpChange = (text, index) => {
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
  };

  const handleBackspace = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleModalClose = () => {
    setStatusModalVisible(false);
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleChangeContact = () => {
    setStep(1);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError('');
  };

  const isDifferent = value.trim() !== originalValue.trim();
  const isInputValid = isPhone
    ? validatePhoneNumbers(value)
    : value.includes('@');
  const canRequestOtp = isDifferent && isInputValid;
  const otpComplete = otp.every(digit => digit !== '');

  const scrollY = useSharedValue(0);
  const heroAnchor = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const onHeroLayout = event => {
    const { y, height } = event.nativeEvent.layout;
    heroAnchor.value = y + height;
  };

  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const topBarBackgroundStyle = useAnimatedStyle(() => {
    const anchor = heroAnchor.value;
    if (anchor <= 0) return { backgroundColor: HERO_TOP };
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, anchor * BAR_SOLID_AT],
        [HERO_TOP, CANVAS],
      ),
    };
  });

  const primaryEnabled = step === 1 ? canRequestOtp : otpComplete;
  const primaryLabel = step === 1 ? 'Get OTP' : 'Verify & Update';
  const primaryHint =
    step === 1
      ? isDifferent
        ? `Enter a valid ${isPhone ? 'phone number' : 'email ID'}`
        : `Enter a new ${isPhone ? 'number' : 'email'}`
      : `Enter all ${OTP_LENGTH} digits`;

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          stickyHeaderIndices={[0]}
          keyboardShouldPersistTaps="handled"
        >
          <TopBar
            title={`Update ${isPhone ? 'Phone' : 'Email'}`}
            onBack={() => navigation.goBack()}
            backgroundStyle={topBarBackgroundStyle}
            borderStyle={topBarBorderStyle}
          />

          {}
          <LinearGradient colors={HERO_GRADIENT} style={styles.hero}>
            <Animated.View
              style={styles.heroInner}
              onLayout={onHeroLayout}
              entering={entrance(0)}
            >
              {}

              <Text style={styles.heroTitle} maxFontSizeMultiplier={1.2}>
                {step === 1
                  ? `Change your ${isPhone ? 'number' : 'email'}`
                  : 'Verify it’s you'}
              </Text>

              <Text style={styles.heroSubtitle} maxFontSizeMultiplier={1.2}>
                {step === 1
                  ? isPhone
                    ? 'We’ll send a one-time code to confirm the new number is yours.'
                    : 'We’ll send a one-time code to confirm the new address is yours.'
                  : `We sent a ${OTP_LENGTH}-digit code to ${
                      isPhone ? `+91 ${value}` : value
                    }.`}
              </Text>

              {step === 1 && !!originalValue && (
                <View style={styles.currentPill}>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={wp('3.2%')}
                    color={ACCENT.successText}
                  />
                  <Text
                    style={styles.currentPillText}
                    numberOfLines={1}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Current: {isPhone ? `+91 ${originalValue}` : originalValue}
                  </Text>
                </View>
              )}
            </Animated.View>
          </LinearGradient>

          {step === 1 ? (
            <Animated.View key="step-input" entering={entrance(1)}>
              <View style={styles.fieldGroup}>
                <ContactField
                  isPhone={isPhone}
                  value={value}
                  onChangeText={text => {
                    setFieldError('');
                    setValue(text);
                  }}
                  error={fieldError}
                  onSubmitEditing={canRequestOtp ? handleRequestOtp : undefined}
                />

                <View style={styles.noteRow}>
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={wp('3.6%')}
                    color={INK.muted}
                    style={styles.noteIcon}
                  />
                  <Text
                    style={styles.noteText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {isPhone
                      ? 'Your new number becomes your login and where order updates are sent.'
                      : 'Your new email becomes your login and where receipts are sent.'}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ) : (
            <Animated.View key="step-otp" entering={FadeIn.duration(220)}>
              <View style={styles.fieldGroup}>
                {}
                <Text
                  style={styles.fieldLabel}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {isPhone
                    ? 'Code sent to your phone & WhatsApp'
                    : 'Code sent to your inbox'}
                </Text>

                <View style={styles.otpRow}>
                  {otp.map((digit, index) => (
                    <OtpBox
                      key={index}
                      ref={el => (otpRefs.current[index] = el)}
                      value={digit}
                      error={!!otpError}
                      onChangeText={text => handleOtpChange(text, index)}
                      onKeyPress={event => handleBackspace(event, index)}
                      accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}
                    />
                  ))}
                </View>

                {!!otpError && (
                  <View style={styles.fieldErrorRow}>
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={wp('3.4%')}
                      color={ERROR_INK}
                    />
                    <Text
                      style={styles.fieldErrorText}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {otpError}
                    </Text>
                  </View>
                )}

                {}
                <View style={styles.resendRow}>
                  {canResend ? (
                    <TouchableOpacity
                      onPress={handleRequestOtp}
                      hitSlop={hitSlopTo(24)}
                      accessibilityRole="button"
                    >
                      <Text
                        style={styles.resendActive}
                        maxFontSizeMultiplier={MAX_FONT_SCALE}
                      >
                        Resend code
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text
                      style={styles.resendIdle}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      Resend code in {timer}s
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleChangeContact}
                  style={styles.changeRow}
                  hitSlop={hitSlopTo(24)}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={wp('3.4%')}
                    color={ACCENT.primary}
                  />
                  <Text
                    style={styles.changeText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Change {isPhone ? 'number' : 'email'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </Animated.ScrollView>

        <ActionBar
          enabled={primaryEnabled}
          label={primaryLabel}
          hint={primaryHint}
          icon={step === 1 ? 'message-badge-outline' : 'check-circle-outline'}
          onPress={step === 1 ? handleRequestOtp : handleVerifyOtp}
        />
      </KeyboardAvoidingView>

      <StatusModal
        visible={statusModalVisible}
        onClose={handleModalClose}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />
    </View>
  );
};

const TopBar = ({ title, onBack, backgroundStyle, borderStyle }) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.topBar,
        backgroundStyle,
        { paddingTop: insets.top + SPACE.sm },
      ]}
    >
      <TouchableOpacity
        hitSlop={hitSlopTo(wp('6%'))}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.topBarTitle}>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
};

const ContactField = ({ isPhone, value, onChangeText, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  const wellStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [FIELD_REST, SURFACE.base],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [FIELD_REST, ACCENT.primary],
    ),
  }));

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        New {isPhone ? 'Phone Number' : 'Email ID'}
      </Text>

      <Animated.View
        style={[styles.fieldWell, wellStyle, !!error && styles.fieldWellError]}
      >
        {isPhone ? (
          <View style={styles.prefixBlock}>
            <Text
              style={styles.prefixText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              +91
            </Text>
            <View style={styles.prefixRule} />
          </View>
        ) : (
          <MaterialCommunityIcons
            name="email-outline"
            size={wp('4.2%')}
            color={error ? ERROR_INK : focused ? ACCENT.primary : INK.muted}
            style={styles.fieldIcon}
          />
        )}

        <TextInput
          style={[styles.fieldInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={isPhone ? '00000 00000' : 'name@example.com'}
          placeholderTextColor={INK.faint}
          keyboardType={isPhone ? 'phone-pad' : 'email-address'}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={isPhone ? 10 : undefined}
          returnKeyType="done"
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          onFocus={() => {
            setFocused(true);
            focus.value = withTiming(1, FOCUS_FADE);
          }}
          onBlur={() => {
            setFocused(false);
            focus.value = withTiming(0, FOCUS_FADE);
          }}
          {...props}
        />
      </Animated.View>

      {!!error && (
        <View style={styles.fieldErrorRow}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={wp('3.4%')}
            color={ERROR_INK}
          />
          <Text
            style={styles.fieldErrorText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const OtpBox = React.forwardRef(({ value, error, ...props }, ref) => {
  const focus = useSharedValue(0);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      [FIELD_REST, SURFACE.base],
    ),
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [FIELD_REST, ACCENT.primary],
    ),
    transform: [{ scale: 1 + focus.value * 0.04 }],
  }));

  return (
    <Animated.View
      style={[styles.otpBox, boxStyle, !!error && styles.otpBoxError]}
    >
      <TextInput
        ref={ref}
        style={styles.otpInput}
        value={value}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        maxLength={OTP_LENGTH}
        selectionColor={ACCENT.primary}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        onFocus={() => {
          focus.value = withTiming(1, FOCUS_FADE);
        }}
        onBlur={() => {
          focus.value = withTiming(0, FOCUS_FADE);
        }}
        {...props}
      />
    </Animated.View>
  );
});

OtpBox.displayName = 'OtpBox';

const ActionBar = ({ enabled, label, hint, icon, onPress }) => {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[
        styles.actionBar,
        { paddingBottom: Math.max(insets.bottom, SPACE.md) },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!enabled}
        onPressIn={() => {
          if (enabled) scale.value = withTiming(0.98, PRESS_IN);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, PRESS_OUT);
        }}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled }}
        accessibilityLabel={label}
        accessibilityHint={enabled ? undefined : hint}
      >
        <Animated.View
          style={[
            styles.actionButton,
            !enabled && styles.actionButtonDisabled,
            buttonStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={wp('4.2%')}
            color={enabled ? INK.onDark : RESTING_INK}
            style={styles.actionButtonIcon}
          />
          <Text
            style={[
              styles.actionButtonText,
              !enabled && styles.actionButtonTextDisabled,
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {enabled ? label : hint}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default UpdateContactScreen;

const FIELD_REST = '#F7F5F3';
const FIELD_BORDER_WIDTH = 1.5;
const ERROR_INK = ACCENT.discount;
const ERROR_SOFT = '#FDF1EC';
const RESTING_INK = '#9A5B38';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: HERO_TOP,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACE.base,
    backgroundColor: CANVAS,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.xs + 2,
    backgroundColor: HERO_TOP,
  },
  topBarBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  topBarTitle: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPE.heading,
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: -0.3,
  },

  hero: {
    paddingBottom: SPACE.sm,
  },
  heroInner: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.md,
  },
  heroDisc: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.base,
    ...HERO_LIFT,
    marginBottom: SPACE.md,
  },
  heroTitle: {
    ...TYPE.title,
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    ...TYPE.caption,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
    marginTop: SPACE.xs,
    maxWidth: wp('82%'),
  },
  currentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACE.sm,
    paddingVertical: 3,
    paddingHorizontal: SPACE.sm + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.successSoft,
  },
  currentPillText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.successText,
    marginLeft: SPACE.xs + 1,
  },

  fieldGroup: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.base,
  },
  field: {
    marginBottom: SPACE.md,
  },
  fieldLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACE.xs,
  },
  fieldWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('5.8%'),
    borderRadius: RADIUS.sm,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: SPACE.sm + 2,
  },
  fieldWellError: {
    backgroundColor: ERROR_SOFT,
    borderColor: ERROR_INK,
  },
  prefixBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
  },
  prefixRule: {
    width: StyleSheet.hairlineWidth,
    height: hp('2.2%'),
    backgroundColor: 'rgba(17,19,26,0.12)',
    marginHorizontal: SPACE.sm + 2,
  },
  fieldIcon: {
    marginRight: SPACE.sm + 2,
  },
  fieldInput: {
    flex: 1,
    letterSpacing: 1.2,
    bottom: Platform.OS == 'ios' ? hp(0.5) : hp(0),
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.strong,
    paddingVertical: SPACE.sm,
    includeFontPadding: false,
  },
  fieldInputPhone: {
    letterSpacing: 1.2,
    bottom: Platform.OS == 'ios' ? hp(0.5) : hp(0),
  },
  fieldErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.xs + 2,
  },
  fieldErrorText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: ERROR_INK,
    marginLeft: SPACE.xs + 1,
    flexShrink: 1,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACE.xs,
    padding: SPACE.sm + 2,
    borderRadius: RADIUS.xs,
    backgroundColor: SURFACE.sunken,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    ...TYPE.micro,
    lineHeight: TYPE.caption.lineHeight,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginLeft: SPACE.xs + 2,
    flex: 1,
  },

  otpRow: {
    flexDirection: 'row',
    gap: wp('2.2%'),
  },
  otpBox: {
    flex: 1,
    height: hp('6%'),
    borderRadius: RADIUS.sm,
    borderWidth: FIELD_BORDER_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxError: {
    backgroundColor: ERROR_SOFT,
    borderColor: ERROR_INK,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    padding: 0,
    includeFontPadding: false,
  },
  resendRow: {
    minHeight: hp('2.6%'),
    justifyContent: 'center',
    marginTop: SPACE.md,
  },
  resendActive: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
  },
  resendIdle: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.faint,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.sm,
  },
  changeText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
    marginLeft: SPACE.xs + 2,
  },

  actionBar: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm + 2,
    backgroundColor: SURFACE.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  actionButton: {
    flexDirection: 'row',
    minHeight: hp('5.8%'),
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT.primary,
    ...HERO_LIFT,
    shadowColor: ACCENT.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionButtonDisabled: {
    backgroundColor: ACCENT.primarySoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    letterSpacing: 0.2,
  },
  actionButtonTextDisabled: {
    color: RESTING_INK,
  },
  actionButtonIcon: {
    marginRight: SPACE.xs + 2,
  },
});
