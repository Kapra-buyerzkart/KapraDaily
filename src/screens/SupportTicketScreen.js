import React, { useContext, useRef, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import icons from '@/assets/icons';
import { FONTS } from '../styles/typography';
import { AppContext } from '../context/appContext';
import { LoaderContext } from '../context/loaderContext';
import { createSupportTicketApi } from '../api/supportService';
import StatusModal from '../components/StatusModal';
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
const CHIP_FADE = { duration: 180 };

const PRIORITY_OPTIONS = [
  {
    key: 'normal',
    label: 'Normal',
    icon: 'clock-outline',
    tint: ACCENT.primary,
    soft: ACCENT.primarySoft,
    hint: 'General question — we’ll get to it in turn.',
  },
  {
    key: 'urgent',
    label: 'Urgent',
    icon: 'flash-outline',
    tint: '#F2994A',
    soft: '#FEF3E7',
    hint: 'Time-sensitive — needs a quicker look.',
  },
  {
    key: 'high',
    label: 'High',
    icon: 'alert-outline',
    tint: '#EB5757',
    soft: '#FDECEC',
    hint: 'Something is blocked or badly wrong.',
  },
];

const SupportTicketScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId: passedOrderId, orderNumber: passedOrderNumber } =
    route.params || {};
  const { profile } = useContext(AppContext);
  const { showLoader } = useContext(LoaderContext);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [orderNumber, setOrderNumber] = useState(
    passedOrderNumber || (passedOrderId ? passedOrderId.toString() : ''),
  );
  const [internalOrderId, setInternalOrderId] = useState(passedOrderId || 0);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const orderRef = useRef(null);
  const messageRef = useRef(null);

  const orderLocked = Boolean(passedOrderId || passedOrderNumber);
  const selectedPriority =
    PRIORITY_OPTIONS.find(option => option.key === priority) ??
    PRIORITY_OPTIONS[0];

  const isComplete = Boolean(title.trim() && message.trim());
  const hint = !title.trim()
    ? 'Add a title to continue'
    : !message.trim()
    ? 'Describe your issue to continue'
    : 'Submit Ticket';

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setStatusType('error');
      setStatusTitle('Missing Information');
      setStatusMessage('Please provide both a title and a message.');
      setStatusModalVisible(true);
      return;
    }

    try {
      showLoader(true);
      const payload = {
        title: title.trim(),
        message: message.trim(),
        priority: priority,
        orderId: internalOrderId || (orderNumber ? parseInt(orderNumber) : 0),
      };
      const response = await createSupportTicketApi(payload);
      if (response?.success) {
        setStatusType('success');
        setStatusTitle('Ticket Created');
        setStatusMessage(
          'Your support ticket has been created successfully. Our team will get back to you soon.',
        );
        setStatusModalVisible(true);
        setTitle('');
        setMessage('');
        setPriority('normal');
        if (!passedOrderId && !passedOrderNumber) {
          setOrderNumber('');
          setInternalOrderId(0);
        }
      } else {
        setStatusType('error');
        setStatusTitle('Error');
        setStatusMessage(
          response?.message || 'Failed to create support ticket.',
        );
        setStatusModalVisible(true);
      }
    } catch (error) {
      console.error('Create Ticket Error Details:', error);
      setStatusType('error');
      setStatusTitle('Error');
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.Message ||
            error?.message ||
            error?.response?.data?.Message ||
            error?.response?.data?.message ||
            'An unexpected error occurred';
      setStatusMessage(errorMessage);
      setStatusModalVisible(true);
    } finally {
      showLoader(false);
    }
  };

  const handleModalClose = () => {
    setStatusModalVisible(false);
    if (statusType === 'success') {
      navigation.goBack();
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
            title="Support Ticket"
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
                How can we help?
              </Text>

              <Text style={styles.heroSubtitle} maxFontSizeMultiplier={1.2}>
                Share a few details about the issue and our support team will
                get back to you soon.
              </Text>
            </Animated.View>
          </LinearGradient>

          <Animated.View style={styles.fieldGroup} entering={entrance(1)}>
            <FormField
              label="Title"
              icon="text-short"
              placeholder="Enter subject"
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
              onSubmitEditing={() =>
                orderLocked
                  ? messageRef.current?.focus()
                  : orderRef.current?.focus()
              }
            />

            {orderLocked ? (
              <View style={styles.field}>
                <Text
                  style={styles.fieldLabel}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Order Number
                </Text>

                <View style={styles.linkedOrderCard}>
                  <View style={styles.linkedOrderIcon}>
                    <MaterialCommunityIcons
                      name="receipt"
                      size={wp('4.8%')}
                      color={ACCENT.primary}
                    />
                  </View>

                  <View style={styles.linkedOrderCopy}>
                    <Text
                      style={styles.linkedOrderCaption}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      Linked to your order
                    </Text>
                    <Text
                      style={styles.linkedOrderValue}
                      numberOfLines={1}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {orderNumber}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={wp('4.2%')}
                    color={INK.faint}
                  />
                </View>
              </View>
            ) : (
              <FormField
                ref={orderRef}
                label="Order Number (Optional)"
                icon="receipt"
                placeholder="e.g. ORD123"
                value={orderNumber}
                onChangeText={val => {
                  setOrderNumber(val);
                  setInternalOrderId(0);
                }}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => messageRef.current?.focus()}
                helper="Attach a specific order so we can pull up the details faster."
              />
            )}

            {}
            <View style={styles.field}>
              <Text
                style={styles.fieldLabel}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Priority
              </Text>

              <View style={styles.priorityRow}>
                {PRIORITY_OPTIONS.map(option => (
                  <PriorityChip
                    key={option.key}
                    option={option}
                    selected={priority === option.key}
                    onPress={() => setPriority(option.key)}
                  />
                ))}
              </View>

              <View style={styles.priorityHintRow}>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: selectedPriority.tint },
                  ]}
                />
                <Text
                  style={styles.priorityHintText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {selectedPriority.hint}
                </Text>
              </View>
            </View>

            <FormField
              ref={messageRef}
              label="Message"
              icon="message-text-outline"
              placeholder="Describe your issue..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              counter={
                message.length > 0
                  ? `${message.trim().length} characters`
                  : undefined
              }
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
                {profile?.phoneNo
                  ? `Our team reviews every ticket and will reach you on ${profile.phoneNo}.`
                  : 'Our team reviews every ticket and will get back to you soon.'}
              </Text>
            </View>
          </Animated.View>
        </Animated.ScrollView>

        <ActionBar
          complete={isComplete}
          label="Submit Ticket"
          hint={hint}
          onPress={handleSubmit}
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

