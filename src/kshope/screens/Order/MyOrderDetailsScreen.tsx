import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  BackHandler,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import { AppIcons } from '../../assets/icons';
import { detailsStyles as d, DESIGN_COLORS, dp } from './detailsStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoaderContext } from '../../context/loaderContext';
import {
  getOrderDetailsApi,
  reorderApi,
  returnOrderItemApi,
  cancelOrderApi,
  rateOrderApi,
  rateDeliveryAgentApi,
} from '../../api/services/orderService';
import { verifyRazorpayPaymentApi } from '../../api/services/paymentService';
import RazorpayCheckout from 'react-native-razorpay';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import KSHOPE_CONFIG from '../../globals/config';
import { resolveInvoiceUrl } from '../../utils/invoiceUrl';
import { useInvoiceDownload } from '../../hooks/useInvoiceDownload';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import FallbackImage from '../../components/FallbackImage';
import { OrderDetails, OrderLineItem } from '../../types/order';
import { isCashOnDelivery } from './status/paymentMeta';

const DEFAULT_FALLBACK_IMAGE = require('../../assets/images/orders/ring.jpg');

const STEPPER_STAGES = [
  { label: 'Confirmed', keys: ['pending', 'placed', 'accepted', 'confirmed'] },
  { label: 'Shipped', keys: ['packed', 'shipped'] },
  { label: 'Out for delivery', keys: ['outfordelivery', 'out for delivery'] },
  { label: 'Delivered', keys: ['delivered'] },
];

