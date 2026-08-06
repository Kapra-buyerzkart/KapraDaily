import React, { useContext, useMemo, useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import icons from '@/assets/icons';
import { FONTS } from '../styles/typography';
import { LoaderContext } from '../context/loaderContext';
import StatusModal from '../components/StatusModal';
import { changePasswordApi } from '../api/userService';
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

const FOCUS_FADE = { duration: 160 };
const METER_FADE = { duration: 220 };

const RULES = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: value => value.length >= 8,
  },
  {
    key: 'letter',
    label: 'A letter',
    test: value => /[A-Za-z]/.test(value),
  },
  {
    key: 'number',
    label: 'A number',
    test: value => /[0-9]/.test(value),
  },
];

const scorePassword = value => {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Za-z]/.test(value) && /[0-9]/.test(value)) score += 1;
  if (
    /[^A-Za-z0-9]/.test(value) ||
    (/[a-z]/.test(value) && /[A-Z]/.test(value))
  )
    score += 1;
  return Math.min(score, METER_SEGMENTS);
};

const STRENGTH_COPY = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { showLoader } = useContext(LoaderContext);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [oldError, setOldError] = useState('');

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [onModalClose, setOnModalClose] = useState(null);

  const newRef = useRef(null);
  const confirmRef = useRef(null);

  const checks = useMemo(
    () => RULES.map(rule => ({ ...rule, passed: rule.test(newPassword) })),
    [newPassword],
  );
  const newValid = checks.every(check => check.passed);
  const score = useMemo(() => scorePassword(newPassword), [newPassword]);

  const confirmTouched = confirmPassword.length > 0;
  const confirmMatches = confirmTouched && confirmPassword === newPassword;
  const confirmError =
    confirmTouched && !confirmMatches ? 'Passwords don’t match' : '';
  const isReused = newValid && newPassword === oldPassword;

  const canSubmit =
    oldPassword.length > 0 && newValid && confirmMatches && !isReused;

  const hint = !oldPassword
    ? 'Enter your current password'
    : !newValid
    ? 'Choose a stronger new password'
    : isReused
    ? 'New password must be different'
    : 'Re-enter the new password to confirm';

  const showError = message => {
    setStatusType('error');
    setStatusTitle('Error');
    setStatusMessage(message);
    setStatusModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!canSubmit) return;

    try {
      showLoader(true);
      const response = await changePasswordApi({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response?.success) {
        setStatusType('success');
        setStatusTitle('Success');
        setStatusMessage('Password updated successfully');
        setOnModalClose(() => () => navigation.goBack());
        setStatusModalVisible(true);
      } else {
        const message = response?.message || 'Failed to update password';
        if (/old|current|incorrect|wrong/i.test(message)) {
          setOldError(message);
        } else {
          showError(message);
        }
      }
    } catch (error) {
      console.error('Change Password Error:', error);
      showError('An unexpected error occurred');
    } finally {
      showLoader(false);
    }
  };

  const handleModalClose = () => {
    setStatusModalVisible(false);
    if (onModalClose) {
      onModalClose();
    }
  };

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
            title="Change Password"
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
              <Text style={styles.heroTitle} maxFontSizeMultiplier={1.2}>
                Set a new password
              </Text>

              <Text style={styles.heroSubtitle} maxFontSizeMultiplier={1.2}>
                Confirm the one you use now, then choose something you haven’t
                used elsewhere.
              </Text>
            </Animated.View>
          </LinearGradient>

          <Animated.View style={styles.fieldGroup} entering={entrance(1)}>
            <PasswordField
              label="Current Password"
              icon="lock-outline"
              placeholder="Enter current password"
              value={oldPassword}
              onChangeText={text => {
                setOldError('');
                setOldPassword(text);
              }}
              error={oldError}
              textContentType="password"
              autoComplete="current-password"
              returnKeyType="next"
              onSubmitEditing={() => newRef.current?.focus()}
            />

            <PasswordField
              ref={newRef}
              label="New Password"
              icon="lock-reset"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              error={isReused ? 'Choose a password you aren’t using now' : ''}
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              footer={
                <StrengthPanel
                  visible={newPassword.length > 0}
                  score={score}
                  checks={checks}
                />
              }
            />

            <PasswordField
              ref={confirmRef}
              label="Confirm New Password"
              icon="lock-check-outline"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmError}
              success={confirmMatches}
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={canSubmit ? handleUpdate : undefined}
            />

            {}
            <View style={styles.noteRow}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={wp('4%')}
                color={INK.muted}
                style={styles.noteIcon}
              />
              <Text
                style={styles.noteText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                You’ll stay signed in on this device. Use the new password the
                next time you sign in anywhere else.
              </Text>
            </View>
          </Animated.View>
        </Animated.ScrollView>

        <ActionBar
          enabled={canSubmit}
          label="Update Password"
          hint={hint}
          onPress={handleUpdate}
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

const PasswordField = React.forwardRef(
  (
    { label, icon, error, success, footer, onChangeText, value, ...props },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [revealed, setRevealed] = useState(false);
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

    const leadingColor = error
      ? ERROR_INK
      : success
      ? ACCENT.success
      : focused
      ? ACCENT.primary
      : INK.muted;

    return (
      <View style={styles.field}>
        <Text style={styles.fieldLabel} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {label}
        </Text>

        <Animated.View
          style={[
            styles.fieldWell,
            wellStyle,
            !!error && styles.fieldWellError,
            !error && success && styles.fieldWellSuccess,
          ]}
        >
          <MaterialCommunityIcons
            name={success && !error ? 'check-circle-outline' : icon}
            size={wp('4.6%')}
            color={leadingColor}
            style={styles.fieldIcon}
          />

          <TextInput
            ref={ref}
            style={styles.fieldInput}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={INK.faint}
            secureTextEntry={!revealed}
            autoCapitalize="none"
            autoCorrect={false}
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

          <TouchableOpacity
            onPress={() => setRevealed(prev => !prev)}
            hitSlop={hitSlopTo(wp('5%'))}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
          >
            <MaterialCommunityIcons
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              size={wp('5%')}
              color={focused ? INK.base : INK.faint}
            />
          </TouchableOpacity>
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

        {footer}
      </View>
    );
  },
);

PasswordField.displayName = 'PasswordField';

const StrengthPanel = ({ visible, score, checks }) => {
  if (!visible) return null;

  return (
    <View style={styles.strengthPanel}>
      <View style={styles.meterRow}>
        {Array.from({ length: METER_SEGMENTS }).map((_, index) => (
          <MeterSegment key={index} filled={index < score} score={score} />
        ))}
        <Text
          style={[styles.strengthLabel, { color: strengthInk(score) }]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {STRENGTH_COPY[score]}
        </Text>
      </View>

      <View style={styles.checkList}>
        {checks.map(check => (
          <View key={check.key} style={styles.checkRow}>
            <MaterialCommunityIcons
              name={check.passed ? 'check-circle' : 'circle-small'}
              size={wp('3.8%')}
              color={check.passed ? ACCENT.success : INK.faint}
            />
            <Text
              style={[styles.checkText, check.passed && styles.checkTextPassed]}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {check.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const MeterSegment = ({ filled, score }) => {
  const target = filled ? strengthInk(score) : METER_TRACK;
  const style = useAnimatedStyle(() => ({
    backgroundColor: withTiming(target, METER_FADE),
  }));

  return <Animated.View style={[styles.meterSegment, style]} />;
};

const ActionBar = ({ enabled, label, hint, onPress }) => {
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
            name={enabled ? 'lock-check-outline' : 'lock-outline'}
            size={wp('4.6%')}
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

export default ChangePasswordScreen;

const FIELD_REST = '#F7F5F3';
const FIELD_BORDER_WIDTH = 1.5;
const ERROR_INK = ACCENT.discount;
const ERROR_SOFT = '#FDF1EC';
const RESTING_INK = '#9A5B38';

const METER_SEGMENTS = 4;
const METER_TRACK = 'rgba(17,19,26,0.08)';
const strengthInk = score =>
  score <= 1 ? ERROR_INK : score === 2 ? '#B45309' : ACCENT.success;

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
    paddingBottom: SPACE.xl,
    backgroundColor: CANVAS,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
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
    paddingBottom: SPACE.md,
  },
  heroInner: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.base,
  },
  heroTitle: {
    ...TYPE.title,
    fontSize: Math.round(TYPE.title.fontSize * 1.08),
    lineHeight: Math.round(TYPE.title.lineHeight * 1.08),
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    ...TYPE.label,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
    marginTop: SPACE.xs + 2,
    maxWidth: wp('82%'),
  },

  fieldGroup: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.lg,
  },
  field: {
    marginBottom: SPACE.base,
  },
  fieldLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: SPACE.xs + 2,
  },
  fieldWell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6.6%'),
    borderRadius: RADIUS.md,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: SPACE.md,
  },
  fieldWellError: {
    backgroundColor: ERROR_SOFT,
    borderColor: ERROR_INK,
  },
  fieldWellSuccess: {
    borderColor: ACCENT.success,
  },
  fieldIcon: {
    marginRight: SPACE.md,
  },
  fieldInput: {
    flex: 1,
    letterSpacing: 1.2,
    bottom: Platform.OS === 'ios' ? hp(0.5) : hp(0),
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.strong,
    paddingVertical: SPACE.md,
    paddingRight: SPACE.md,
    includeFontPadding: false,
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

  strengthPanel: {
    marginTop: SPACE.md,
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs + 2,
  },
  meterSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    width: wp('17%'),
    textAlign: 'right',
    marginLeft: SPACE.xs,
  },
  checkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACE.sm,
    gap: SPACE.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginLeft: SPACE.xs,
  },
  checkTextPassed: {
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.successText,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACE.xs,
    padding: SPACE.md,
    borderRadius: RADIUS.sm,
    backgroundColor: SURFACE.sunken,
  },
  noteIcon: {
    marginTop: 1,
  },
  noteText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginLeft: SPACE.sm,
    flex: 1,
  },

  actionBar: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    backgroundColor: SURFACE.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  actionButton: {
    flexDirection: 'row',
    minHeight: hp('6.4%'),
    borderRadius: RADIUS.md,
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
    ...TYPE.body,
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    letterSpacing: 0.2,
  },
  actionButtonTextDisabled: {
    color: RESTING_INK,
  },
  actionButtonIcon: {
    marginRight: SPACE.sm,
  },
});