const FormField = React.forwardRef(
  (
    { label, icon, helper, counter, multiline, onChangeText, value, ...props },
    ref,
  ) => {
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
          {label}
        </Text>

        <Animated.View
          style={[
            styles.fieldWell,
            multiline && styles.fieldWellMultiline,
            wellStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={wp('4.6%')}
            color={focused ? ACCENT.primary : INK.muted}
            style={[styles.fieldIcon, multiline && styles.fieldIconMultiline]}
          />

          <TextInput
            ref={ref}
            style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={INK.faint}
            multiline={multiline}
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

        {(!!helper || !!counter) && (
          <View style={styles.fieldFooter}>
            <Text
              style={styles.fieldHelper}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {helper ?? ''}
            </Text>
            {!!counter && (
              <Text
                style={styles.fieldCounter}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {counter}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  },
);

FormField.displayName = 'FormField';

const PriorityChip = ({ option, selected, onPress }) => {
  const scale = useSharedValue(1);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      selected ? option.tint : option.soft,
      CHIP_FADE,
    ),
    borderColor: withTiming(selected ? option.tint : 'transparent', CHIP_FADE),
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.priorityChipHit}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.96, PRESS_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_OUT);
      }}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${option.label} priority`}
    >
      <Animated.View
        style={[
          styles.priorityChip,
          selected && styles.priorityChipRaised,
          chipStyle,
        ]}
      >
        <MaterialCommunityIcons
          name={option.icon}
          size={wp('4.2%')}
          color={selected ? INK.onDark : option.tint}
        />
        <Text
          style={[
            styles.priorityChipText,
            { color: selected ? INK.onDark : option.tint },
            selected && styles.priorityChipTextActive,
          ]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {option.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const ActionBar = ({ complete, label, hint, onPress }) => {
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
        onPressIn={() => {
          scale.value = withTiming(0.98, PRESS_IN);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, PRESS_OUT);
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={complete ? undefined : hint}
      >
        <Animated.View
          style={[
            styles.actionButton,
            !complete && styles.actionButtonResting,
            buttonStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={complete ? 'send-outline' : 'pencil-outline'}
            size={wp('4.6%')}
            color={complete ? INK.onDark : RESTING_INK}
            style={styles.actionButtonIcon}
          />
          <Text
            style={[
              styles.actionButtonText,
              !complete && styles.actionButtonTextResting,
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {complete ? label : hint}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default SupportTicketScreen;

const FIELD_REST = '#F7F5F3';
const FIELD_BORDER_WIDTH = 1.5;
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
  heroBadge: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.base,
    marginBottom: SPACE.md,
    shadowColor: '#8A4A25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
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
  fieldWellMultiline: {
    alignItems: 'flex-start',
    minHeight: hp('16%'),
    paddingVertical: SPACE.md,
  },
  fieldIcon: {
    marginRight: SPACE.md,
  },
  fieldIconMultiline: {
    marginTop: hp('0.3%'),
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 0,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.strong,
  },
  fieldInputMultiline: {
    textAlignVertical: 'top',
    minHeight: hp('12%'),
  },
  fieldFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.xs + 2,
    paddingHorizontal: SPACE.xs,
  },
  fieldHelper: {
    ...TYPE.micro,
    flex: 1,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
  },
  fieldCounter: {
    ...TYPE.micro,
    color: INK.faint,
    fontFamily: FONTS.gilroy.medium,
    marginLeft: SPACE.sm,
  },

  linkedOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: FIELD_BORDER_WIDTH,
    borderColor: ACCENT.primarySoft,
    backgroundColor: SURFACE.tint,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
  },
  linkedOrderIcon: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.base,
    marginRight: SPACE.md,
  },
  linkedOrderCopy: {
    flex: 1,
  },
  linkedOrderCaption: {
    ...TYPE.micro,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
  },
  linkedOrderValue: {
    ...TYPE.body,
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    marginTop: 1,
  },

  priorityRow: {
    flexDirection: 'row',
    marginHorizontal: -SPACE.xs,
  },
  priorityChipHit: {
    flex: 1,
    paddingHorizontal: SPACE.xs,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('5.4%'),
    borderRadius: RADIUS.pill,
    borderWidth: FIELD_BORDER_WIDTH,
    paddingHorizontal: SPACE.sm,
  },
  priorityChipRaised: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  priorityChipText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    marginLeft: SPACE.xs + 2,
  },
  priorityChipTextActive: {
    fontFamily: FONTS.gilroy.bold,
  },
  priorityHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.xs,
  },
  priorityDot: {
    width: wp('1.6%'),
    height: wp('1.6%'),
    borderRadius: RADIUS.pill,
    marginRight: SPACE.sm,
  },
  priorityHintText: {
    ...TYPE.micro,
    flex: 1,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.sunken,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
    marginTop: SPACE.xs,
  },
  noteIcon: {
    marginRight: SPACE.sm,
    marginTop: 1,
  },
  noteText: {
    ...TYPE.caption,
    flex: 1,
    color: INK.muted,
    fontFamily: FONTS.gilroy.regular,
  },

  actionBar: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    backgroundColor: CANVAS,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('6.6%'),
    borderRadius: RADIUS.md,
    backgroundColor: ACCENT.primary,
    shadowColor: ACCENT.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  actionButtonResting: {
    backgroundColor: ACCENT.primarySoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonIcon: {
    marginRight: SPACE.sm,
  },
  actionButtonText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    letterSpacing: 0.2,
  },
  actionButtonTextResting: {
    color: RESTING_INK,
    fontFamily: FONTS.gilroy.semiBold,
  },
});