const formatCurrency = (amount?: number) =>
  `\u20B9${Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;

const money = (amount?: number) =>
  `\u20B9 ${Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}/-`;

const longDate = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = parsed.toLocaleDateString('en-GB', { month: 'short' }).toLowerCase();
  const year = parsed.getFullYear();
  return `${day} ${month} ${year}`;
};

const getImageUrl = (imagePath?: string | any, fallbackImage = DEFAULT_FALLBACK_IMAGE) => {
  if (!imagePath) return fallbackImage;
  if (typeof imagePath !== 'string') return imagePath;
  if (imagePath.startsWith('http')) return { uri: imagePath };
  return {
    uri: `${KSHOPE_CONFIG.image_base_url}/${imagePath}`.replace(
      /([^:]\/)\/+/g,
      '$1',
    ),
  };
};

const extractItemSpecs = (item?: OrderLineItem | any) => {
  if (!item) return '';
  if (
    item.specifications &&
    typeof item.specifications === 'string' &&
    item.specifications.trim()
  ) {
    return item.specifications.trim();
  }
  if (
    item.subtitle &&
    typeof item.subtitle === 'string' &&
    item.subtitle.trim()
  ) {
    return item.subtitle.trim();
  }
  const parts = [
    item.purity,
    item.metalType || item.metal,
    item.diamondWeight || (item.carat ? `${item.carat} ct` : null),
    item.weight ? `${item.weight}g` : null,
    item.size ? `Size ${item.size}` : null,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(' • ');
  }
  return item.categoryName || item.catName || '';
};

type RatingBlockProps = {
  title: string;
  caption: string;
  rating: number;
  onRate: (value: number) => void;
  reviewText: string;
  onChangeReview: (value: string) => void;
  placeholder: string;
  onSubmit: () => void;
};

const RatingBlock = ({
  title,
  caption,
  rating,
  onRate,
  reviewText,
  onChangeReview,
  placeholder,
  onSubmit,
}: RatingBlockProps) => (
  <View style={d.rateBlock}>
    <Text style={d.rateTitle}>{title}</Text>
    <Text style={d.rateCaption}>{caption}</Text>
    <View style={d.starRow}>
      {[1, 2, 3, 4, 5].map(value => (
        <TouchableOpacity
          key={value}
          style={d.star}
          activeOpacity={0.85}
          onPress={() => onRate(value)}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${value} out of 5`}
        >
          <AppIcons.Star
            size={dp(32)}
            color={value <= rating ? DESIGN_COLORS.orange : DESIGN_COLORS.star}
          />
        </TouchableOpacity>
      ))}
    </View>

    {rating > 0 && (
      <>
        <TextInput
          style={d.rateInput}
          value={reviewText}
          onChangeText={onChangeReview}
          placeholder={placeholder}
          placeholderTextColor={DESIGN_COLORS.muted}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={d.rateSubmit}
          activeOpacity={0.85}
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel="Submit rating"
        >
          <Text style={d.rateSubmitText}>Submit rating</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const MyOrderDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [isTrackOpen, setIsTrackOpen] = useState(
    Boolean(route.params?.openTrack),
  );
  const { profile } = useUser();
  const scrollViewRef = useRef<ScrollView>(null);

  let cartCount = 0;
  try {
    const cartContext = useCart();
    if (cartContext && typeof cartContext.cartCount === 'number') {
      cartCount = cartContext.cartCount;
    }
  } catch {
    cartCount = 0;
  }

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  const fetchMyOrderDetailsFunction = useCallback(async () => {
    try {
      showLoader(true);
      const orderId =
        route.params?.orderId ||
        route.params?.order?.orderId ||
        route.params?.selectedItem?.orderId;
      if (!orderId) {
        setOrderDetails(null);
        return;
      }
      const response = await getOrderDetailsApi(orderId);
      if (response && response.success && response.data) {
        setOrderDetails(response.data);
      } else {
        setOrderDetails(null);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderDetails(null);
    } finally {
      showLoader(false);
    }
  }, [route.params, showLoader]);

  useEffect(() => {
    fetchMyOrderDetailsFunction();
  }, [fetchMyOrderDetailsFunction]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyOrderDetailsFunction().finally(() => setRefreshing(false));
  }, [fetchMyOrderDetailsFunction]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'KshopeHome' }],
            }),
          );
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const orderParam = route.params?.order;
  const order: any =
    orderParam ||
    orderDetails?.header || {
      orderId: route.params?.orderId || route.params?.selectedItem?.orderId,
    };

  const [selectedItem, setSelectedItem] = useState<OrderLineItem>(
    route.params?.selectedItem || {},
  );

  useEffect(() => {
    if (
      orderDetails?.items &&
      orderDetails.items.length > 0 &&
      !selectedItem?.productName
    ) {
      setSelectedItem(orderDetails.items[0]);
    }
  }, [orderDetails, selectedItem?.productName]);

  useEffect(() => {
    const head = orderDetails?.header;
    const existingRating = Number(
      head?.overallRating ?? head?.reviewRating ?? 0,
    );
    if (existingRating > 0) {
      setRating(existingRating);
      setReviewText((head?.reviewText ?? head?.reviewtext ?? '') as string);
      setRatingSubmitted(true);
    }

    const existingAgentRating = Number(
      head?.deliveryAgentRating ?? head?.deliveryRating ?? 0,
    );
    if (existingAgentRating > 0) {
      setAgentRating(existingAgentRating);
      setAgentReviewText(
        (head?.deliveryAgentReviewText ??
          head?.deliveryReviewText ??
          '') as string,
      );
      setAgentRatingSubmitted(true);
    }
  }, [orderDetails]);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [agentRating, setAgentRating] = useState(0);
  const [agentReviewText, setAgentReviewText] = useState('');
  const [agentRatingSubmitted, setAgentRatingSubmitted] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: 'return' | 'cancel' | 'reorder' | null;
  }>({ visible: false, type: null });

  const [statusModal, setStatusModal] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    navigateOnClose?: boolean;
    refreshOnClose?: boolean;
  }>({ visible: false, type: 'success', title: '', message: '' });

  const orderStatusStr = (
    orderDetails?.header?.orderStatus ||
    orderDetails?.header?.status ||
    order?.orderStatus ||
    order?.status ||
    orderParam?.orderStatus ||
    ''
  )
    .toString()
    .toLowerCase();

  const isCancelled = orderStatusStr.includes('cancel');
  const isDeliveredOrder =
    orderStatusStr.includes('deliver') && !orderStatusStr.includes('out for');

  useEffect(() => {
    if (route.params?.focusRating) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [route.params?.focusRating]);

  const canCancel =
    !isCancelled &&
    !isDeliveredOrder &&
    (orderDetails?.header?.canCancel === true ||
      order?.canCancel === true ||
      orderParam?.canCancel === true);
  const canRetryPayment = orderDetails?.header?.canRetryPayment === true;

  const resolveOrderId = () =>
    order?.orderId ||
    orderDetails?.header?.orderId ||
    route.params?.orderId ||
    route.params?.order?.orderId;

  const handleReturn = async () => {
    try {
      showLoader(true);
      const payload = {
        orderId: order?.orderId,
        orderItemId: selectedItem?.orderItemId,
        quantity: selectedItem?.quantity || 1,
        requestReason: 'Damaged product',
      };
      const res = await returnOrderItemApi(payload);
      showLoader(false);
      if (res?.success) {
        setStatusModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: 'Return requested successfully.',
          refreshOnClose: true,
        });
      } else {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: res?.message || 'Failed to process return',
        });
      }
    } catch {
      showLoader(false);
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'An error occurred while processing return',
      });
    }
  };

  const handleCancel = async () => {
    try {
      showLoader(true);
      const resolvedOrderId = resolveOrderId();

      if (!resolvedOrderId) {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: 'Could not find order ID. Please go back and try again.',
        });
        return;
      }

      const payload = {
        orderId: resolvedOrderId,
        reason: 'Cancelled by Customer',
        requestedFromDevice: 'app',
      };
      const res = await cancelOrderApi(payload);
      showLoader(false);
      if (res?.success) {
        setStatusModal({
          visible: true,
          type: 'success',
          title: 'Success',
          message: 'Order cancelled successfully.',
          refreshOnClose: true,
        });
      } else {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: res?.message || 'Failed to cancel order',
        });
      }
    } catch (error: any) {
      console.error('Cancel order error:', error);
      showLoader(false);
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message:
          error?.message || 'An error occurred while cancelling the order',
      });
    }
  };

  const handleReorder = async () => {
    try {
      showLoader(true);
      const resolvedOrderId = resolveOrderId();

      const res = await reorderApi({ orderId: resolvedOrderId });
      showLoader(false);
      if (res?.success) {
        setStatusModal({
          visible: true,
          type: 'success',
          title: 'Added to Cart',
          message: 'These items have been added to your cart.',
        });
      } else {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: res?.message || 'Failed to reorder',
        });
      }
    } catch {
      showLoader(false);
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'An error occurred while reordering',
      });
    }
  };

  const submitRating = async (
    submitApi: (payload: any) => Promise<any>,
    value: number,
    text: string,
    onSuccess: () => void,
  ) => {
    if (!value) return;
    const resolvedOrderId = resolveOrderId();

    if (!resolvedOrderId) {
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Could not find order ID. Please go back and try again.',
      });
      return;
    }

    try {
      showLoader(true);
      const payload = {
        orderid: Number(resolvedOrderId),
        rating: Number(value),
        reviewtext: text.trim(),
      };
      const res = await submitApi(payload);
      showLoader(false);
      if (res?.success) {
        onSuccess();
        setStatusModal({
          visible: true,
          type: 'success',
          title: 'Thank you',
          message: 'Your rating has been submitted.',
          refreshOnClose: true,
        });
      } else {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Error',
          message: res?.message || 'Failed to submit rating',
        });
      }
    } catch (error: any) {
      console.error('Rate order error:', error);
      showLoader(false);
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: error?.message || 'An error occurred while submitting rating',
      });
    }
  };

  const handleSubmitRating = () =>
    submitRating(rateOrderApi, rating, reviewText, () =>
      setRatingSubmitted(true),
    );

  const handleSubmitAgentRating = () =>
    submitRating(rateDeliveryAgentApi, agentRating, agentReviewText, () =>
      setAgentRatingSubmitted(true),
    );

  const handleRetryPayment = async () => {
    const payHeader = orderDetails?.header;
    const razorpayOrderId = payHeader?.razorPayOrderId;
    const razorpayKeyId = payHeader?.razorPayKeyId;
    const razorpayAmount = payHeader?.razorPayAmount;

    if (!razorpayOrderId || !razorpayKeyId || !razorpayAmount) {
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Payment details not available. Please try again later.',
      });
      return;
    }

    try {
      const options = {
        key: razorpayKeyId,
        amount: razorpayAmount,
        currency: 'INR',
        name: 'Kapra Daily',
        description: `Order #${payHeader?.orderNumber || order?.orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          email: profile?.email || '',
          contact: profile?.phone || profile?.phoneNo || '',
        },
        theme: { color: DESIGN_COLORS.darkGreen },
      };

      const sdkResponse = await RazorpayCheckout.open(options);
      showLoader(true);

      const verifyPayload = {
        orderId: order?.orderId,
        razorpayOrderId: sdkResponse.razorpay_order_id,
        razorpayPaymentId: sdkResponse.razorpay_payment_id,
        razorpaySignature: sdkResponse.razorpay_signature,
        amount: Number(razorpayAmount),
      };

      const verifyResponse = await verifyRazorpayPaymentApi(verifyPayload);
      showLoader(false);

      if (verifyResponse?.success) {
        setStatusModal({
          visible: true,
          type: 'success',
          title: 'Payment Successful',
          message: 'Your payment has been completed successfully.',
          refreshOnClose: true,
        });
      } else {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Verification Pending',
          message:
            verifyResponse?.message ||
            'Payment verification is pending. Please check back later.',
        });
      }
    } catch {
      showLoader(false);
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Payment Failed',
        message: 'Payment was cancelled or failed.',
      });
    }
  };

  const { downloading, canDownload, downloadInvoice } = useInvoiceDownload({
    invoiceUrl: resolveInvoiceUrl(
      orderDetails?.header?.invoiceFileUrl ||
        order?.invoiceFileUrl ||
        orderParam?.invoiceFileUrl,
    ),
    invoiceNumber:
      orderDetails?.header?.invoiceNumber ||
      order?.invoiceNumber ||
      orderParam?.invoiceNumber,
  });

  const header = orderDetails?.header;
  const orderNumber =
    header?.orderNumber ||
    order?.orderNumber ||
    orderParam?.orderNumber ||
    selectedItem?.orderNumber ||
    '';
  const shipping = orderDetails?.shippingAddress;
  const rawItems = orderDetails?.items || [];

  const primaryItem: OrderLineItem | null =
    rawItems[0] ||
    (selectedItem?.productName ? selectedItem : null) ||
    (orderParam?.items && Array.isArray(orderParam.items) && orderParam.items[0]) ||
    null;

  const payment = orderDetails?.payments?.[0];
  const groupOrders: any[] = orderDetails?.groupOrders || [];

  const statusKeys = (orderDetails?.timeline || []).map(step =>
    (step.statusKey || '').toString().toLowerCase(),
  );
  const computedReachedStage = STEPPER_STAGES.reduce(
    (acc, stage, index) =>
      stage.keys.some(key => statusKeys.includes(key)) ? index : acc,
    -1,
  );

  const getFallbackStage = () => {
    const status = (
      header?.orderStatusText ||
      header?.orderStatus ||
      header?.status ||
      orderParam?.orderStatusText ||
      orderParam?.orderStatus ||
      order?.orderStatusText ||
      order?.orderStatus ||
      ''
    )
      .toString()
      .toLowerCase();
    if (status.includes('deliver') && !status.includes('out for')) return 3;
    if (status.includes('out for') || status.includes('agent')) return 2;
    if (
      status.includes('ship') ||
      status.includes('dispatch') ||
      status.includes('pack')
    ) {
      return 1;
    }
    return 0;
  };

  const reachedStage =
    computedReachedStage >= 0 ? computedReachedStage : getFallbackStage();

  const fallbackTotal = Number(
    orderParam?.grandTotal ??
      order?.grandTotal ??
      selectedItem?.price ??
      selectedItem?.lineTotal ??
      0,
  );

  const itemTotal = Number(
    header?.subtotal ?? header?.subTotal ?? header?.itemTotal ?? fallbackTotal ?? 0,
  );
  const discountTotal = Number(
    header?.discountTotal ?? header?.totalDiscount ?? header?.productDiscount ?? 0,
  );
  const deliveryCharge = Number(
    header?.deliveryCharge ?? header?.deliveryAmount ?? 0,
  );
  const taxTotal = Number(header?.taxTotal ?? header?.totalTax ?? 0);
  const grandTotal = Number(
    header?.grandTotal ?? header?.totalAmount ?? (fallbackTotal || (itemTotal + deliveryCharge - discountTotal)) ?? 0,
  );
  const totalSavings = Number(
    header?.totalSavings ?? header?.savings ?? discountTotal ?? 0,
  );

  const isCod = isCashOnDelivery(payment?.paymentMethod || '');
  const isDelivered =
    reachedStage === STEPPER_STAGES.length - 1 ||
    (header?.orderStatus || header?.status || order?.orderStatus || '')
      .toString()
      .toLowerCase()
      .includes('delivered');
  const isPaid =
    isDelivered ||
    !isCod ||
    (!!payment &&
      String(payment.paymentStatus || '').toLowerCase() === 'success');

  const invoiceNumber =
    header?.invoiceNumber ||
    orderParam?.invoiceNumber ||
    order?.invoiceNumber ||
    (orderNumber ? `INV-${orderNumber}` : '');

  const hasOverallRating =
    Number(header?.overallRating ?? header?.reviewRating ?? 0) > 0;
  const hasAgentRating = Number(header?.deliveryAgentRating ?? 0) > 0;

  // Primary item calculations
  const itemCurrentPrice = Number(
    primaryItem?.lineTotal ||
      primaryItem?.unitPrice ||
      primaryItem?.soldPrice ||
      primaryItem?.price ||
      0,
  );
  const itemOldPrice = Number(
    primaryItem?.mrp || (primaryItem as any)?.originalPrice || 0,
  );
  const itemSavings =
    itemOldPrice > itemCurrentPrice ? itemOldPrice - itemCurrentPrice : 0;
  const itemSavingsPercent =
    itemSavings > 0 && itemOldPrice > 0
      ? Math.round((itemSavings / itemOldPrice) * 100)
      : 0;

  const itemSpecs = extractItemSpecs(primaryItem);

  const customerName =
    shipping?.custName || profile?.name || 'Customer';
  const customerPhone =
    shipping?.phone || profile?.mobile || profile?.phoneNumber || '';
  const customerAddress =
    [
      shipping?.addLine1,
      shipping?.addLine2,
      shipping?.landmark,
      shipping?.pincodeAreaName,
      shipping?.district,
      shipping?.state,
      shipping?.pincode,
    ]
      .filter(Boolean)
      .join(', ');

  const additionalGroupItems: any[] =
    groupOrders.length > 0
      ? groupOrders
      : rawItems.length > 1
      ? rawItems.slice(1).map(rawItem => ({
          orderId: order?.orderId || resolveOrderId(),
          orderNumber: orderNumber || resolveOrderId(),
          productName: rawItem.productName,
          featuredImage:
            rawItem.featuredImage || rawItem.productImage || rawItem.image,
          orderStatusText:
            header?.orderStatusText ||
            header?.status ||
            'Order Confirmed',
          orderDate: header?.orderDate || order?.orderDate,
          grandTotal:
            rawItem.lineTotal || rawItem.soldPrice || rawItem.unitPrice || 0,
        }))
      : [];

  if (!orderDetails && !primaryItem) {
    return (
      <SafeAreaView style={d.screen} edges={['top']}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={DESIGN_COLORS.screen}
        />
        <View style={d.header}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'KshopeHome' }],
                  }),
                );
              }
            }}
            style={d.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppIcons.Back color={DESIGN_COLORS.ink} size={dp(22)} />
          </TouchableOpacity>
          <Text style={d.headerTitle}>Order Details</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={DESIGN_COLORS.darkGreen} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={d.screen} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={DESIGN_COLORS.screen}
      />

      {/* Top Navigation Header */}
      <View style={d.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'KshopeHome' }],
                }),
              );
            }
          }}
          style={d.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppIcons.Back color={DESIGN_COLORS.ink} size={dp(22)} />
        </TouchableOpacity>

        <Text style={d.headerTitle}>Order Details</Text>

        <View style={d.headerRight}>
          <TouchableOpacity
            style={d.headerIconBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('WishlistScreen')}
            accessibilityRole="button"
            accessibilityLabel="View wishlist"
          >
            <AppIcons.HeartOutline size={dp(22)} color={DESIGN_COLORS.ink} />
          </TouchableOpacity>

          <TouchableOpacity
            style={d.headerIconBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('KshopeCart')}
            accessibilityRole="button"
            accessibilityLabel="View cart"
          >
            <AppIcons.BagOutline size={dp(22)} color={DESIGN_COLORS.ink} />
            {cartCount > 0 && (
              <View style={d.cartBadge}>
                <Text style={d.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={d.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Main Product Item Card */}
        {!!primaryItem && (
          <View style={d.productCard}>
            <View style={d.productImageBox}>
              <FallbackImage
                source={getImageUrl(
                  primaryItem.featuredImage ||
                    primaryItem.productImage ||
                    primaryItem.image,
                )}
                style={d.productImage}
                resizeMode="contain"
              />
            </View>

            <View style={d.productInfo}>
              <Text style={d.productTitle} numberOfLines={2}>
                {primaryItem.productName || order?.productName || 'Order Item'}
              </Text>

              {!!itemSpecs && (
                <Text style={d.productSpecs} numberOfLines={1}>
                  {itemSpecs}
                </Text>
              )}

              <View style={d.priceRow}>
                <Text style={d.productPrice}>{formatCurrency(itemCurrentPrice)}</Text>
                {itemOldPrice > itemCurrentPrice && (
                  <Text style={d.productOldPrice}>{formatCurrency(itemOldPrice)}</Text>
                )}
              </View>

              {itemSavings > 0 && (
                <View style={d.savingsRow}>
                  <View style={d.savingsDot} />
                  <Text style={d.savingsText}>
                    {`You save ${formatCurrency(itemSavings)} (${itemSavingsPercent}% OFF)`}
                  </Text>
                </View>
              )}

              {isCancelled ? (
                <View style={d.cancelOrderRow}>
                  <Text style={d.orderCancelledText}>Order Cancelled</Text>
                </View>
              ) : canCancel ? (
                <TouchableOpacity
                  style={d.cancelOrderRow}
                  activeOpacity={0.8}
                  onPress={() => setConfirmModal({ visible: true, type: 'cancel' })}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel Order"
                >
                  <Text style={d.cancelOrderText}>Cancel Order</Text>
                  <AppIcons.ChevronRight size={dp(13)} color={DESIGN_COLORS.teal} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}

        {/* Order Summary Heading */}
        <Text style={d.orderSummaryHeading}>Order Summary</Text>

        {/* Order Summary Card */}
        <View style={d.summaryCard}>
          <View style={d.summaryPad}>
            <View style={d.billRow}>
              <Text style={d.billLabel}>Item Total</Text>
              <Text style={d.billValue}>{money(itemTotal)}</Text>
            </View>

            <View style={d.billRow}>
              <Text style={d.billLabel}>Delivery charge</Text>
              <Text
                style={deliveryCharge === 0 ? d.billValueGreen : d.billValue}
              >
                {deliveryCharge === 0 ? 'FREE' : money(deliveryCharge)}
              </Text>
            </View>

            {discountTotal > 0 && (
              <View style={d.billRow}>
                <Text style={d.billLabel}>Item discount</Text>
                <Text style={d.billValueGreen}>
                  {`- ${money(discountTotal)}`}
                </Text>
              </View>
            )}

            <View style={d.billRule} />

            <View style={d.toPayRow}>
              <View>
                <Text style={d.toPayLabel}>To pay</Text>
                <Text style={d.toPayNote}>
                  {taxTotal > 0
                    ? `inclusive of GST ${money(taxTotal)}`
                    : 'inclusive of all taxes'}
                </Text>
              </View>
              <Text style={d.toPayValue}>{money(grandTotal)}</Text>
            </View>
          </View>

          {totalSavings > 0 && !isCancelled && (
            <View style={d.savedStrip}>
              <AppIcons.CheckCircle
                size={dp(15)}
                color={DESIGN_COLORS.greenDeep}
              />
              <Text style={d.savedText}>
                {`You saved ${money(totalSavings)} on this order`}
              </Text>
            </View>
          )}
        </View>

        {/* Payment details Card */}
        <View style={d.paymentCard}>
          <Text style={d.sectionTitle}>Payment details</Text>

          <View style={d.payRow}>
            <View style={d.iconTile}>
              <AppIcons.PaymentCard
                size={dp(20)}
                color={DESIGN_COLORS.body}
              />
            </View>

            <View style={d.payBody}>
              <Text style={d.payMethod}>
                {payment?.paymentMethod ||
                  header?.paymentMethod ||
                  (isCod ? 'Cash on delivery' : 'Online payment')}
              </Text>
              <Text style={d.payCaption}>Total Amount</Text>
            </View>

            <View style={d.payValueCol}>
              <Text style={d.payAmount}>{money(grandTotal)}</Text>
              {isPaid ? (
                <View style={d.paidPill}>
                  <AppIcons.CheckMark
                    size={dp(10)}
                    color={DESIGN_COLORS.greenDeep}
                  />
                  <Text style={d.paidPillText}>Paid successfully</Text>
                </View>
              ) : isCancelled ? (
                <View style={[d.paidPill, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[d.paidPillText, { color: DESIGN_COLORS.danger }]}>
                    Cancelled
                  </Text>
                </View>
              ) : (
                <View style={[d.paidPill, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[d.paidPillText, { color: '#B45309' }]}>
                    {isCod ? 'Pay on Delivery' : 'Payment Pending'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* View invoice Card */}
        {canDownload ? (
          <TouchableOpacity
            style={d.invoiceCard}
            activeOpacity={0.85}
            onPress={downloadInvoice}
            disabled={downloading}
            accessibilityRole="button"
            accessibilityLabel="View invoice"
          >
            <View style={d.iconTile}>
              {downloading ? (
                <ActivityIndicator size="small" color={DESIGN_COLORS.darkGreen} />
              ) : (
                <AppIcons.Invoice size={dp(20)} color={DESIGN_COLORS.body} />
              )}
            </View>

            <View style={d.invoiceBody}>
              <Text style={d.invoiceTitle}>View invoice</Text>
              <Text style={d.invoiceNo}>
                {`Invoice: ${invoiceNumber}`}
              </Text>
            </View>

            <AppIcons.ChevronRight size={dp(18)} color={DESIGN_COLORS.faint} />
          </TouchableOpacity>
        ) : invoiceNumber ? (
          <View style={d.invoiceCard}>
            <View style={d.iconTile}>
              <AppIcons.Invoice size={dp(20)} color={DESIGN_COLORS.body} />
            </View>

            <View style={d.invoiceBody}>
              <Text style={d.invoiceTitle}>Invoice</Text>
              <Text style={d.invoiceNo}>
                {`Invoice: ${invoiceNumber}`}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Divider before Tracking */}
        <View style={d.divider} />

        {/* Tracking Section */}
        <View style={d.trackBlock}>
          <View style={d.trackHeaderRow}>
            <View style={d.trackThumbBox}>
              <FallbackImage
                source={getImageUrl(
                  primaryItem?.featuredImage ||
                    primaryItem?.productImage ||
                    primaryItem?.image,
                )}
                style={d.trackThumb}
                resizeMode="contain"
              />
            </View>

            <View style={d.trackInfo}>
              <Text style={d.trackEta} numberOfLines={1}>
                {header?.orderStatusText ||
                  (isDelivered
                    ? 'Delivered'
                    : isCancelled
                    ? 'Order Cancelled'
                    : 'In Transit')}
              </Text>
              <Text style={d.trackName} numberOfLines={1}>
                {primaryItem?.productName || order?.productName || 'Order Item'}
              </Text>
              <Text style={d.trackOrderNo}>
                {orderNumber ? `Order #ORD - ${orderNumber}` : `Order #${resolveOrderId()}`}
              </Text>
            </View>

            <TouchableOpacity
              style={d.trackPillBtn}
              activeOpacity={0.85}
              onPress={() => setIsTrackOpen(!isTrackOpen)}
              accessibilityRole="button"
              accessibilityLabel="Track order"
            >
              <Text style={d.trackPillText}>Track</Text>
              <AppIcons.ChevronRight size={dp(12)} color={DESIGN_COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Stepper */}
          <View style={d.stepper}>
            <View style={d.stepperTrack}>
              {STEPPER_STAGES.map((stage, index) => {
                const done = index <= reachedStage;
                return (
                  <React.Fragment key={stage.label}>
                    {index > 0 && (
                      <View
                        style={[
                          d.stepConnector,
                          done ? d.stepConnectorDone : d.stepConnectorPending,
                        ]}
                      />
                    )}
                    <View
                      style={[
                        d.stepNode,
                        done ? d.stepNodeDone : d.stepNodePending,
                      ]}
                    >
                      <AppIcons.CheckMark
                        size={dp(10)}
                        color={done ? DESIGN_COLORS.white : DESIGN_COLORS.stepPendingCircle}
                      />
                    </View>
                  </React.Fragment>
                );
              })}
            </View>

            <View style={d.stepLabelRow}>
              {STEPPER_STAGES.map((stage, index) => (
                <Text
                  key={stage.label}
                  numberOfLines={1}
                  style={[
                    d.stepLabel,
                    index === 0
                      ? d.stepLabelStart
                      : index === STEPPER_STAGES.length - 1
                      ? d.stepLabelEnd
                      : d.stepLabelMid,
                  ]}
                >
                  {stage.label}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Delivery To Card */}
        <View style={d.deliveryCard}>
          <View style={d.deliveryRow}>
            <View style={d.deliveryAvatar}>
              <AppIcons.Person
                size={dp(24)}
                color={DESIGN_COLORS.white}
              />
            </View>
            <View style={d.deliveryBody}>
              <Text style={d.deliveryTitle}>Delivery To</Text>
              <Text style={d.deliveryValue}>{customerName}</Text>
            </View>
          </View>

          <View style={d.deliveryRule} />

          {!!customerPhone && (
            <>
              <View style={d.deliveryRowTop}>
                <View style={d.deliveryIconCol}>
                  <AppIcons.PhoneOutline size={dp(19)} color={DESIGN_COLORS.ink} />
                </View>
                <View style={d.deliveryBody}>
                  <Text style={d.deliverySectionTitle}>Contact Details</Text>
                  <Text style={d.deliveryValue}>
                    {customerPhone.startsWith('+') ? customerPhone : `+91 ${customerPhone}`}
                  </Text>
                </View>
              </View>
              <View style={d.deliveryGap} />
            </>
          )}

          {!!customerAddress && (
            <View style={d.deliveryRowTop}>
              <View style={d.deliveryIconCol}>
                <AppIcons.LocationOutline size={dp(20)} color={DESIGN_COLORS.ink} />
              </View>
              <View style={d.deliveryBody}>
                <Text style={d.deliverySectionTitle}>Address</Text>
                <Text style={d.deliveryAddress}>{customerAddress}</Text>
              </View>
            </View>
          )}

          <View style={d.deliveryRule} />

          <View style={d.itemPriceRow}>
            <Text style={d.itemPriceLabel}>Item price</Text>
            <Text style={d.itemPriceValue}>{money(grandTotal)}</Text>
          </View>
        </View>

        {/* Group Order Placed Section */}
        {additionalGroupItems.length > 0 && (
          <View>
            <Text style={d.groupHeading}>
              {`Group Order Placed on, ${longDate(
                additionalGroupItems[0]?.orderDate || header?.orderDate || order?.orderDate,
              )}`}
            </Text>

            <View style={d.groupCard}>
              {additionalGroupItems.map((groupOrder, index) => (
                <View key={groupOrder.orderId ? `${groupOrder.orderId}-${index}` : index}>
                  <View style={d.groupRow}>
                    <View style={d.groupThumbBox}>
                      <FallbackImage
                        source={getImageUrl(groupOrder.featuredImage)}
                        style={d.groupThumb}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={d.groupInfo}>
                      <Text style={d.groupStatusText}>
                        {groupOrder.orderStatusText || 'Order Processing'}
                      </Text>
                      <Text style={d.groupName} numberOfLines={1}>
                        {groupOrder.productName}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={d.groupPillBtn}
                      activeOpacity={0.85}
                      onPress={() => {
                        if (groupOrder.orderId && groupOrder.orderId !== resolveOrderId()) {
                          navigation.push('KshopeMyOrderDetails', {
                            orderId: groupOrder.orderId,
                          });
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`View status of ${groupOrder.productName}`}
                    >
                      <Text style={d.groupPillText}>Status</Text>
                      <AppIcons.ChevronRight
                        size={dp(12)}
                        color={DESIGN_COLORS.white}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={d.groupMetaRow}>
                    <View>
                      <Text style={d.groupMetaLabel}>Order ID :</Text>
                      <Text style={d.groupMetaValue}>
                        {`#${groupOrder.orderNumber || orderNumber || resolveOrderId()}`}
                      </Text>
                    </View>
                    <View style={d.groupMetaRight}>
                      <Text style={d.groupMetaLabel}>Total Amount :</Text>
                      <Text style={d.groupTotal}>
                        {money(groupOrder.grandTotal)}
                      </Text>
                    </View>
                  </View>

                  {index < additionalGroupItems.length - 1 && (
                    <View style={d.groupRule} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rating Block if eligible */}
        {(!!header?.canMarkOverallReview ||
          Boolean(route.params?.focusRating) ||
          isDelivered) &&
          !ratingSubmitted &&
          !hasOverallRating && (
            <View style={[d.summaryCard, d.rateCard, { marginHorizontal: dp(16) }]}>
              <RatingBlock
                title="How was your experience?"
                caption="Tap a star to rate this order placement experience"
                rating={rating}
                onRate={setRating}
                reviewText={reviewText}
                onChangeReview={setReviewText}
                placeholder="Write a review (optional)"
                onSubmit={handleSubmitRating}
              />
            </View>
          )}

        {!!header?.canMarkDeliveryReview &&
          !agentRatingSubmitted &&
          !hasAgentRating && (
            <View style={[d.summaryCard, d.rateCard, { marginHorizontal: dp(16), marginTop: dp(14) }]}>
              <RatingBlock
                title="Rate your delivery partner"
                caption={header?.deliveryAgentName || 'Delivery partner'}
                rating={agentRating}
                onRate={setAgentRating}
                reviewText={agentReviewText}
                onChangeReview={setAgentReviewText}
                placeholder="How was the delivery? (optional)"
                onSubmit={handleSubmitAgentRating}
              />
            </View>
          )}

        {canRetryPayment && (
          <TouchableOpacity
            onPress={handleRetryPayment}
            style={d.retryBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Retry payment"
          >
            <AppIcons.ArrowUpBold color={DESIGN_COLORS.white} size={dp(18)} />
            <Text style={d.retryBtnText}>Retry payment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Confirmation & Status Modals */}
      <ConfirmationModal
        visible={confirmModal.visible}
        onClose={() => setConfirmModal({ visible: false, type: null })}
        onConfirm={() => {
          setConfirmModal({ visible: false, type: null });
          if (confirmModal.type === 'return') handleReturn();
          else if (confirmModal.type === 'cancel') handleCancel();
          else if (confirmModal.type === 'reorder') handleReorder();
        }}
        title={
          confirmModal.type === 'cancel'
            ? 'Cancel Order'
            : confirmModal.type === 'reorder'
            ? 'Buy Again'
            : 'Return Item'
        }
        message={
          confirmModal.type === 'cancel'
            ? 'Are you sure you want to cancel this order?'
            : confirmModal.type === 'reorder'
            ? 'Add these items again to your cart?'
            : 'Are you sure you want to return this item?'
        }
        confirmText={
          confirmModal.type === 'cancel'
            ? 'Cancel Order'
            : confirmModal.type === 'reorder'
            ? 'Add to Cart'
            : 'Return'
        }
        themeColor={DESIGN_COLORS.darkGreen}
      />

      <StatusModal
        visible={statusModal.visible}
        onClose={() => {
          setStatusModal(prev => ({ ...prev, visible: false }));
          if (statusModal.refreshOnClose) {
            fetchMyOrderDetailsFunction();
          }
          if (statusModal.navigateOnClose) {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'KshopeHome' }],
                }),
              );
            }
          }
        }}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </SafeAreaView>
  );
};

export default MyOrderDetailsScreen;
