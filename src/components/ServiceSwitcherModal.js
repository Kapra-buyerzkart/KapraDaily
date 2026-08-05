import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  memo,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';
import {
  SERVICES,
  SERVICE_TYPES,
  LAST_SELECTED_SERVICE_KEY,
} from '../config/services';
import ConfirmationModal from './ConfirmationModal';
import ComingSoonModal from './ComingSoonModal';
import { AppContext } from '../context/appContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// General-settings flags come back as string/number "1" when enabled.
const isSettingEnabled = value =>
  value === '1' || value === 1 || value === true;

const clearTimer = ref => {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
};

const ServiceCard = memo(({ service, isActive, comingSoon, onPress }) => {
  const scale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 220 });
  };

  return (
    <Animated.View style={[cardStyle, comingSoon && styles.cardDisabled]}>
      <Pressable
        onPress={() => onPress(service)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${service.title}. ${service.description}${
          comingSoon ? '. Coming soon' : ''
        }`}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: `${service.iconColor}1A` },
          ]}
        >
          {service.logo ? (
            <Image
              source={service.logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          ) : (
            <Ionicons
              name={service.icon}
              size={wp('6.5%')}
              color={service.iconColor}
            />
          )}
        </View>

        <View style={styles.cardTextWrap}>
          <View style={styles.cardTitleRow}>
            {service?.titleImage ? (
              <Image
                source={service.titleImage}
                style={styles.titleImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.cardTitle}>{service.title}</Text>
            )}
            {service.badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{service.badge}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.cardDescription}>{service.description}</Text>
        </View>

        <Ionicons name="chevron-forward" size={wp('5.5%')} color="gray" />
      </Pressable>
    </Animated.View>
  );
});

const ServiceSwitcherModal = ({ visible, onClose, excludeServiceId }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { generalSettings } = useContext(AppContext);

  // A service is "coming soon" when it opts in statically (`comingSoon`) or when
  // its backend flag (`enabledSettingKey`, e.g. 48hrs -> `showkshope`) is off.
  const isComingSoon = useCallback(
    service =>
      Boolean(
        service.comingSoon ||
          (service.enabledSettingKey &&
            !isSettingEnabled(generalSettings?.[service.enabledSettingKey])),
      ),
    [generalSettings],
  );

  // Hide the service the user is already on (e.g. Uden Tickets on the movie
  // ticket landing screen) so the switcher only offers other destinations.
  const services = excludeServiceId
    ? SERVICES.filter(service => service.id !== excludeServiceId)
    : SERVICES;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [installConfirmService, setInstallConfirmService] = useState(null);
  const [comingSoonService, setComingSoonService] = useState(null);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const pendingActionRef = useRef(null);
  const unmountTimerRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  // Read inside the [visible]-only effect below, where `modalVisible` state
  // would be a stale closure.
  const modalVisibleRef = useRef(false);
  modalVisibleRef.current = modalVisible;

  // Runs whatever was queued for "after the sheet is gone", exactly once.
  const runPendingAction = useCallback(() => {
    clearTimer(fallbackTimerRef);
    const action = pendingActionRef.current;
    if (!action) return;
    pendingActionRef.current = null;
    action();
  }, []);

  const onCloseAnimationComplete = useCallback(() => {
    clearTimer(unmountTimerRef);
    setModalVisible(false);
    if (!pendingActionRef.current) return;

    // The queued action (navigate / deep link) must not run until the native
    // Modal window is genuinely torn down. On iOS that moment is the Modal's
    // `onDismiss`; anything earlier races the dismissal against the screen
    // transition and can strand a transparent, full-screen modal window that
    // swallows every touch — the UI still renders but nothing responds. That
    // only bites when the Modal's host is itself a stack screen being detached
    // (the movie ticket landing screen), which is why the home screen — whose
    // host tab navigator outlives the navigation — never showed it.
    //
    // Android has no `onDismiss`, so fall back to two frames there. The timer
    // is a safety net so the action is never stranded if `onDismiss` is missed.
    if (Platform.OS === 'ios') {
      clearTimer(fallbackTimerRef);
      fallbackTimerRef.current = setTimeout(runPendingAction, 500);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(runPendingAction));
    }
  }, [runPendingAction]);

  useEffect(() => {
    if (visible) {
      clearTimer(unmountTimerRef);

      AsyncStorage.getItem(LAST_SELECTED_SERVICE_KEY)
        .then(id => {
          if (id) setActiveServiceId(id);
        })
        .catch(() => {});

      setModalVisible(true);
      translateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else if (modalVisibleRef.current) {
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 220 },
        finished => {
          if (finished) {
            runOnJS(onCloseAnimationComplete)();
          }
        },
      );
      backdropOpacity.value = withTiming(0, { duration: 200 });

      // An interrupted animation never invokes its callback, which would leave
      // the Modal mounted and off-screen — again a full-screen touch trap. Tear
      // down on a timer regardless; reopening clears it in the branch above.
      clearTimer(unmountTimerRef);
      unmountTimerRef.current = setTimeout(onCloseAnimationComplete, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(
    () => () => {
      clearTimer(unmountTimerRef);
      clearTimer(fallbackTimerRef);
    },
    [],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const requestClose = useCallback(
    (afterClose = null) => {
      pendingActionRef.current = afterClose;
      onClose();
    },
    [onClose],
  );

  const openPartnerApp = useCallback(async service => {
    try {
      const supported = await Linking.canOpenURL(service.deeplink);
      if (supported) {
        await Linking.openURL(service.deeplink);
      } else {
        setInstallConfirmService(service);
      }
    } catch (error) {
      setInstallConfirmService(service);
    }
  }, []);

  const handleServicePress = useCallback(
    service => {
      // Close the sheet first: presenting Coming Soon while this Modal is still
      // up stacks two native modals, which iOS refuses ("already presenting")
      // and which leaves the UI wedged.
      if (isComingSoon(service)) {
        requestClose(() => setComingSoonService(service));
        return;
      }

      setActiveServiceId(service.id);
      AsyncStorage.setItem(LAST_SELECTED_SERVICE_KEY, service.id).catch(
        () => {},
      );

      if (service.type === SERVICE_TYPES.INTERNAL) {
        requestClose(() => {
          if (service.params) {
            navigation.navigate(service.route, service.params);
          } else {
            navigation.navigate(service.route);
          }
        });
      } else {
        requestClose(() => openPartnerApp(service));
      }
    },
    [navigation, openPartnerApp, requestClose, isComingSoon],
  );

  const handleInstallConfirm = useCallback(() => {
    const service = installConfirmService;
    setInstallConfirmService(null);
    if (!service) return;
    const storeUrl =
      Platform.OS === 'ios' ? service.storeUrl.ios : service.storeUrl.android;
    Linking.openURL(storeUrl).catch(() => {});
  }, [installConfirmService]);

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => requestClose()}
        onDismiss={runPendingAction}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => requestClose()}
          >
            <Animated.View
              style={[StyleSheet.absoluteFill, backdropStyle]}
              pointerEvents="none"
            >
              {Platform.OS === 'ios' ? (
                <BlurView
                  style={StyleSheet.absoluteFill}
                  blurType="dark"
                  blurAmount={8}
                  reducedTransparencyFallbackColor="black"
                />
              ) : (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(0,0,0,0.55)' },
                  ]}
                />
              )}
            </Animated.View>
          </Pressable>

          <Animated.View
            style={[
              styles.sheet,
              sheetStyle,
              { paddingBottom: Math.max(insets.bottom, hp('2%')) },
            ]}
          >
            <View
              style={styles.handle}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />

            <View style={styles.headerRow}>
              <View style={styles.headerTextWrap}>
                <Text accessibilityRole="header">
                  <Text style={styles.title}>Choose </Text>
                  <Text style={styles.titleAccent}>Shops</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Select how you would like to continue
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => requestClose()}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={wp('5%')} color="#666666" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardsWrap}>
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isActive={activeServiceId === service.id}
                  comingSoon={isComingSoon(service)}
                  onPress={handleServicePress}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={!!installConfirmService}
        title="48hrs App not installed"
        message="Would you like to install it?"
        confirmText="Install"
        cancelText="Cancel"
        onClose={() => setInstallConfirmService(null)}
        onConfirm={handleInstallConfirm}
      />

      <ComingSoonModal
        visible={!!comingSoonService}
        onClose={() => setComingSoonService(null)}
        title={`${comingSoonService?.title ?? ''} Coming Soon!`}
        message="We're working hard to bring this to you. Stay tuned!"
      />
    </>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp('7%'),
    borderTopRightRadius: wp('7%'),
    paddingTop: hp('1.2%'),
    paddingHorizontal: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  handle: {
    alignSelf: 'center',
    width: wp('12%'),
    height: hp('0.5%'),
    borderRadius: wp('2%'),
    backgroundColor: '#E2E2E2',
    marginBottom: hp('1.5%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: wp('3%'),
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.5%'),
    color: '#000000',
  },
  titleAccent: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.5%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: '#777777',
    marginTop: hp('0.4%'),
  },
  closeButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsWrap: {
    gap: hp('1.5%'),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5.5%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardDisabled: {
    opacity: 0.55,
  },
  iconCircle: {
    resizeMode: 'contain',
    borderRadius: wp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4.5%'),
  },
  logoImage: {
    width: wp('8%'),
    height: wp('8%'),
    // backgroundColor: 'red',
  },
  cardTextWrap: {
    flex: 1,
    // backgroundColor: 'red',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  cardTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.1%'),
    color: '#111111',
  },
  titleImage: {
    width: wp('28%'),
    height: hp('2.5%'),
    right: 25,
    alignSelf: 'flex-start',
  },
  cardDescription: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.2%'),
    color: '#888888',
    marginTop: hp('0.3%'),
    textAlign: 'left',
  },
  badge: {
    backgroundColor: '#F25000',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1.8%'),
    paddingVertical: hp('0.1%'),
  },
  badgeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.4%'),
    color: '#FFFFFF',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F8EF',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1.8%'),
    paddingVertical: hp('0.2%'),
    gap: wp('1%'),
  },
  activeBadgeText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.4%'),
    color: '#1FA855',
  },
});

export default ServiceSwitcherModal;
