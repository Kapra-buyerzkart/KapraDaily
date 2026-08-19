import { DEALS48_ROUTES } from '../../navigation/routes';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
  BackHandler,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';
import { getOrderDetailsApi } from '../../api/services/orderService';

const { width } = Dimensions.get('window');

const OrderSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    orderId,
    orderNumber,
    paymentMethod,
    totalItems,
    totalAmount,
    deliveryMode,
    address,
  } = route.params || {};

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    if (orderId) {
      fetchOrderDetails();
    }

    // Prevent Android hardware back button
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Prevent navigation remove (iOS swipe, back button)
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      const action = e.data.action;
      if (action.type === 'RESET' || action.type === 'REPLACE') {
        return;
      }
      e.preventDefault();
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [orderId, navigation]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderDetailsApi(orderId);
      if (response?.success && response?.data) {
        setOrderDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const displayOrderNumber =
    orderDetails?.orderNumber || orderNumber || orderId || '--';
  const displayPayment = orderDetails?.paymentMethod || paymentMethod || 'COD';
  const displayItems =
    orderDetails?.totalItems || orderDetails?.items?.length || totalItems || 0;
  const displayTotal =
    orderDetails?.grandTotal || orderDetails?.totalAmount || totalAmount || 0;
  const displayDeliveryMode =
    orderDetails?.deliveryMode || deliveryMode || 'express';
  const displayAddress = address || '';

  const getPaymentLabel = (method: string) => {
    if (!method) return 'Cash On Delivery';
    const m = method.toUpperCase();
    if (m === 'COD') return 'Cash On Delivery';
    if (m === 'ONLINE' || m === 'UPI') return 'Online Payment';
    return method;
  };

  const handleViewOrders = () => {
    navigation.navigate(DEALS48_ROUTES.MY_ORDERS);
  };

  const handleBackToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: DEALS48_ROUTES.HOME }],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.successIconContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <LinearGradient
              colors={[colors.themeTeal, colors.themeDarkTeal]}
              style={styles.iconGradient}
            >
              <AppIcons.Check color={colors.white} size={60} />
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}
          >
            <Text style={styles.title}>Order Placed Successfully!</Text>
            <Text style={styles.subtitle}>
              Thank you for choosing Kapra. Your order has been placed and is
              being processed.
            </Text>

            <View style={styles.orderCard}>
              <View style={styles.orderRow}>
                <Text style={styles.label}>Order Number</Text>
                <Text style={styles.value}>#{displayOrderNumber}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.orderRow}>
                <Text style={styles.label}>Payment</Text>
                <View style={styles.paymentBadge}>
                  <Text style={styles.paymentBadgeText}>
                    {getPaymentLabel(displayPayment)}
                  </Text>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.orderRow}>
                <Text style={styles.label}>Total Items</Text>
                <Text style={styles.value}>
                  {displayItems} item{displayItems !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.separator} />
              {/* <View style={styles.orderRow}>
                                <Text style={styles.label}>Delivery</Text>
                                <View style={styles.deliveryBadge}>
                                    <Text style={styles.deliveryBadgeText}>
                                        {displayDeliveryMode === 'express' ? 'Express (20-30 min)' : 'Slotted'}
                                    </Text>
                                </View>
                            </View> */}
              {displayAddress ? (
                <>
                  <View style={styles.separator} />
                  <View style={styles.orderRow}>
                    <Text style={styles.label}>Delivering to</Text>
                    <Text style={styles.valueSmall} numberOfLines={2}>
                      {displayAddress}
                    </Text>
                  </View>
                </>
              ) : null}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>
                  ₹{Number(displayTotal).toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.trackButton} onPress={handleViewOrders}>
          <LinearGradient
            colors={[colors.themeTeal, colors.themeDarkTeal]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.trackButtonText}>View My Orders</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: colors.themeTeal,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.gilroyMedium,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  orderCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    padding: 20,
    width: width - 60,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 20,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.gilroyMedium,
    color: '#999',
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
  },
  valueSmall: {
    fontSize: 13,
    fontFamily: Fonts.gilroyMedium,
    color: '#333',
    maxWidth: width * 0.5,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
  },
  paymentBadge: {
    backgroundColor: '#E8F8FA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  paymentBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.gilroyBold,
    color: colors.themeTeal,
  },
  deliveryBadge: {
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deliveryBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.gilroyBold,
    color: '#F25000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
  },
  totalAmount: {
    fontSize: 22,
    fontFamily: Fonts.gilroyBold,
    color: colors.themeTeal,
  },
  footer: {
    padding: 24,
    paddingBottom: 34,
    gap: 12,
  },
  trackButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: Fonts.gilroyBold,
  },
  homeButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  homeButtonText: {
    color: '#666',
    fontSize: 16,
    fontFamily: Fonts.gilroyBold,
  },
});

export default OrderSuccessScreen;
