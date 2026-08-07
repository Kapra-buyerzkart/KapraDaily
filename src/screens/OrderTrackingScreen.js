import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
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
  MAX_FONT_SCALE,
  hitSlopTo,
} from '../styles/homeTheme';
import OrderProductCard from '../components/OrderProductCard';
import OrderStatusBanner from '../components/OrderStatusBanner';
import ConfirmationModal from '../components/ConfirmationModal';
import ReturnItemModal from '../components/ReturnItemModal';
import { useOrderDetails } from '../hooks/useOrderDetails';
import { useOrderTracking } from '../hooks/useOrderTracking';
import CustomLoader from '../components/CustomLoader';
import { openExternalUrl } from '../utils/safeUrl';
import {
  INVOICE_NOT_GENERATED_MESSAGE,
  isInvoiceGenerated,
  resolveInvoiceUrl,
} from '../utils/invoiceUrl';
import RatingModal from '../components/RatingModal';
import StatusModal from '../components/StatusModal';
import BillSection from '../components/BillSection';
import RazorpayCheckout from 'react-native-razorpay';
import { verifyRazorpayPaymentApi } from '../api/paymentService';
import Toast from 'react-native-simple-toast';

const STEP_LABELS = ['Order placed', 'Out for delivery', 'Delivered'];

const ICON = {
  xs: wp('3.2%'),
  sm: wp('3.8%'),
  md: wp('4.4%'),
  lg: wp('5.2%'),
  xl: wp('7%'),
};

const STAR = {
  on: '#F2C94C',
  off: '#DDE1E7',
};

const WELL_TINT = {
  brand: { bg: SURFACE.tint, fg: ACCENT.primary },
  success: { bg: ACCENT.successSoft, fg: ACCENT.successText },
  neutral: { bg: SURFACE.sunken, fg: INK.muted },
};

const IconWell = ({ name, tone = 'brand', style }) => {
  const { bg, fg } = WELL_TINT[tone] || WELL_TINT.brand;
  return (
    <View style={[styles.iconWell, { backgroundColor: bg }, style]}>
      <Ionicons name={name} size={ICON.md} color={fg} />
    </View>
  );
};

const LIVE_STATUSES = [
  'pending',
  'placed',
  'accepted',
  'packed',
  'assigned',
  'dispatched',
];

const isStepDone = (index, status) => {
  if (index === 0) return status !== 'pending';
  if (index === 1)
    return ['assigned', 'dispatched', 'delivered'].includes(status);
  return status === 'delivered';
};

const HERO_CONTENT = {
  pending: {
    title: 'Order placed',
    caption: null,
  },
  placed: {
    title: 'Order placed',
    caption: 'Waiting for acceptance...',
  },
  accepted: {
    title: 'Order accepted',
    caption: 'Accepted — the store is preparing your order',
  },
  packed: {
    title: 'Order packed',
    caption: 'Packed and ready to leave the store',
  },
  assigned: {
    title: 'Out for delivery',
    caption: 'Assigned delivery boy',
  },
  dispatched: {
    title: 'On the way',
    caption: 'Your order is out for delivery',
  },
  delivered: {
    title: 'Delivered',
    caption: 'Product has been delivered',
  },
};

const SectionLabel = ({ children, right }) => (
  <View style={styles.sectionLabelRow}>
    <Text
      style={styles.sectionLabelText}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {children}
    </Text>
    {right || null}
  </View>
);

