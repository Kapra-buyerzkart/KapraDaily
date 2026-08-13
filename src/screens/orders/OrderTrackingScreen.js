import React, { useCallback, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import logger from '@/utils/logger';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { verifyRazorpayPaymentApi } from '@/api/paymentService';
import { openExternalUrl } from '@/utils/safeUrl';
import {
  INVOICE_NOT_GENERATED_MESSAGE,
  isInvoiceGenerated,
  resolveInvoiceUrl,
} from '@/utils/invoiceUrl';
import CustomLoader from '@/components/CustomLoader';
import ConfirmationModal from '@/components/ConfirmationModal';
import ReturnItemModal from '@/components/ReturnItemModal';
import RatingModal from '@/components/RatingModal';
import StatusModal from '@/components/StatusModal';
import SectionHeading from './atoms/SectionHeading';
import CountPill from './atoms/CountPill';
import Surface from './atoms/Surface';
import RouteTimeline from './molecules/RouteTimeline';
import DetailList from './molecules/DetailList';
import TrackingSkeleton from './molecules/TrackingSkeleton';
import TrackingHeader from './organisms/TrackingHeader';
import TrackingHero from './organisms/TrackingHero';
import DeliveryPartnerCard from './organisms/DeliveryPartnerCard';
import OrderItemsCard from './organisms/OrderItemsCard';
import PaymentSummaryCard from './organisms/PaymentSummaryCard';
import DocumentsCard from './organisms/DocumentsCard';
import RatingCard from './organisms/RatingCard';
import TrackingActionBar from './organisms/TrackingActionBar';
import { formatItemCount } from './tokens/format';
import {
  AWAITING_PARTNER_STATUSES,
  CANCELLABLE_STATUSES,
  CANCELLED_STATUSES,
  INVOICE_STATUSES,
  isOnlineMethod,
  paymentLabelOf,
  resolveTracking,
} from './tokens/tracking';
import { COLORS, SPACING, hp } from './theme';

const HIGHLIGHT_MS = 6000;

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {
    orderId,
    order: initialOrderData,
    autoScrollToRetry,
  } = route.params || {};

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const [orderRating, setOrderRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingType, setRatingType] = useState('order');
  const [pendingRating, setPendingRating] = useState(0);
  const [retryLoading, setRetryLoading] = useState(false);
  const [highlightRetry, setHighlightRetry] = useState(false);
  const [statusModal, setStatusModal] = useState({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });

  const {
    loading,
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

  const tracking = useMemo(
    () => resolveTracking(effectiveOrderStatus),
    [effectiveOrderStatus],
  );

  const isCancelled = CANCELLED_STATUSES.includes(effectiveOrderStatus);
  const showRetry = canRetryPayment && !hasOnlinePaid;

  const goBack = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: { screen: 'Home', params: { screen: 'MyOrdersScreen' } },
          },
        ],
      }),
    );
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        goBack,
      );
      return () => subscription.remove();
    }, [goBack]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!autoScrollToRetry || !showRetry) return undefined;
      setHighlightRetry(true);
      const timer = setTimeout(() => setHighlightRetry(false), HIGHLIGHT_MS);
      return () => clearTimeout(timer);
    }, [autoScrollToRetry, showRetry]),
  );

  useOrderTracking(
    orderId,
    () => {
      logger.debug('Refreshing order details from live update');
      refreshOrder?.(true);
    },
    locationUpdate => {
      logger.debug('Driver location updated', locationUpdate);
    },
  );

  const openSupportTicket = useCallback(() => {
    navigation.navigate('SupportTicketScreen', {
      orderId,
      orderNumber: displayOrderId,
    });
  }, [navigation, orderId, displayOrderId]);

  const resolvedInvoiceUrl = useMemo(
    () => resolveInvoiceUrl(invoiceFileUrl),
    [invoiceFileUrl],
  );

  const handleViewInvoice = useCallback(() => {
    if (!resolvedInvoiceUrl || !isInvoiceGenerated(resolvedInvoiceUrl)) {
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
  }, [resolvedInvoiceUrl, invoiceNumber, navigation, orderId, displayOrderId]);

  const handleDownloadBill = useCallback(async () => {
    const fullUrl = resolveInvoiceUrl(invoiceUrl);
    if (!fullUrl || !isInvoiceGenerated(fullUrl)) {
      Toast.show(INVOICE_NOT_GENERATED_MESSAGE, Toast.LONG);
      return;
    }
    const opened = await openExternalUrl(fullUrl);
    if (!opened) {
      Toast.show('Unable to download invoice at this time', Toast.SHORT);
    }
  }, [invoiceUrl]);

  const handleRetryPayment = useCallback(async () => {
    if (!razorpayOrderId || !razorpayKeyId) {
      logger.error('Retry payment missing gateway details', {
        razorpayOrderId,
        razorpayKeyId,
      });
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
      setRetryLoading(true);

      const verifyPayload = {
        orderId,
        razorpayOrderId: sdkResponse.razorpay_order_id,
        razorpayPaymentId: sdkResponse.razorpay_payment_id,
        razorpaySignature: sdkResponse.razorpay_signature,
        amount: Number(razorpayAmount),
      };

      const attemptVerification = async () => {
        try {
          return await verifyRazorpayPaymentApi(verifyPayload);
        } catch (error) {
          logger.error('Retry payment verification failed', error);
          return null;
        }
      };

      let verifyResponse = await attemptVerification();
      let retryCount = 0;
      const maxRetries = 1;

      while (
        (!verifyResponse?.success || verifyResponse?.status === 'pending') &&
        retryCount < maxRetries
      ) {
        retryCount++;
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
        return;
      }

      navigation.navigate('OrderPendingScreen', {
        orderId,
        orderNumber: displayOrderId,
        razorpayOrderId: sdkResponse.razorpay_order_id,
        razorpayAmount,
        razorpayKeyId,
      });
    } catch (sdkError) {
      logger.error('Retry payment failed', sdkError);
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
  }, [
    razorpayOrderId,
    razorpayKeyId,
    razorpayAmount,
    displayOrderId,
    shippingAddress,
    orderId,
    navigation,
    grandTotal,
    paymentMethod,
  ]);

  const openRating = useCallback((type, rating) => {
    setPendingRating(rating);
    setRatingType(type);
    setIsRatingModalVisible(true);
  }, []);

  const onRatingSubmit = useCallback(
    async review => {
      setIsRatingModalVisible(false);
      const response =
        ratingType === 'order'
          ? await submitOrderRating(pendingRating, review)
          : await submitDeliveryAgentRating(pendingRating, review);

      if (response?.success) {
        if (ratingType === 'order') setOrderRating(pendingRating);
        else setAgentRating(pendingRating);
        return;
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
    },
    [pendingRating, ratingType, submitDeliveryAgentRating, submitOrderRating],
  );

  const billSummary = useMemo(() => {
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

  const paymentLabel = paymentLabelOf(paymentMethod);
  const normalizedPaymentStatus = paymentStatus?.toLowerCase();
  const paymentInitiated =
    normalizedPaymentStatus === 'initiated' &&
    rawOrderStatus?.toLowerCase() === 'pending';
  const showPaidBadge =
    effectiveOrderStatus === 'delivered' ||
    hasOnlinePaid ||
    (isOnlineMethod(paymentMethod) &&
      (normalizedPaymentStatus === 'pending' || paymentInitiated));

  const timestampLabel = useMemo(() => {
    if (effectiveOrderStatus === 'delivered' && formattedDeliveredAt)
      return `Delivered on ${formattedDeliveredAt}`;
    if (isCancelled && formattedCancelledAt)
      return `Cancelled on ${formattedCancelledAt}`;
    return formattedOrderDate ? `Placed on ${formattedOrderDate}` : null;
  }, [
    effectiveOrderStatus,
    formattedDeliveredAt,
    formattedCancelledAt,
    formattedOrderDate,
    isCancelled,
  ]);

  const showPartner =
    canShowDeliveryAgent &&
    !isCancelled &&
    effectiveOrderStatus !== 'delivered' &&
    !canMarkOverallReview;

  const documentRows = [
    !!resolvedInvoiceUrl && {
      label: 'View invoice',
      caption: invoiceNumber ? `Invoice ${invoiceNumber}` : 'Tax invoice',
      icon: 'receipt-outline',
      tone: 'neutral',
      onPress: handleViewInvoice,
    },
    // INVOICE_STATUSES.includes(effectiveOrderStatus) && {
    //   label: 'Download bill',
    //   caption: 'Save a copy as PDF',
    //   icon: 'download-outline',
    //   tone: 'neutral',
    //   onPress: handleDownloadBill,
    // },
  ];

  const barActions = [
    showRetry && {
      label: 'Retry payment',
      icon: 'refresh',
      variant: 'success',
      highlight: highlightRetry,
      onPress: handleRetryPayment,
    },
    CANCELLABLE_STATUSES.includes(effectiveOrderStatus) && {
      label: 'Cancel order',
      icon: 'close-circle-outline',
      variant: 'ghost',
      onPress: () => setShowCancelModal(true),
    },
  ];

  const showSkeleton = loading && !orderItems?.length;

  if (showSkeleton) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <TrackingHeader
          scrollY={scrollY}
          orderNumber={displayOrderId}
          onBack={goBack}
          onHelp={openSupportTicket}
        />
        <TrackingSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <CustomLoader
        visible={retryLoading || loading}
        text={retryLoading ? 'Verifying Payment...' : 'Updating Order...'}
      />

      <TrackingHeader
        scrollY={scrollY}
        orderNumber={displayOrderId}
        onBack={goBack}
        onHelp={openSupportTicket}
      />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TrackingHero
          tracking={tracking}
          timestampLabel={timestampLabel}
          reason={isCancelled ? cancellationReason : null}
          showStepper={!isCancelled}
        />

        {showPartner && (
          <DeliveryPartnerCard
            name={deliveryAgentName || 'Delivery partner'}
            phone={deliveryAgentPhone}
            awaiting={
              AWAITING_PARTNER_STATUSES.includes(effectiveOrderStatus) ||
              !deliveryAgentName
            }
          />
        )}

        {canMarkOverallReview && (
          <RatingCard
            title="How was your experience?"
            caption="Tap a star to rate this order"
            value={orderRating}
            onRate={rating => openRating('order', rating)}
          />
        )}

        <SectionHeading
          title="Items in this order"
          right={<CountPill label={formatItemCount(itemCount)} />}
        />
        <OrderItemsCard
          items={orderItems}
          orderStatus={effectiveOrderStatus}
          total={grandTotal}
          bill={billSummary}
          onReturn={item => {
            setSelectedReturnItem(item);
            setShowReturnModal(true);
          }}
        />

        <SectionHeading title="Delivery route" />
        <Surface style={styles.card}>
          <RouteTimeline
            store={{
              title: 'Picked up from',
              lines: [storeName, 'Main branch'],
            }}
            destination={{
              title: 'Delivering to',
              lines: [
                fullAddress,
                cityStateZip,
                shippingAddress?.mobileNo || shippingAddress?.phoneNo,
              ],
            }}
          />
        </Surface>

        <SectionHeading title="Payment" />
        <PaymentSummaryCard
          label={paymentLabel}
          amount={grandTotal}
          badge={
            showPaidBadge
              ? paymentInitiated
                ? 'Payment initiated'
                : 'Paid successfully'
              : null
          }
        />

        <DocumentsCard rows={documentRows} />

        <SectionHeading title="Order details" />
        <Surface style={styles.detailsCard}>
          <DetailList
            rows={[
              { label: 'Order ID', value: displayOrderId },
              { label: 'Payment', value: paymentLabel },
              { label: 'Deliver to', value: fullAddress },
              {
                label: 'Order placed',
                value: formattedOrderDate || orderDate,
              },
            ]}
          />
        </Surface>

        {canMarkDeliveryReview && (
          <RatingCard
            title="Rate your delivery partner"
            caption={deliveryAgentName || 'Delivery partner'}
            value={agentRating}
            onRate={rating => openRating('agent', rating)}
          />
        )}
      </Animated.ScrollView>

      <TrackingActionBar
        actions={barActions}
        hint={showRetry ? 'Complete your payment to confirm this order' : null}
        bottomInset={insets.bottom}
      />

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
        onClose={() => setStatusModal(state => ({ ...state, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  content: {
    paddingTop: SPACING.md,
    paddingBottom: hp('3%'),
  },
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  detailsCard: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
});

export default OrderTrackingScreen;
