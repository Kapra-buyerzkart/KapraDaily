import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
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
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';
import { SERVICES, SERVICE_TYPES, LAST_SELECTED_SERVICE_KEY } from '../config/services';
import ConfirmationModal from './ConfirmationModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ServiceCard = memo(({ service, isActive, onPress }) => {
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
    <Animated.View style={cardStyle}>
      <Pressable
        onPress={() => onPress(service)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`${service.title}. ${service.description}`}
      >
        <View
          style={[styles.iconCircle, { backgroundColor: `${service.iconColor}1A` }]}
        >
          <Ionicons name={service.icon} size={wp('6.5%')} color={service.iconColor} />
        </View>

        <View style={styles.cardTextWrap}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{service.title}</Text>
            {service.badge ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{service.badge}</Text>
              </View>
            ) : null}
            {isActive ? (
              <View style={styles.activeBadge}>
                <Ionicons name="checkmark-circle" size={wp('3.2%')} color="#1FA855" />
                <Text style={styles.activeBadgeText}>Currently Active</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.cardDescription}>{service.description}</Text>
        </View>

        <Ionicons name="chevron-forward" size={wp('5.5%')} color="#BBBBBB" />
      </Pressable>
    </Animated.View>
  );
});

const ServiceSwitcherModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [installConfirmService, setInstallConfirmService] = useState(null);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const pendingActionRef = useRef(null);

  const onCloseAnimationComplete = useCallback(() => {
    setModalVisible(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  }, []);

  useEffect(() => {
    if (visible) {
      AsyncStorage.getItem(LAST_SELECTED_SERVICE_KEY)
        .then(id => {
          if (id) setActiveServiceId(id);
        })
        .catch(() => {});

      setModalVisible(true);
      translateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.cubic) });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else if (modalVisible) {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220 }, finished => {
        if (finished) {
          runOnJS(onCloseAnimationComplete)();
        }
      });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
      setActiveServiceId(service.id);
      AsyncStorage.setItem(LAST_SELECTED_SERVICE_KEY, service.id).catch(() => {});

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
    [navigation, openPartnerApp, requestClose],
  );

  const handleInstallConfirm = useCallback(() => {
    const service = installConfirmService;
    setInstallConfirmService(null);
    if (!service) return;
    const storeUrl = Platform.OS === 'ios' ? service.storeUrl.ios : service.storeUrl.android;
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
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => requestClose()}>
            <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
              {Platform.OS === 'ios' ? (
                <BlurView
                  style={StyleSheet.absoluteFill}
                  blurType="dark"
                  blurAmount={8}
                  reducedTransparencyFallbackColor="black"
                />
              ) : (
                <View
                  style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.55)' }]}
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
                <Text style={styles.title} accessibilityRole="header">
                  Choose Service
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
              {SERVICES.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isActive={activeServiceId === service.id}
                  onPress={handleServicePress}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={!!installConfirmService}
        title="Partner App not installed"
        message="Would you like to install it?"
        confirmText="Install"
        cancelText="Cancel"
        onClose={() => setInstallConfirmService(null)}
        onConfirm={handleInstallConfirm}
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
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('5%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.poppins.regular,
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
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: wp('4.5%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconCircle: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('6.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3.5%'),
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  cardTitle: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.1%'),
    color: '#111111',
  },
  cardDescription: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.2%'),
    color: '#888888',
    marginTop: hp('0.3%'),
  },
  badge: {
    backgroundColor: '#F25000',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1.8%'),
    paddingVertical: hp('0.1%'),
  },
  badgeText: {
    fontFamily: FONTS.poppins.semiBold,
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
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('2.4%'),
    color: '#1FA855',
  },
});

export default ServiceSwitcherModal;