const DetailRow = ({ label, value, divided }) => (
  <View style={[styles.detailRow, divided && styles.detailRowDivided]}>
    <Text
      style={styles.orderDetailsKeyText}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {label}
    </Text>
    <Text
      style={styles.orderDetailsValueText}
      numberOfLines={1}
      ellipsizeMode="tail"
      maxFontSizeMultiplier={MAX_FONT_SCALE}
    >
      {value}
    </Text>
  </View>
);

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

  const resolvedInvoiceUrl = React.useMemo(
    () => resolveInvoiceUrl(invoiceFileUrl),
    [invoiceFileUrl],
  );

  const invoiceGenerated = isInvoiceGenerated(resolvedInvoiceUrl);

  const handleViewInvoice = useCallback(() => {
    if (!resolvedInvoiceUrl || !invoiceGenerated) {
      Toast.show(INVOICE_NOT_GENERATED_MESSAGE, Toast.LONG);
      return;
    }
    navigation.navigate('InvoiceViewerScreen', {
      invoiceUrl: resolvedInvoiceUrl,
      invoiceNumber,
      title: 'Invoice',
      orderId,
      orderNumber: displayOrderId,
    });
  }, [
    resolvedInvoiceUrl,
    invoiceGenerated,
    invoiceNumber,
    navigation,
    orderId,
    displayOrderId,
  ]);

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
    }, [autoScrollToRetry, retryYOffset, retryPulseAnim]),
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

  const activeStepIndex = React.useMemo(
    () => STEP_LABELS.findIndex((_, i) => !isStepDone(i, effectiveOrderStatus)),
    [effectiveOrderStatus],
  );

  const hero = HERO_CONTENT[effectiveOrderStatus];
  const isLiveOrder = LIVE_STATUSES.includes(effectiveOrderStatus);

  const stepPulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isLiveOrder) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(stepPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(stepPulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isLiveOrder, stepPulse]);

  const renderStepRail = ({ bare = false } = {}) => (
    <View style={[styles.railCard, bare && styles.railCardBare]}>
      <View style={styles.railRow}>
        {STEP_LABELS.map((label, index) => {
          const done = isStepDone(index, effectiveOrderStatus);
          const isActive = index === activeStepIndex;
          return (
            <React.Fragment key={label}>
              {index > 0 && (
                <View
                  style={[styles.railLine, done && styles.railLineFilled]}
                />
              )}
              <View
                style={[
                  styles.railNode,
                  done && styles.railNodeDone,
                  isActive && styles.railNodeActive,
                ]}
              >
                {done ? (
                  <Ionicons
                    name="checkmark"
                    size={ICON.xs}
                    color={INK.onDark}
                  />
                ) : isActive ? (
                  <Animated.View
                    style={[
                      styles.railNodeCore,
                      {
                        opacity: stepPulse.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.35],
                        }),
                        transform: [
                          {
                            scale: stepPulse.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.45],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                ) : null}
              </View>
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.railLabelRow}>
        {STEP_LABELS.map((label, index) => {
          const done = isStepDone(index, effectiveOrderStatus);
          const isActive = index === activeStepIndex;
          return (
            <Text
              key={label}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={[
                styles.railLabel,
                index === 0 && styles.railLabelStart,
                index === STEP_LABELS.length - 1 && styles.railLabelEnd,
                (done || isActive) && styles.railLabelOn,
              ]}
            >
              {label}
            </Text>
          );
        })}
      </View>
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
          hitSlop={hitSlopTo(wp('9%'))}
          accessibilityRole="button"
          accessibilityLabel="Go back to my orders"
        >
          <Ionicons name="chevron-back" size={ICON.lg} color={INK.strong} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text
            style={styles.headerText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            Order Tracking
          </Text>
          {!!displayOrderId && (
            <Text
              style={styles.headerSubText}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              #{displayOrderId}
            </Text>
          )}
        </View>
        <View style={styles.headerInnerView}>
          <TouchableOpacity
            style={styles.helpContainer}
            onPress={openSupportTicket}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Get help with this order"
          >
            <Text
              style={styles.helpText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Help
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topSection}>
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

          {effectiveOrderStatus !== 'cancelled' && !hero && (
            <View style={[styles.card, styles.railOnlyCard]}>
              {renderStepRail({ bare: true })}
            </View>
          )}

          {effectiveOrderStatus !== 'cancelled' && !!hero && (
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View style={styles.heroCopy}>
                  <View
                    style={[
                      styles.heroPill,
                      !isLiveOrder && styles.heroPillDone,
                    ]}
                  >
                    {isLiveOrder && (
                      <Animated.View
                        style={[
                          styles.heroPillDot,
                          {
                            opacity: stepPulse.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 0.3],
                            }),
                          },
                        ]}
                      />
                    )}
                    <Text
                      style={styles.heroPillText}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {isLiveOrder ? 'Live' : 'Completed'}
                    </Text>
                  </View>
                  <Text
                    style={styles.heroTitle}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {hero.title}
                  </Text>
                  {!!hero.caption && (
                    <Text
                      style={styles.heroCaption}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {hero.caption}
                    </Text>
                  )}
                  {!!formattedOrderDate && (
                    <Text
                      style={styles.heroMeta}
                      numberOfLines={1}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      Placed on {formattedOrderDate}
                    </Text>
                  )}
                </View>
              </View>
              {renderStepRail()}
            </View>
          )}
        </View>

        <View style={styles.body}>
          {canMarkOverallReview && (
            <View style={[styles.card, styles.ratingCard]}>
              <Text
                style={styles.ratingText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                How was your experience ?
              </Text>
              <Text
                style={styles.ratingHint}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Tap a star to rate this order
              </Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleOrderRating(star)}
                    activeOpacity={0.7}
                    hitSlop={hitSlopTo(wp('6.5%'))}
                    accessibilityRole="button"
                    accessibilityLabel={`Rate ${star} out of 5`}
                  >
                    <Ionicons
                      name={star <= orderRating ? 'star' : 'star-outline'}
                      size={ICON.xl}
                      color={star <= orderRating ? STAR.on : STAR.off}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {!canMarkOverallReview &&
            effectiveOrderStatus !== 'delivered' &&
            canShowDeliveryAgent &&
            (() => {
              const awaitingAgent = [
                'pending',
                'placed',
                'accepted',
                'packed',
              ].includes(effectiveOrderStatus);
              const agentName = awaitingAgent
                ? 'Not assigned'
                : deliveryAgentName || 'Marvin Alex';
              return (
                <View style={[styles.card, styles.agentCard]}>
                  <View
                    style={[
                      styles.agentAvatar,
                      awaitingAgent && styles.agentAvatarIdle,
                    ]}
                  >
                    <Ionicons
                      name={awaitingAgent ? 'time-outline' : 'bicycle'}
                      size={ICON.lg}
                      color={awaitingAgent ? INK.muted : ACCENT.success}
                    />
                  </View>
                  <View style={styles.agentCopy}>
                    <Text
                      style={styles.deliveryAgentNameText}
                      numberOfLines={1}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {agentName}
                    </Text>
                    <Text
                      style={styles.deliveryAgentTextTwo}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      Delivery Agent
                    </Text>
                  </View>
                  {awaitingAgent ? (
                    <View style={styles.agentWaitPill}>
                      <Text
                        style={styles.agentWaitText}
                        maxFontSizeMultiplier={MAX_FONT_SCALE}
                      >
                        Awaiting
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.callContainer}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`Call ${agentName}`}
                      onPress={() => {
                        if (deliveryAgentPhone) {
                          Linking.openURL(`tel:${deliveryAgentPhone}`);
                        }
                      }}
                    >
                      <Ionicons
                        name="call"
                        size={ICON.sm}
                        color={ACCENT.successText}
                      />
                      <Text
                        style={styles.callText}
                        maxFontSizeMultiplier={MAX_FONT_SCALE}
                      >
                        Call
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })()}

          <SectionLabel>Delivery route</SectionLabel>
          <View style={[styles.card, styles.routeCard]}>
            <View style={styles.routeRow}>
              <View style={styles.routeRail}>
                <IconWell name="storefront-outline" tone="brand" />
                <View style={styles.routeConnector} />
              </View>
              <View style={styles.routeCopy}>
                <Text
                  style={styles.addressHeaderText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Store
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.addressLineText, styles.addressLineStrong]}
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
                {/* <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.addressLineText, styles.addressPhoneText]}
                >
                  7000000000
                </Text> */}
              </View>
            </View>

            <View style={[styles.routeRow, styles.routeRowLast]}>
              <View style={styles.routeRail}>
                <IconWell name="home" tone="success" />
              </View>
              <View style={styles.routeCopy}>
                <Text
                  style={styles.addressHeaderText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Home
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={[styles.addressLineText, styles.addressLineStrong]}
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
                  style={[styles.addressLineText, styles.addressPhoneText]}
                >
                  {shippingAddress?.mobileNo || shippingAddress?.phoneNo || ''}
                </Text>
              </View>
            </View>
          </View>

          <SectionLabel>Payment method</SectionLabel>
          <View style={[styles.card, styles.paymentCard]}>
            <View style={styles.paymentCopy}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.paymentText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {getPaymentLabel(paymentMethod)}
              </Text>
              <Text
                style={styles.paymentSubText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Order total
              </Text>
            </View>
            <View style={styles.paymentAmountWrap}>
              <Text
                style={styles.paymnetPrice}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                ₹{grandTotal}
              </Text>
              {(effectiveOrderStatus === 'delivered' ||
                hasOnlinePaid ||
                (['online', 'prepaid', 'razorpay', 'upi'].includes(
                  paymentMethod?.toLowerCase(),
                ) &&
                  (paymentStatus?.toLowerCase() === 'pending' ||
                    (paymentStatus?.toLowerCase() === 'initiated' &&
                      rawOrderStatus?.toLowerCase() === 'pending')))) && (
                <View style={styles.paidBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={ICON.xs}
                    color={ACCENT.successText}
                  />
                  <Text
                    style={styles.paidBadgeText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {paymentStatus?.toLowerCase() === 'initiated' &&
                    rawOrderStatus?.toLowerCase() === 'pending'
                      ? 'Payment Initiated'
                      : 'Paid successfully'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <SectionLabel
            right={
              <View style={styles.countPill}>
                <Text
                  style={styles.countPillText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {itemCount} items
                </Text>
              </View>
            }
          >
            Items in this order
          </SectionLabel>

          <View style={[styles.card, styles.itemsCard]}>
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
              <View style={styles.totalCopy}>
                <Text
                  style={styles.totalText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Total
                </Text>
                <TouchableOpacity
                  style={styles.viewBillContainer}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showBillBreakdown ? 'Hide bill details' : 'View your bill'
                  }
                  onPress={() => setShowBillBreakdown(!showBillBreakdown)}
                >
                  <Text
                    style={styles.viewBillText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    View Your Bill
                  </Text>
                  <Ionicons
                    style={styles.viewBillIcon}
                    name={showBillBreakdown ? 'chevron-up' : 'chevron-down'}
                    size={ICON.xs}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={styles.totalPriceText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                ₹{grandTotal}
              </Text>
            </View>
          </View>

          {showBillBreakdown && billCalculations && (
            <BillSection billCalculations={billCalculations} />
          )}

          {(!!resolvedInvoiceUrl ||
            ['packed', 'assigned', 'dispatched', 'delivered'].includes(
              effectiveOrderStatus,
            )) && (
            <View style={[styles.card, styles.docsCard]}>
              {!!resolvedInvoiceUrl && (
                <TouchableOpacity
                  style={styles.docRow}
                  activeOpacity={0.7}
                  onPress={handleViewInvoice}
                  accessibilityRole="button"
                  accessibilityLabel="View invoice"
                >
                  <IconWell
                    name="receipt-outline"
                    tone="brand"
                    style={styles.docIconWell}
                  />
                  <Text
                    style={styles.viewInvoiceText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    View Invoice
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={ICON.md}
                    color={INK.muted}
                  />
                </TouchableOpacity>
              )}
              {['packed', 'assigned', 'dispatched', 'delivered'].includes(
                effectiveOrderStatus,
              ) && (
                <TouchableOpacity
                  style={[
                    styles.docRow,
                    !!resolvedInvoiceUrl && styles.docRowDivided,
                  ]}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Download the bill"
                  onPress={async () => {
                    const fullUrl = resolveInvoiceUrl(invoiceUrl);
                    if (!fullUrl || !isInvoiceGenerated(fullUrl)) {
                      Toast.show(INVOICE_NOT_GENERATED_MESSAGE, Toast.LONG);
                      return;
                    }
                    const opened = await openExternalUrl(fullUrl);
                    if (!opened) {
                      Toast.show(
                        'Unable to download invoice at this time',
                        Toast.SHORT,
                      );
                    }
                  }}
                >
                  <IconWell
                    name="document-text-outline"
                    tone="neutral"
                    style={styles.docIconWell}
                  />
                  <Text
                    style={styles.downloadBillText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Download the bill
                  </Text>
                  <Ionicons
                    name="download-outline"
                    size={ICON.md}
                    color={INK.muted}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          <SectionLabel>Order Details</SectionLabel>
          <View style={[styles.card, styles.orderDetailsContainer]}>
            <DetailRow label="Order ID" value={displayOrderId} />
            <DetailRow
              label="Payment"
              value={getPaymentLabel(paymentMethod)}
              divided
            />
            <DetailRow label="Deliver to" value={fullAddress} divided />
            <DetailRow
              label="Order placed"
              value={formattedOrderDate || orderDate}
              divided
            />
          </View>

          {canMarkDeliveryReview && (
            <View style={[styles.card, styles.agentRatingCard]}>
              <View style={styles.deliveryAgentInnerContainerOne}>
                <View style={styles.deliveryAgentContainerInnerView}>
                  <Text
                    style={styles.deliveryAgentRatingText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Rate our delivery boy
                  </Text>
                  <View style={styles.starContainerTwo}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => handleAgentRating(star)}
                        activeOpacity={0.7}
                        hitSlop={hitSlopTo(wp('5%'))}
                        accessibilityRole="button"
                        accessibilityLabel={`Rate delivery agent ${star} out of 5`}
                      >
                        <Ionicons
                          name={star <= agentRating ? 'star' : 'star-outline'}
                          size={ICON.lg}
                          color={star <= agentRating ? STAR.on : STAR.off}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.deliveryAgentInnerContainerTwo}>
                <Text
                  style={styles.deliveryAgentRatingName}
                  numberOfLines={1}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Delivery boy : {deliveryAgentName || 'Marvin Alex'}
                </Text>
              </View>
            </View>
          )}

          {canRetryPayment && !hasOnlinePaid && (
            <View
              style={styles.retryContainerWrapper}
              onLayout={event => {
                const { y } = event.nativeEvent.layout;
                setRetryYOffset(y);
              }}
            >
              {showRetryHint && (
                <Text
                  style={styles.retryHintText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Complete your payment to confirm this order
                </Text>
              )}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.retryHalo,
                  {
                    opacity: showRetryHint
                      ? retryPulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0.35],
                        })
                      : 0,
                  },
                ]}
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleRetryPayment}
                accessibilityRole="button"
                accessibilityLabel="Retry payment"
              >
                <LinearGradient
                  colors={['#0E9F4F', '#3FC57A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButton}
                >
                  <Ionicons name="refresh" size={ICON.md} color={INK.onDark} />
                  <Text
                    style={styles.primaryButtonText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Retry Payment
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {['pending', 'placed', 'accepted', 'packed'].includes(
            effectiveOrderStatus,
          ) && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowCancelModal(true)}
              style={styles.cancelButton}
              accessibilityRole="button"
              accessibilityLabel="Cancel this order"
            >
              <Text
                style={styles.cancelButtonText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Cancel Order
              </Text>
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

const CARD_WIDTH = wp('91%');
const CARD_EDGE = 'rgba(17,19,26,0.07)';

const SOFT_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SURFACE.base,
  },

  iconWell: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('4.65%'),
    alignItems: 'center',
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    backgroundColor: SURFACE.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.4%'),
    color: INK.strong,
    letterSpacing: -0.3,
  },
  headerSubText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: INK.muted,
    marginTop: hp('0.15%'),
  },
  headerInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.tint,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(242,80,0,0.18)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: wp('3.2%'),
    height: hp('3.6%'),
    justifyContent: 'center',
  },
  helpText: {
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
    fontSize: wp('2.9%'),
    letterSpacing: 0.2,
  },

  scrollContent: {
    paddingBottom: hp('3%'),
  },
  topSection: {
    alignItems: 'center',
    paddingTop: hp('2%'),
  },
  body: {
    alignItems: 'center',
    paddingTop: hp('0.5%'),
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    ...SOFT_SHADOW,
  },

  sectionLabelRow: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2.2%'),
    marginBottom: hp('1%'),
  },
  sectionLabelText: {
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    fontSize: wp('3.85%'),
    letterSpacing: -0.2,
  },
  countPill: {
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingHorizontal: wp('2.6%'),
    paddingVertical: hp('0.35%'),
  },
  countPillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.9%'),
    color: INK.muted,
  },

  heroCard: {
    width: CARD_WIDTH,
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_EDGE,
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1.8%'),
    ...SOFT_SHADOW,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCopy: {
    flex: 1,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: wp('2.4%'),
    paddingVertical: hp('0.35%'),
    marginBottom: hp('0.9%'),
  },
  heroPillDone: {
    backgroundColor: SURFACE.sunken,
  },
  heroPillDot: {
    width: wp('1.6%'),
    height: wp('1.6%'),
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.success,
    marginRight: wp('1.4%'),
  },
  heroPillText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.6%'),
    color: ACCENT.successText,
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5%'),
    color: INK.strong,
    letterSpacing: -0.4,
  },
  heroCaption: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: INK.muted,
    marginTop: hp('0.4%'),
    lineHeight: wp('4.4%'),
  },
  heroMeta: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: INK.faint,
    marginTop: hp('0.6%'),
  },
  railCard: {
    marginTop: hp('1.6%'),
    paddingTop: hp('1.6%'),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  railCardBare: {
    marginTop: 0,
    paddingTop: 0,
    borderTopWidth: 0,
  },
  railOnlyCard: {
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.8%'),
  },
  railRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  railNode: {
    width: wp('5.2%'),
    height: wp('5.2%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    borderWidth: 1.5,
    borderColor: '#DDE1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  railNodeDone: {
    backgroundColor: ACCENT.success,
    borderColor: ACCENT.success,
  },
  railNodeActive: {
    backgroundColor: SURFACE.base,
    borderColor: ACCENT.success,
  },
  railNodeCore: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.success,
  },
  railLine: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#E4E7EC',
    marginHorizontal: wp('1%'),
  },
  railLineFilled: {
    backgroundColor: ACCENT.success,
  },
  railLabelRow: {
    flexDirection: 'row',
    marginTop: hp('0.8%'),
  },
  railLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.7%'),
    color: INK.muted,
  },
  railLabelStart: {
    textAlign: 'left',
  },
  railLabelEnd: {
    textAlign: 'right',
  },
  railLabelOn: {
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.successText,
  },

  ratingCard: {
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('2%'),
    marginTop: hp('1.6%'),
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.95%'),
    color: INK.strong,
  },
  ratingHint: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.9%'),
    color: INK.muted,
    marginTop: hp('0.3%'),
  },
  starContainer: {
    flexDirection: 'row',
    width: wp('52%'),
    justifyContent: 'space-between',
    marginTop: hp('1.4%'),
  },

  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.6%'),
    marginTop: hp('1.6%'),
  },
  agentAvatar: {
    width: wp('11.5%'),
    height: wp('11.5%'),
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentAvatarIdle: {
    backgroundColor: SURFACE.sunken,
  },
  agentCopy: {
    flex: 1,
    marginLeft: wp('3%'),
    marginRight: wp('2%'),
  },
  deliveryAgentNameText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.85%'),
    color: INK.strong,
  },
  deliveryAgentTextTwo: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: INK.muted,
    marginTop: hp('0.25%'),
  },
  agentWaitPill: {
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
  },
  agentWaitText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.9%'),
    color: INK.muted,
  },
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: wp('3.4%'),
    height: hp('4.4%'),
  },
  callText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.1%'),
    color: ACCENT.successText,
    marginLeft: wp('1.6%'),
  },

  routeCard: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
  },
  routeRow: {
    flexDirection: 'row',
  },
  routeRowLast: {
    marginTop: hp('0.6%'),
  },
  routeRail: {
    alignItems: 'center',
    width: wp('9%'),
  },
  routeConnector: {
    flex: 1,
    width: 2,
    minHeight: hp('2%'),
    borderRadius: 2,
    backgroundColor: '#E4E7EC',
    marginVertical: hp('0.5%'),
  },
  routeCopy: {
    flex: 1,
    marginLeft: wp('3%'),
    paddingBottom: hp('0.6%'),
  },
  addressHeaderText: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    marginBottom: hp('0.4%'),
  },
  addressLineText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: INK.muted,
    lineHeight: wp('4.4%'),
  },
  addressLineStrong: {
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },
  addressPhoneText: {
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
    marginTop: hp('0.5%'),
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.6%'),
  },
  paymentCopy: {
    flex: 1,
    marginRight: wp('2%'),
  },
  paymentText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
    color: INK.strong,
  },
  paymentSubText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: INK.muted,
    marginTop: hp('0.2%'),
  },
  paymentAmountWrap: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  paymnetPrice: {
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.4%'),
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    alignSelf: 'flex-end',
    paddingHorizontal: wp('2.2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: RADIUS.pill,
    marginTop: hp('0.5%'),
  },
  paidBadgeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.7%'),
    color: ACCENT.successText,
    marginLeft: wp('1%'),
  },

  itemsCard: {
    overflow: 'hidden',
    paddingTop: hp('0.4%'),
  },
  productsContainer: {
    paddingHorizontal: wp('3.5%'),
  },
  productTotalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('0.4%'),
  },
  totalCopy: {
    flex: 1,
  },
  totalText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: INK.strong,
  },
  viewBillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: hp('0.4%'),
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

  docsCard: {
    marginTop: hp('1.6%'),
    paddingHorizontal: wp('4%'),
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
  },
  docRowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  docIconWell: {
    marginRight: wp('3%'),
  },
  viewInvoiceText: {
    flex: 1,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.3%'),
    color: INK.strong,
  },
  downloadBillText: {
    flex: 1,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.3%'),
    color: INK.strong,
  },

  orderDetailsContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.4%'),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.4%'),
  },
  detailRowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  orderDetailsKeyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: INK.muted,
    marginRight: wp('4%'),
  },
  orderDetailsValueText: {
    flex: 1,
    textAlign: 'right',
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.25%'),
  },

  agentRatingCard: {
    marginTop: hp('1.6%'),
    overflow: 'hidden',
  },
  deliveryAgentInnerContainerOne: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
  },
  deliveryAgentContainerInnerView: {
    flex: 1,
    alignItems: 'center',
  },
  deliveryAgentRatingText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.72%'),
    color: INK.strong,
  },
  starContainerTwo: {
    flexDirection: 'row',
    width: wp('36%'),
    justifyContent: 'space-between',
    marginTop: hp('1%'),
  },
  deliveryAgentInnerContainerTwo: {
    backgroundColor: SURFACE.sunken,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
  },
  deliveryAgentRatingName: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.9%'),
    color: INK.muted,
  },

  retryContainerWrapper: {
    width: CARD_WIDTH,
    marginTop: hp('2%'),
  },
  retryHintText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: ACCENT.successText,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  retryHalo: {
    position: 'absolute',
    left: -wp('1.5%'),
    right: -wp('1.5%'),
    bottom: -hp('0.8%'),
    height: hp('7.4%'),
    borderRadius: RADIUS.lg,
    backgroundColor: ACCENT.success,
  },
  primaryButton: {
    flexDirection: 'row',
    width: '100%',
    height: hp('6.2%'),
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    fontSize: wp('4%'),
    letterSpacing: 0.2,
    marginLeft: wp('2%'),
  },
  cancelButton: {
    width: CARD_WIDTH,
    height: hp('6.2%'),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(242,80,0,0.35)',
    backgroundColor: SURFACE.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  cancelButtonText: {
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT.primary,
    fontSize: wp('3.9%'),
    letterSpacing: 0.2,
  },
});
