import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  FlatList,
  ImageBackground,
  Linking,
  BackHandler,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  useNavigation,
  useRoute,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import {
  INK,
  ACCENT,
  HAIRLINE,
  RADIUS,
  SURFACE,
  SPACE,
} from '../styles/homeTheme';
import OrderProductCard from '../components/OrderProductCard';
import OrderStatusBanner from '../components/OrderStatusBanner';
import ConfirmationModal from '../components/ConfirmationModal';
import ReturnItemModal from '../components/ReturnItemModal';
import { useOrderDetails } from '../hooks/useOrderDetails';
import { useOrderTracking } from '../hooks/useOrderTracking';
import AppButton from '../components/AppButton';
import CustomLoader from '../components/CustomLoader';
import CONFIG from '../globals/config';
import { openExternalUrl } from '../utils/safeUrl';
import RatingModal from '../components/RatingModal';
import StatusModal from '../components/StatusModal';
import BillSection from '../components/BillSection';
import RazorpayCheckout from 'react-native-razorpay';
import { verifyRazorpayPaymentApi } from '../api/paymentService';
import Toast from 'react-native-simple-toast';

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    orderId,
    order: initialOrderData,
    autoScrollToRetry,
  } = route.params || {};

  const scrollViewRef = React.useRef(null);
  const [retryYOffset, setRetryYOffset] = useState(0);
  const retryPulseAnim = useRef(new Animated.Value(0)).current;
  const [showRetryHint, setShowRetryHint] = useState(false);

  const {
    loading,
    orderStatus,
    showCancelModal,
    setShowCancelModal,
    showReturnModal,
    setShowReturnModal,
    selectedReturnItem,
    setSelectedReturnItem,

    effectiveOrderStatus,
    storeName,
    shippingAddress,
    fullAddress,
    cityStateZip,
    paymentMethod,
    grandTotal,
    displayOrderId,
    orderDate,
    orderItems,
    itemCount,
    deliveryAgentName,
    deliveryAgentPhone,

    handleCancelOrder,
    handleReturnItem,
    refreshOrder,
    submitDeliveryAgentRating,
    submitOrderRating,

    formattedOrderDate,
    bill,
    invoiceUrl,
    invoiceFileUrl,
    invoiceNumber,
    canMarkDeliveryReview,
    canMarkOverallReview,
    canShowDeliveryAgent,
    canRetryPayment,
    hasOnlinePaid,
    paymentStatus,
    rawOrderStatus,
    formattedCancelledAt,
    formattedDeliveredAt,
    cancellationReason,
    razorpayOrderId,
    razorpayAmount,
    razorpayKeyId,
  } = useOrderDetails(orderId, initialOrderData);

  const resolvedInvoiceUrl = React.useMemo(() => {
    if (!invoiceFileUrl) {
      return null;
    }
    return invoiceFileUrl.startsWith('http')
      ? invoiceFileUrl
      : `${CONFIG.image_base_url}${invoiceFileUrl}`;
  }, [invoiceFileUrl]);

  const handleViewInvoice = useCallback(() => {
    if (!resolvedInvoiceUrl) {
      Toast.show('Invoice not available yet', Toast.SHORT);
      return;
    }
    navigation.navigate('InvoiceViewerScreen', {
      invoiceUrl: resolvedInvoiceUrl,
      invoiceNumber,
      title: 'Invoice',
    });
  }, [resolvedInvoiceUrl, invoiceNumber, navigation]);

  const handleBackPress = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: {
              screen: 'Home',
              params: { screen: 'MyOrdersScreen' },
            },
          },
        ],
      }),
    );
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }, [handleBackPress]),
  );

  const insets = useSafeAreaInsets();
  const [showBillBreakdown, setShowBillBreakdown] = useState(false);
  const [orderRating, setOrderRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingType, setRatingType] = useState('order');
  const [pendingRating, setPendingRating] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (autoScrollToRetry && retryYOffset > 0 && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({
            y: retryYOffset - hp('10%'),
            animated: true,
          });
        }, 500);

        setShowRetryHint(true);
        Animated.loop(
          Animated.sequence([
            Animated.timing(retryPulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(retryPulseAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: false,
            }),
          ]),
        ).start();

        const timer = setTimeout(() => {
          retryPulseAnim.stopAnimation();
          retryPulseAnim.setValue(0);
          setShowRetryHint(false);
        }, 6000);

        return () => clearTimeout(timer);
      }
    }, [autoScrollToRetry, retryYOffset]),
  );

  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });
  const [retryLoading, setRetryLoading] = useState(false);

  const handleRetryPayment = async () => {
    console.log(
      '✅ [RETRY] Razorpay SDK Success:',
      razorpayOrderId,
      razorpayKeyId,
    );

    if (!razorpayOrderId || !razorpayKeyId) {
      console.log(
        '⚠️ [RETRY] Missing details - razorpayOrderId:',
        razorpayOrderId,
        'razorpayKeyId:',
        razorpayKeyId,
      );
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Retry Failed',
        message: 'Payment details are missing. Please contact support.',
      });
      return;
    }

    const options = {
      key: razorpayKeyId,
      amount: razorpayAmount,
      currency: 'INR',
      name: 'Kapra Daily',
      description: `Retry Payment for Order #${displayOrderId}`,
      order_id: razorpayOrderId,
      prefill: {
        contact:
          shippingAddress?.mobileNo ||
          shippingAddress?.phoneNo ||
          shippingAddress?.phone ||
          '',
      },
      theme: { color: '#F25000' },
    };

    try {
      const sdkResponse = await RazorpayCheckout.open(options);
      console.log('✅ [RETRY] Razorpay SDK Success:', sdkResponse);
      setRetryLoading(true);

      const verifyPayload = {
        orderId: orderId,
        razorpayOrderId: sdkResponse.razorpay_order_id,
        razorpayPaymentId: sdkResponse.razorpay_payment_id,
        razorpaySignature: sdkResponse.razorpay_signature,
        amount: Number(razorpayAmount),
      };

      let verifyResponse;
      let retryCount = 0;
      const maxRetries = 1;

      const attemptVerification = async () => {
        try {
          console.log(`🔍 [RETRY] Verification Attempt ${retryCount + 1}...`);
          return await verifyRazorpayPaymentApi(verifyPayload);
        } catch (e) {
          console.error(
            `⚠️ [RETRY] Verification Attempt ${retryCount + 1} Error:`,
            e,
          );
          return null;
        }
      };

      verifyResponse = await attemptVerification();

      while (
        (!verifyResponse?.success || verifyResponse?.status === 'pending') &&
        retryCount < maxRetries
      ) {
        retryCount++;
        console.log(
          `🔄 [RETRY] Retrying verification (Count: ${retryCount}) in 3s...`,
        );
        await new Promise(resolve => setTimeout(resolve, 3000));
        verifyResponse = await attemptVerification();
      }

      setRetryLoading(false);

      if (verifyResponse?.success) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'OrderSuccessScreen',
                params: {
                  orderId,
                  orderNumber: displayOrderId,
                  totalAmount: grandTotal,
                },
              },
            ],
          }),
        );
      } else {
        navigation.navigate('OrderPendingScreen', {
          orderId,
          orderNumber: displayOrderId,
          razorpayOrderId: sdkResponse.razorpay_order_id,
          razorpayAmount: razorpayAmount,
          razorpayKeyId: razorpayKeyId,
        });
      }
    } catch (sdkError) {
      console.error('❌ [RETRY] Error:', sdkError);
      setRetryLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'OrderFailedScreen',
              params: {
                orderId,
                orderNumber: displayOrderId,
                paymentMethod: paymentMethod || 'online',
                totalAmount: grandTotal,
                errorMessage:
                  sdkError?.description || 'Payment was cancelled or failed.',
              },
            },
          ],
        }),
      );
    }
  };

  const handleOrderRating = rating => {
    setPendingRating(rating);
    setRatingType('order');
    setIsRatingModalVisible(true);
  };

  const handleAgentRating = rating => {
    setPendingRating(rating);
    setRatingType('agent');
    setIsRatingModalVisible(true);
  };

  const onRatingSubmit = async review => {
    setIsRatingModalVisible(false);
    let response;
    if (ratingType === 'order') {
      response = await submitOrderRating(pendingRating, review);
      if (response && response.success) {
        setOrderRating(pendingRating);
      }
    } else {
      response = await submitDeliveryAgentRating(pendingRating, review);
      if (response && response.success) {
        setAgentRating(pendingRating);
      }
    }

    if (response && !response.success) {
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Rating Failed',
        message:
          response.message || 'Failed to submit rating. Please try again.',
      });
    }
  };

  useOrderTracking(
    orderId,
    statusUpdate => {
      console.log('🔄 [UI] Refreshing order details due to SignalR update');
      refreshOrder?.(true);
    },
    locationUpdate => {
      console.log('📍 [UI] Driver location updated:', locationUpdate);
    },
  );

  const billCalculations = React.useMemo(() => {
    if (!bill) return null;
    return {
      itemTotal: bill.subTotal || 0,
      savings: bill.discountTotal || 0,
      deliveryCharge: bill.deliveryCharge || 0,
      totalTax: bill.taxTotal || 0,
      couponDiscount: bill.couponDiscount || 0,
      giftCardAmount: bill.giftCardAmount || 0,
      bcoinsAppliedValue: bill.bCoinAppliedValue || 0,
      totalSavings:
        (bill.discountTotal || 0) +
        (bill.couponDiscount || 0) +
        (bill.bCoinAppliedValue || 0),
      toPay: bill.grandTotal || 0,
    };
  }, [bill]);

  const renderOrderItem = ({ item }) => (
    <OrderProductCard
      item={item}
      orderStatus={effectiveOrderStatus}
      onReturn={selectedItem => {
        setSelectedReturnItem(selectedItem || item);
        setShowReturnModal(true);
      }}
    />
  );

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return '#F2994A';
      case 'placed':
        return '#F2994A';
      case 'confirmed':
        return '#2D9CDB';
      case 'shipped':
        return '#9B51E0';
      case 'delivered':
        return '#27AE60';
      case 'cancelled':
        return '#EB5757';
      case 'returned':
        return '#6F727A';
      default:
        return '#000000';
    }
  };

  const getPaymentLabel = method => {
    if (!method) return 'Cash On Delivery';
    const m = method.toUpperCase();
    if (m === 'COD') return 'Cash On Delivery';
    if (m === 'ONLINE' || m === 'UPI') return 'Online Payment';
    return method;
  };

  const openSupportTicket = React.useCallback(() => {
    navigation.navigate('SupportTicketScreen', {
      orderId: orderId,
      orderNumber: displayOrderId,
    });
  }, [navigation, orderId, displayOrderId]);

  const BillRow = ({ label, value, isGreen }) => (
    <View style={styles.billBreakdownRow}>
      <Text style={styles.billBreakdownLabel}>{label}</Text>
      <Text
        style={[styles.billBreakdownValue, isGreen && { color: '#0CA201' }]}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.mainContainer, { paddingBottom: insets.bottom }]}
    >
      <CustomLoader
        visible={loading || retryLoading}
        text={retryLoading ? 'Verifying Payment...' : 'Updating Order...'}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <AntDesign name={'left'} size={wp('5%')} color={'#000000'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Tracking</Text>
        <View style={styles.headerInnerView}>
          <TouchableOpacity
            style={styles.helpContainer}
            onPress={openSupportTicket}
          >
            <Image
              style={styles.headPhoneImage}
              source={require('../assets/images/head_phone.png')}
            />
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
          {}
        </View>
      </View>
      <ScrollView ref={scrollViewRef}>
        <View
          style={{
            alignItems: 'center',
            paddingTop: hp('2%'),
          }}
        >
          {effectiveOrderStatus === 'pending' && (
            <OrderStatusBanner
              variant="pending"
              timestampLabel={
                formattedOrderDate ? `Placed on ${formattedOrderDate}` : null
              }
              amount={Number(grandTotal) || 0}
              canRetryPayment={canRetryPayment && !hasOnlinePaid}
              onHelpPress={openSupportTicket}
            />
          )}
          {effectiveOrderStatus === 'placed' && (
            <Image
              style={{
                width: wp('72%'),
                height: hp('3%'),
                resizeMode: 'contain',
              }}
              source={require('../assets/images/order_placed.png')}
            />
          )}
          {effectiveOrderStatus === 'accepted' && (
            <Image
              style={{
                width: wp('72%'),
                height: hp('3%'),
                resizeMode: 'contain',
              }}
              source={require('../assets/images/order_placed.png')}
            />
          )}
          {effectiveOrderStatus === 'packed' && (
            <Image
              style={{
                width: wp('72%'),
                height: hp('3%'),
                resizeMode: 'contain',
              }}
              source={require('../assets/images/order_packed.png')}
            />
          )}
          {effectiveOrderStatus === 'assigned' && (
            <Image
              style={{
                width: wp('72%'),
                height: hp('3%'),
                resizeMode: 'contain',
              }}
              source={require('../assets/images/assigned.png')}
            />
          )}
          {effectiveOrderStatus === 'dispatched' && (
            <Image
              style={{
                width: wp('72%'),
                height: hp('3%'),
                resizeMode: 'contain',
              }}
              source={require('../assets/images/dispatched.png')}
            />
          )}
          {effectiveOrderStatus === 'delivered' && (
            <OrderStatusBanner
              variant="delivered"
              timestampLabel={
                formattedDeliveredAt
                  ? `Delivered on ${formattedDeliveredAt}`
                  : formattedOrderDate
                  ? `Ordered on ${formattedOrderDate}`
                  : null
              }
              amount={Number(grandTotal) || 0}
              paymentLabel={getPaymentLabel(paymentMethod)}
              itemCount={itemCount}
              onHelpPress={openSupportTicket}
            />
          )}
          {effectiveOrderStatus === 'cancelled' && (
            <OrderStatusBanner
              variant="cancelled"
              timestampLabel={
                formattedCancelledAt
                  ? `Cancelled on ${formattedCancelledAt}`
                  : formattedOrderDate
                  ? `Ordered on ${formattedOrderDate}`
                  : null
              }
              reason={cancellationReason}
              amount={Number(grandTotal) || 0}
              isRefundApplicable={hasOnlinePaid}
              onHelpPress={openSupportTicket}
            />
          )}
          {}
          {effectiveOrderStatus !== 'cancelled' && (
            <View style={styles.statusContainer}>
              <View style={styles.statusView}>
                <View
                  style={
                    Platform.OS === 'android'
                      ? [
                          styles.statusNumberView,
                          effectiveOrderStatus !== 'pending' && {
                            backgroundColor: '#0CA201',
                          },
                          { bottom: hp('0.15%') },
                        ]
                      : [
                          styles.statusNumberView,
                          effectiveOrderStatus !== 'pending' && {
                            backgroundColor: '#0CA201',
                          },
                        ]
                  }
                >
                  <Text style={styles.statusNumberText}>1</Text>
                </View>
                <Text
                  style={[
                    styles.statusNameText,
                    effectiveOrderStatus !== 'pending' && { color: '#0CA201' },
                  ]}
                >
                  Order placed
                </Text>
              </View>
              <View style={[styles.statusView, { left: wp('-2%') }]}>
                <View
                  style={
                    Platform.OS === 'android'
                      ? [
                          styles.statusNumberView,
                          ['assigned', 'dispatched', 'delivered'].includes(
                            effectiveOrderStatus,
                          ) && { backgroundColor: '#0CA201' },
                          { bottom: hp('0.15%') },
                        ]
                      : [
                          styles.statusNumberView,
                          ['assigned', 'dispatched', 'delivered'].includes(
                            effectiveOrderStatus,
                          ) && { backgroundColor: '#0CA201' },
                        ]
                  }
                >
                  <Text style={styles.statusNumberText}>2</Text>
                </View>
                <Text
                  style={[
                    styles.statusNameText,
                    ['assigned', 'dispatched', 'delivered'].includes(
                      effectiveOrderStatus,
                    ) && { color: '#0CA201' },
                  ]}
                >
                  Out for delivery
                </Text>
              </View>
              <View style={styles.statusView}>
                <View
                  style={
                    Platform.OS === 'android'
                      ? [
                          styles.statusNumberView,
                          effectiveOrderStatus === 'delivered' && {
                            backgroundColor: '#0CA201',
                          },
                          { bottom: hp('0.15%') },
                        ]
                      : [
                          styles.statusNumberView,
                          effectiveOrderStatus === 'delivered' && {
                            backgroundColor: '#0CA201',
                          },
                        ]
                  }
                >
                  <Text style={styles.statusNumberText}>3</Text>
                </View>
                <Text
                  style={[
                    styles.statusNameText,
                    effectiveOrderStatus === 'delivered' && {
                      color: '#0CA201',
                    },
                  ]}
                >
                  Delivered
                </Text>
              </View>
            </View>
          )}
          {['placed', 'pending'].includes(effectiveOrderStatus) && (
            <ImageBackground
              style={styles.placedImageStyle}
              resizeMode="contain"
              source={require('../assets/images/tracking_image_placed.png')}
            >
              {effectiveOrderStatus !== 'pending' && (
                <View style={styles.wrapper}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0)', '#FFFFFF', '#FFFFFF']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}
                  >
                    <View style={styles.orderPlacedView}>
                      <View style={styles.statusView}>
                        <View
                          style={
                            Platform.OS === 'android'
                              ? [
                                  styles.statusNumberView,
                                  { backgroundColor: '#0CA201' },
                                  { bottom: hp('0.15%') },
                                ]
                              : [
                                  styles.statusNumberView,
                                  { backgroundColor: '#0CA201' },
                                ]
                          }
                        >
                          <Text style={styles.statusNumberText}>1</Text>
                        </View>
                        <Text
                          style={[
                            styles.statusNameText,
                            {
                              color: '#0CA201',
                            },
                          ]}
                        >
                          Order placed
                        </Text>
                      </View>
                      <Image
                        style={styles.dotsImage}
                        source={require('../assets/images/dots_two.png')}
                      />
                      <Text style={styles.placedDescription}>
                        Waiting for acceptance...
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </ImageBackground>
          )}
          {effectiveOrderStatus === 'accepted' && (
            <ImageBackground
              style={styles.placedImageStyle}
              resizeMode="contain"
              source={require('../assets/images/tracking_image_accepted.png')}
            >
              <View style={styles.wrapper}>
                <LinearGradient
                  colors={['rgba(255,255,255,0)', '#FFFFFF', '#FFFFFF']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradient}
                >
                  <View style={styles.orderPlacedView}>
                    <View style={styles.statusView}>
                      <View
                        style={
                          Platform.OS === 'android'
                            ? [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                                { bottom: hp('0.15%') },
                              ]
                            : [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                              ]
                        }
                      >
                        <Text style={styles.statusNumberText}>1</Text>
                      </View>
                      <Text
                        style={[
                          styles.statusNameText,
                          {
                            color: '#0CA201',
                          },
                        ]}
                      >
                        Order placed
                      </Text>
                    </View>
                    <Image
                      style={styles.dotsImage}
                      source={require('../assets/images/dots_two.png')}
                    />
                    <Text style={styles.placedDescription}>Accepted</Text>
                  </View>
                </LinearGradient>
              </View>
            </ImageBackground>
          )}
          {effectiveOrderStatus === 'packed' && (
            <ImageBackground
              style={styles.placedImageStyle}
              resizeMode="contain"
              source={require('../assets/images/tracking_image_packed.png')}
            >
              <View style={styles.wrapper}>
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0)',
                    '#FFFFFF',
                    '#FFFFFF',
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradient}
                >
                  <View style={styles.orderPlacedView}>
                    <View style={styles.statusView}>
                      <View
                        style={
                          Platform.OS === 'android'
                            ? [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                                { bottom: hp('0.15%') },
                              ]
                            : [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                              ]
                        }
                      >
                        <Text style={styles.statusNumberText}>1</Text>
                      </View>
                      <Text
                        style={[
                          styles.statusNameText,
                          {
                            color: '#0CA201',
                          },
                        ]}
                      >
                        Order placed
                      </Text>
                    </View>
                    <Image
                      style={styles.dotsImage}
                      source={require('../assets/images/dots_two.png')}
                    />
                    <Text style={styles.placedDescription}>Packed</Text>
                  </View>
                </LinearGradient>
              </View>
            </ImageBackground>
          )}
          {effectiveOrderStatus === 'assigned' && (
            <View style={styles.assignedContainer}>
              <Image
                style={styles.assignedImageStyle}
                source={require('../assets/images/tracking_image_assigned.png')}
              />
              <View style={styles.wrapper}>
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0)',
                    '#FFFFFF',
                    '#FFFFFF',
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradient}
                >
                  <View style={styles.orderPlacedView}>
                    <View style={styles.statusView}>
                      <View
                        style={
                          Platform.OS === 'android'
                            ? [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                                { bottom: hp('0.15%') },
                              ]
                            : [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                              ]
                        }
                      >
                        <Text style={styles.statusNumberText}>2</Text>
                      </View>
                      <Text
                        style={[
                          styles.statusNameText,
                          {
                            color: '#0CA201',
                          },
                        ]}
                      >
                        Out for delivery
                      </Text>
                    </View>
                    <Image
                      style={styles.dotsImage}
                      source={require('../assets/images/dots_two.png')}
                    />
                    <Text style={styles.placedDescription}>
                      Assigned delivery boy
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}
          {effectiveOrderStatus === 'dispatched' && (
            <View style={styles.assignedContainer}>
              <Image
                style={styles.assignedImageStyle}
                source={require('../assets/images/tracking_image_dispatched.png')}
              />
              <View style={styles.wrapper}>
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0)',
                    '#FFFFFF',
                    '#FFFFFF',
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradient}
                >
                  <View style={styles.orderPlacedView}>
                    <View style={styles.statusView}>
                      <View
                        style={
                          Platform.OS === 'android'
                            ? [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                                { bottom: hp('0.15%') },
                              ]
                            : [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                              ]
                        }
                      >
                        <Text style={styles.statusNumberText}>2</Text>
                      </View>
                      <Text
                        style={[
                          styles.statusNameText,
                          {
                            color: '#0CA201',
                          },
                        ]}
                      >
                        Out for delivery
                      </Text>
                    </View>
                    <Image
                      style={styles.dotsImage}
                      source={require('../assets/images/dots_two.png')}
                    />
                    <Text style={styles.placedDescription}>On the way</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}
          {effectiveOrderStatus === 'delivered' && (
            <View style={styles.assignedContainer}>
              <Image
                style={styles.assignedImageStyle}
                source={require('../assets/images/tracking_image_delivered.png')}
              />
              <View style={styles.wrapper}>
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0)',
                    '#FFFFFF',
                    '#FFFFFF',
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradient}
                >
                  <View style={styles.orderPlacedView}>
                    <View style={styles.statusView}>
                      <View
                        style={
                          Platform.OS === 'android'
                            ? [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                                { bottom: hp('0.15%') },
                              ]
                            : [
                                styles.statusNumberView,
                                { backgroundColor: '#0CA201' },
                              ]
                        }
                      ></View>
                      <Text
                        style={[
                          styles.statusNameText,
                          {
                            color: '#0CA201',
                          },
                        ]}
                      >
                        Delivered
                      </Text>
                    </View>
                    <Image
                      style={styles.dotsImage}
                      source={require('../assets/images/dots_two.png')}
                    />
                    <Text style={styles.placedDescription}>
                      Product has been delivered
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}
        </View>
        <View style={styles.containerTwo}>
          {canMarkOverallReview ? (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>How was your experience ?</Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleOrderRating(star)}
                  >
                    <Image
                      style={[
                        styles.ratingStarStyle,
                        {
                          tintColor:
                            star <= orderRating ? '#F2C94C' : '#DADADA',
                        },
                      ]}
                      source={require('../assets/images/star.png')}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            !canMarkDeliveryReview &&
            ![
              'pending',
              'placed',
              'accepted',
              'packed',
              'assigned',
              'dispatched',
            ].includes(effectiveOrderStatus) && (
              <View style={{ height: hp('1%') }} />
            )
          )}
          {!canMarkOverallReview &&
            effectiveOrderStatus !== 'delivered' &&
            canShowDeliveryAgent && (
              <View style={styles.deliveryAgentContainer}>
                <View>
                  <Text style={styles.deliveryAgentNameText}>
                    {['pending', 'placed', 'accepted', 'packed'].includes(
                      effectiveOrderStatus,
                    )
                      ? 'Not assigned'
                      : deliveryAgentName || 'Marvin Alex'}
                  </Text>
                  <Text style={styles.deliveryAgentTextTwo}>
                    Delivery Agent
                  </Text>
                </View>
                {['pending', 'placed', 'accepted', 'packed'].includes(
                  effectiveOrderStatus,
                ) ? (
                  <View style={styles.callContainer} />
                ) : (
                  <TouchableOpacity
                    style={styles.callContainer}
                    onPress={() => {
                      if (deliveryAgentPhone) {
                        Linking.openURL(`tel:${deliveryAgentPhone}`);
                      }
                    }}
                  >
                    <Image
                      style={styles.phoneIcon}
                      source={require('../assets/images/phone_green.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          <ImageBackground
            style={styles.addressBackgroundImageStyle}
            source={require('../assets/images/order_tracking_background.png')}
          >
            <View style={styles.addressContainer}>
              <View style={styles.addressInnerView}>
                <View style={styles.addressHeaderView}>
                  <Image
                    style={styles.addressIconStyle}
                    source={require('../assets/images/home_primary_two.png')}
                  />
                  <Text style={styles.addressHeaderText}>Store</Text>
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressLineText}
                >
                  {storeName}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressLineText}
                >
                  Main Branch
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressLineText}
                >
                  {shippingAddress?.country || 'India'}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.addressLineText, { marginTop: hp('1%') }]}
                >
                  7000000000
                </Text>
              </View>
              <Image
                style={styles.rightArrowIcon}
                source={require('../assets/images/right_arrow_two.png')}
              />
              <View
                style={[
                  styles.addressInnerView,
                  {
                    paddingLeft: 0,
                  },
                ]}
              >
                <View style={styles.addressHeaderView}>
                  <Image
                    style={styles.addressIconStyle}
                    source={require('../assets/images/home_primary_three.png')}
                  />
                  <Text style={styles.addressHeaderText}>Home</Text>
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressLineText}
                >
                  {fullAddress}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressLineText}
                >
                  {cityStateZip}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressLineText}
                >
                  India
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.addressLineText, { marginTop: hp('1%') }]}
                >
                  {shippingAddress?.mobileNo || shippingAddress?.phoneNo || ''}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <Text style={styles.paymentMethodText}>Payment method</Text>

          <View style={styles.deliveryAgentContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                marginRight: wp('2%'),
              }}
            >
              <Image
                style={styles.paymentImage}
                source={require('../assets/images/payment_image.png')}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.paymentText, { flex: 1 }]}
              >
                {getPaymentLabel(paymentMethod)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Text style={styles.paymnetPrice}>₹{grandTotal}</Text>
              {(effectiveOrderStatus === 'delivered' ||
                hasOnlinePaid ||
                (['online', 'prepaid', 'razorpay', 'upi'].includes(
                  paymentMethod?.toLowerCase(),
                ) &&
                  (paymentStatus?.toLowerCase() === 'pending' ||
                    (paymentStatus?.toLowerCase() === 'initiated' &&
                      rawOrderStatus?.toLowerCase() === 'pending')))) && (
                <View style={[styles.paidBadge, { marginTop: hp('0.5%') }]}>
                  <Ionicons
                    name="checkmark-circle"
                    size={wp('3%')}
                    color="#27AE60"
                  />
                  <Text style={styles.paidBadgeText}>
                    {paymentStatus?.toLowerCase() === 'initiated' &&
                    rawOrderStatus?.toLowerCase() === 'pending'
                      ? 'Payment Initiated'
                      : 'Paid successfully'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {}
          {}

          <View style={styles.productsMainContainer}>
            <View style={styles.productsHeaderView}>
              <Text style={styles.productsHeaderText}>Items in this order</Text>
              <Text style={styles.productsHeaderCount}>{itemCount} items</Text>
            </View>

            <View style={styles.productsContainer}>
              {orderItems.map((item, index) => (
                <OrderProductCard
                  key={index}
                  item={item}
                  orderStatus={effectiveOrderStatus}
                  onReturn={selectedItem => {
                    setSelectedReturnItem(selectedItem || item);
                    setShowReturnModal(true);
                  }}
                />
              ))}
            </View>

            <View style={styles.productTotalView}>
              <Text style={styles.totalText}>Total</Text>
              <TouchableOpacity
                style={styles.viewBillContainer}
                onPress={() => setShowBillBreakdown(!showBillBreakdown)}
              >
                <Text style={styles.viewBillText}>View Your Bill</Text>
                <Entypo
                  style={styles.viewBillIcon}
                  name={
                    showBillBreakdown ? 'chevron-thin-up' : 'chevron-thin-down'
                  }
                  size={wp('3%')}
                />
              </TouchableOpacity>
              <Text style={styles.totalPriceText}>₹{grandTotal}</Text>
            </View>

            {showBillBreakdown && billCalculations && (
              <BillSection billCalculations={billCalculations} />
            )}
          </View>
          {!!resolvedInvoiceUrl && (
            <TouchableOpacity
              style={styles.viewInvoiceContainer}
              onPress={handleViewInvoice}
            >
              <Image
                style={styles.downloadBillIcon}
                source={require('../assets/images/bill_icon_two.png')}
              />
              <Text style={styles.viewInvoiceText}>View Invoice</Text>
            </TouchableOpacity>
          )}
          {['packed', 'assigned', 'dispatched', 'delivered'].includes(
            effectiveOrderStatus,
          ) && (
            <TouchableOpacity
              style={styles.downloadBillContainer}
              onPress={async () => {
                if (invoiceUrl) {
                  const fullUrl = invoiceUrl.startsWith('http')
                    ? invoiceUrl
                    : `${CONFIG.image_base_url}${invoiceUrl}`;

                  const opened = await openExternalUrl(fullUrl);
                  if (!opened) {
                    Toast.show(
                      'Unable to download invoice at this time',
                      Toast.SHORT,
                    );
                  }
                } else {
                  Toast.show('Invoice not available yet', Toast.SHORT);
                }
              }}
            >
              <Image
                style={styles.downloadBillIcon}
                source={require('../assets/images/bill_icon_two.png')}
              />
              <Text style={styles.downloadBillText}>Download the bill</Text>
            </TouchableOpacity>
          )}
          <Text
            style={[
              styles.orderDetailsText,
              !showBillBreakdown && { marginTop: hp('2.5%') },
            ]}
          >
            Order Details
          </Text>
          <View style={styles.orderDetailsContainer}>
            <View>
              <Text style={styles.orderDetailsKeyText}>Order ID</Text>
              <Text style={styles.orderDetailsValueText}>{displayOrderId}</Text>
            </View>
            <View>
              <Text style={styles.orderDetailsKeyText}>Payment</Text>
              <Text style={styles.orderDetailsValueText}>
                {getPaymentLabel(paymentMethod)}
              </Text>
            </View>
            <View>
              <Text style={styles.orderDetailsKeyText}>Deliver to</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.orderDetailsValueText}
              >
                {fullAddress}
              </Text>
            </View>
            <View>
              <Text style={styles.orderDetailsKeyText}>Order placed</Text>
              <Text style={styles.orderDetailsValueText}>
                {formattedOrderDate || orderDate}
              </Text>
            </View>
          </View>
          {canMarkDeliveryReview && (
            <View style={styles.dliveryAgentRatingMainContainer}>
              <View style={styles.deliveryAgentInnerContainerOne}>
                <Image
                  style={styles.deliveryAgentIcon}
                  source={require('../assets/images/del_agent.png')}
                />
                <View style={styles.deliveryAgentContainerInnerView}>
                  <Text style={styles.deliveryAgentRatingText}>
                    Rate our delivery boy
                  </Text>
                  <View style={styles.starContainerTwo}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => handleAgentRating(star)}
                      >
                        <Image
                          style={[
                            styles.ratingStarStyleTwo,
                            {
                              tintColor:
                                star <= agentRating ? '#F2C94C' : '#DADADA',
                            },
                          ]}
                          source={require('../assets/images/star.png')}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.deliveryAgentInnerContainerTwo}>
                <Text style={styles.deliveryAgentRatingName}>
                  Delivery boy : {deliveryAgentName || 'Marvin Alex'}
                </Text>
              </View>
            </View>
          )}

          {canRetryPayment && !hasOnlinePaid && (
            <View
              onLayout={event => {
                const { y } = event.nativeEvent.layout;
                setRetryYOffset(y);
              }}
            >
              {}
              <TouchableOpacity onPress={handleRetryPayment}>
                {}
                <LinearGradient
                  colors={['#27AE60', '#58D68D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cancelButtonGradient}
                >
                  <Text style={styles.cancelButtonText}>Retry Payment</Text>
                </LinearGradient>
                {}
              </TouchableOpacity>
            </View>
          )}
          {['pending', 'placed', 'accepted', 'packed'].includes(
            effectiveOrderStatus,
          ) && (
            <TouchableOpacity onPress={() => setShowCancelModal(true)}>
              <LinearGradient
                colors={['#F25000', '#FF7B3A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cancelButtonGradient}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <RatingModal
        visible={isRatingModalVisible}
        onClose={() => setIsRatingModalVisible(false)}
        onSubmit={onRatingSubmit}
        rating={pendingRating}
        title={
          ratingType === 'order' ? 'Rate Your Order' : 'Rate Delivery Agent'
        }
        placeholder={
          ratingType === 'order'
            ? 'How was the quality of items and service?'
            : 'Comment on delivery speed and behavior...'
        }
      />

      <ConfirmationModal
        visible={showCancelModal}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
      />

      <ReturnItemModal
        visible={showReturnModal}
        item={selectedReturnItem}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedReturnItem(null);
        }}
        onSubmit={reason => {
          handleReturnItem(reason);
          refreshOrder?.(true);
        }}
      />

      <StatusModal
        visible={statusModal.visible}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, visible: false })}
      />
    </SafeAreaView>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SURFACE.base,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('4.65%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: INK.strong,
    flex: 1,
    marginLeft: wp('4%'),
    letterSpacing: -0.3,
  },
  headerInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingHorizontal: wp('3%'),
    height: hp('3.2%'),
    justifyContent: 'center',
  },
  headPhoneImage: {
    height: wp('2.6%'),
    width: wp('2.6%'),
    resizeMode: 'contain',
  },
  helpText: {
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
    fontSize: wp('2.79%'),
    marginLeft: wp('1.5%'),
  },
  homeIcon: {
    width: wp('7.9%'),
    height: wp('7.9%'),
    marginLeft: wp('3%'),
  },
  paidBadgeContainer: {
    paddingHorizontal: wp('4.65%'),
    marginTop: hp('0.5%'),
    marginBottom: hp('1.5%'),
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    alignSelf: 'flex-end',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: RADIUS.pill,
  },
  paidBadgeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3%'),
    color: ACCENT.successText,
    marginLeft: wp('1%'),
  },
  statusContainer: {
    flexDirection: 'row',
    width: wp('91%'),
    justifyContent: 'space-between',
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusNumberView: {
    backgroundColor: '#C2C6CE',
    width: wp('3.4%'),
    height: wp('3.4%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
  },
  statusNumberText: {
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    fontSize: wp('2.09%'),
  },
  statusNameText: {
    color: INK.muted,
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.79%'),
    marginLeft: wp('1.5%'),
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  gradient: {
    width: '100%',
    height: hp('8%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  placedImageStyle: {
    height: hp('29.2%'),
    width: '100%',
    marginTop: hp('2%'),
  },
  orderPlacedView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsImage: {
    width: wp('1.16%'),
    height: hp('1.07%'),
    resizeMode: 'contain',
    marginLeft: wp('1.5%'),
  },
  placedDescription: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.79%'),
    color: INK.muted,
    marginLeft: wp('1.5%'),
  },
  assignedContainer: {
    alignItems: 'center',
    marginTop: hp('3%'),
    height: hp('20%'),
  },
  assignedImageStyle: {
    width: wp('48.5%'),
    height: hp('15.93%'),
    resizeMode: 'contain',
  },
  containerTwo: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
    backgroundColor: SURFACE.base,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderTopWidth: 1,
    borderColor: HAIRLINE,
    marginTop: hp('2%'),
    flex: 1,
  },
  deliveryAgentContainer: {
    width: wp('90.7%'),
    paddingVertical: hp('1.5%'),
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    zIndex: 1,
  },
  deliveryAgentNameText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.95%'),
    color: INK.strong,
  },
  deliveryAgentTextTwo: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.79%'),
    color: INK.muted,
    marginTop: hp('0.3%'),
  },
  callContainer: {
    width: wp('11.63%'),
    height: wp('11.63%'),
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    width: wp('4.65%'),
    height: wp('4.65%'),
  },
  addressBackgroundImageStyle: {
    width: wp('99%'),
    minHeight: hp('14%'),
    justifyContent: 'center',
    marginTop: hp('1.5%'),
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressInnerView: {
    width: wp('41%'),
    paddingLeft: wp('8%'),
  },
  addressHeaderView: {
    flexDirection: 'row',
    marginBottom: hp('1%'),
  },
  addressIconStyle: {
    width: wp('3.95%'),
    height: hp('1.71%'),
    resizeMode: 'contain',
  },
  addressHeaderText: {
    fontSize: wp('2.79%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    marginLeft: wp('1.5%'),
  },
  addressLineText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.55%'),
    color: INK.muted,
    width: '85%',
  },
  rightArrowIcon: {
    width: wp('7%'),
    height: wp('7%'),
    resizeMode: 'contain',
  },
  paymentMethodText: {
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    fontSize: wp('3.72%'),
    alignSelf: 'flex-start',
    marginLeft: wp('6%'),
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    letterSpacing: -0.2,
  },
  paymentImage: {
    width: wp('9.3%'),
    height: wp('9.3%'),
    resizeMode: 'contain',
  },
  paymentText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.02%'),
    color: INK.base,
    flex: 1,
    marginLeft: wp('4%'),
  },
  paymnetPrice: {
    color: INK.strong,
    fontFamily: FONTS.inter.semiBold,
    fontSize: wp('4.65%'),
  },
  productsContainer: {
    width: wp('90.7%'),
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: HAIRLINE,
    alignSelf: 'center',
    paddingHorizontal: wp('3%'),
    paddingTop: hp('0.5%'),
    paddingBottom: hp('0.5%'),
    zIndex: 1,
  },
  productsContainerTwo: {
    width: wp('90.7%'),
    borderRadius: wp('4.65%'),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    alignSelf: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    zIndex: 1,
  },
  productsMainContainer: {
    marginTop: hp('2%'),
  },
  productsHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: wp('6%'),
    marginBottom: hp('1%'),
    paddingRight: wp('6%'),
  },
  productsHeaderText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.72%'),
    color: INK.strong,
    letterSpacing: -0.2,
  },
  productsHeaderCount: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
    color: INK.muted,
  },
  productView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  productViewTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productImage: {
    width: wp('8.6%'),
    height: wp('8.6%'),
  },
  productImageTwo: {
    width: wp('8.6%'),
    height: wp('8.6%'),
  },
  productName: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.02%'),
    color: '#000000',
  },
  productNameTwo: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.02%'),
    color: '#000000',
  },
  productQuantity: {
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('2.79%'),
    color: '#000000',
  },
  productQuantityTwo: {
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('2.79%'),
    color: '#000000',
  },
  productPrice: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.72%'),
    color: '#000000',
    alignSelf: 'flex-end',
  },
  productPriceTwo: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.72%'),
    color: '#000000',
    alignSelf: 'flex-end',
  },
  productTotalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: HAIRLINE,
    width: wp('90.7%'),
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('3%'),
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
  },
  totalText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: INK.base,
  },
  viewBillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.tint,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
  },
  viewBillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.9%'),
    color: ACCENT.primary,
  },
  viewBillIcon: {
    marginLeft: wp('1.5%'),
    color: ACCENT.primary,
  },
  totalPriceText: {
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    fontSize: wp('4.65%'),
  },
  viewInvoiceContainer: {
    flexDirection: 'row',
    width: wp('90.7%'),
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.4%'),
    marginTop: hp('1.5%'),
  },
  viewInvoiceText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.02%'),
    color: ACCENT.primary,
    marginLeft: wp('3%'),
  },
  downloadBillContainer: {
    flexDirection: 'row',
    width: wp('90.7%'),
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.4%'),
    marginTop: hp('1.5%'),
  },
  downloadBillIcon: {
    width: wp('3.72%'),
    height: hp('2.14%'),
    resizeMode: 'contain',
  },
  downloadBillText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.02%'),
    color: INK.base,
    marginLeft: wp('3%'),
  },
  orderDetailsText: {
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.72%'),
    alignSelf: 'flex-start',
    marginLeft: wp('6%'),
    marginTop: hp('0.5%'),
    marginBottom: hp('1%'),
    letterSpacing: -0.2,
  },
  orderDetailsContainer: {
    width: wp('90.7%'),
    height: hp('25.54%'),
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  orderDetailsKeyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.9%'),
    color: INK.muted,
    marginBottom: 2,
  },
  retryContainerWrapper: {
    width: wp('90.7%'),
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  orderDetailsValueText: {
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.25%'),
  },
  cancelButtonGradient: {
    width: wp('90.7%'),
    height: hp('5.86%'),
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  cancelButtonText: {
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    fontSize: wp('4.2%'),
    letterSpacing: 0.3,
  },
  retryHintText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('2%'),
  },
  ratingStarStyle: {
    width: wp('6.28%'),
    height: hp('2.79%'),
    resizeMode: 'contain',
  },
  ratingStarStyleTwo: {
    width: wp('4.88%'),
    height: hp('2.14%'),
    resizeMode: 'contain',
  },
  ratingContainer: {
    marginBottom: hp('0.5%'),
  },
  ratingText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.72%'),
    color: INK.strong,
  },
  starContainer: {
    flexDirection: 'row',
    width: wp('50.23%'),
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    paddingHorizontal: wp('0.5%'),
  },
  starContainerTwo: {
    flexDirection: 'row',
    width: wp('33.72%'),
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    paddingHorizontal: wp('0.5%'),
  },
  paidSuccessfullyContainer: {
    backgroundColor: '#E6FAF0',
    borderRadius: wp('50%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    alignSelf: 'flex-start',
    marginLeft: wp('6%'),
    marginTop: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidSuccessfullyInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidSuccessfullyIcon: {
    width: wp('2.8%'),
    height: wp('2.8%'),
  },
  paidSuccessfullyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#0CA201',
    marginLeft: wp('1.5%'),
  },
  productContainerThirdView: {
    alignItems: 'flex-end',
    paddingTop: hp('2%'),
  },
  returnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.4%'),
  },
  returnIcon: {
    width: wp('2.55%'),
    height: hp('1.07%'),
    resizeMode: 'contain',
  },
  returnText: {
    color: '#F25000',
    fontSize: wp('3.72%'),
    fontFamily: FONTS.gilroy.medium,
    marginLeft: wp('1%'),
  },
  dliveryAgentRatingMainContainer: {
    marginTop: hp('1.5%'),
  },
  deliveryAgentInnerContainerOne: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90.7%'),
    backgroundColor: SURFACE.base,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: HAIRLINE,
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
    paddingHorizontal: wp('16%'),
  },
  deliveryAgentIcon: {
    width: wp('11.6%'),
    height: hp('4.92%'),
    resizeMode: 'contain',
  },
  deliveryAgentContainerInnerView: {
    alignItems: 'center',
  },
  deliveryAgentRatingText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.72%'),
    color: INK.strong,
  },
  deliveryAgentInnerContainerTwo: {
    width: wp('90.7%'),
    backgroundColor: SURFACE.sunken,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingVertical: hp('0.9%'),
    paddingHorizontal: wp('5%'),
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
  },
  deliveryAgentRatingName: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.79%'),
    color: INK.muted,
  },
  billBreakdownContainer: {
    paddingHorizontal: wp('8.5%'),
    marginTop: hp('0.5%'),
    paddingBottom: hp('2%'),
    backgroundColor: '#FFFFFF',
    width: wp('90.7%'),
    alignSelf: 'center',
  },
  billBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.8%'),
  },
  billBreakdownLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.25%'),
    color: INK.muted,
  },
  billBreakdownValue: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.25%'),
    color: INK.strong,
  },
  billRowDivider: {
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#E8E8E8',
    marginVertical: hp('1.5%'),
    borderRadius: 1,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalTotalLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: INK.strong,
  },
  finalTotalValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.5%'),
    color: ACCENT.successText,
  },
});
