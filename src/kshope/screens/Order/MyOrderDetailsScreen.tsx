import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import { BackHandler } from 'react-native';
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
import KSHOPE_CONFIG from '../../globals/config';
import {
  INVOICE_NOT_GENERATED_MESSAGE,
  isInvoiceGenerated,
  resolveInvoiceUrl,
} from '../../utils/invoiceUrl';
import { useInvoiceDownload } from '../../hooks/useInvoiceDownload';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import FallbackImage from '../../components/FallbackImage';
import { OrderDetails, OrderLineItem } from '../../types/order';
import { isCashOnDelivery } from './status/paymentMeta';

const STEPPER_STAGES = [
  { label: 'Confirmed', keys: ['pending', 'placed', 'accepted'] },
  { label: 'Shipped', keys: ['packed', 'shipped'] },
  { label: 'Out for delivery', keys: ['outfordelivery'] },
  { label: 'Delivered', keys: ['delivered'] },
];

const money = (amount?: number) =>
  `\u20B9 ${Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}/-`;

const longDate = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return require('../../assets/images/logos/noimage.png');
  if (typeof imagePath !== 'string') return imagePath;
  if (imagePath.startsWith('http')) return { uri: imagePath };
  return {
    uri: `${KSHOPE_CONFIG.image_base_url}/${imagePath}`.replace(
      /([^:]\/)\/+/g,
      '$1',
    ),
  };
};

type RatingBlockProps = {
  title: string;
  caption: string;
  rating: number;
  onRate: (value: number) => void;
  reviewText: string;
  onChangeReview: (value: string) => void;
  placeholder: string;
  submitted: boolean;
  submittedText: string;
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
  submitted,
  submittedText,
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
          disabled={submitted}
          onPress={() => onRate(value)}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${value} out of 5`}
        >
          <AppIcons.Star
            size={dp(34)}
            color={value <= rating ? DESIGN_COLORS.orange : DESIGN_COLORS.star}
          />
        </TouchableOpacity>
      ))}
    </View>

    {submitted ? (
      <Text style={d.rateThanks}>{submittedText}</Text>
    ) : (
      rating > 0 && (
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
      )
    )}
  </View>
);

const MyOrderDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const { profile } = useUser();

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMyOrderDetailsFunction().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
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

  const order: any = route.params?.order ||
    orderDetails?.header || { orderId: route.params?.orderId };
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
  }, [orderDetails]);

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

  const isCancelled = (
    orderDetails?.header?.orderStatus ||
    orderDetails?.header?.status ||
    order?.orderStatus ||
    order?.status ||
    ''
  )
    .toString()
    .toLowerCase()
    .includes('cancel');
  const canCancel =
    !isCancelled &&
    (orderDetails?.header?.canCancel === true || order?.canCancel === true);
  const canRetryPayment = orderDetails?.header?.canRetryPayment === true;

  useEffect(() => {
    fetchMyOrderDetailsFunction();
  }, []);

  const fetchMyOrderDetailsFunction = async () => {
    try {
      showLoader(true);
      const orderId = route.params?.orderId || route.params?.order?.orderId;
      if (!orderId) {
        setOrderDetails(null);
        return;
      }
      const response = await getOrderDetailsApi(orderId);
      console.log(
        'KSHOPE ORDER DETAILS',
        orderId,
        JSON.stringify(response, null, 2),
      );
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
  };

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
        theme: { color: '#F25000' },
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

  const activeOrderId =
    order?.orderId ||
    order?.id ||
    route.params?.orderId ||
    route.params?.order?.orderId;

  const { downloading, canDownload, downloadInvoice } = useInvoiceDownload({
    invoiceUrl: resolveInvoiceUrl(orderDetails?.header?.invoiceFileUrl),
    invoiceNumber: orderDetails?.header?.invoiceNumber,
  });

  if (!activeOrderId) return <View style={d.screen} />;

  const header = orderDetails?.header;
  const orderNumber = header?.orderNumber || selectedItem?.orderNumber;
  const shipping = orderDetails?.shippingAddress;
  const items = orderDetails?.items || [];
  const payment = orderDetails?.payments?.[0];
  const groupOrders: any[] = orderDetails?.groupOrders || [];

  const statusKeys = (orderDetails?.timeline || []).map(step =>
    (step.statusKey || '').toString().toLowerCase(),
  );
  const reachedStage = STEPPER_STAGES.reduce(
    (acc, stage, index) =>
      stage.keys.some(key => statusKeys.includes(key)) ? index : acc,
    -1,
  );

  const itemTotal = header?.subtotal ?? header?.subTotal ?? 0;
  const discountTotal = header?.discountTotal ?? 0;
  const deliveryCharge = header?.deliveryCharge ?? 0;
  const taxTotal = header?.taxTotal ?? 0;
  const grandTotal = header?.grandTotal ?? 0;

  const isCod = isCashOnDelivery(payment?.paymentMethod || '');
  const isDelivered =
    reachedStage === STEPPER_STAGES.length - 1 ||
    (header?.orderStatus || header?.status || order?.orderStatus || '')
      .toString()
      .toLowerCase()
      .includes('delivered');
  const isPaid =
    isDelivered ||
    (!!payment &&
      !isCod &&
      String(payment.paymentStatus || '').toLowerCase() === 'success');
  const totalLabel = isCancelled ? 'Order total' : isPaid ? 'Paid' : 'To pay';

  const invoiceUrl = resolveInvoiceUrl(header?.invoiceFileUrl);

  const openInvoice = () => {
    if (!isInvoiceGenerated(invoiceUrl)) {
      setStatusModal({
        visible: true,
        type: 'error',
        title: 'Invoice not generated',
        message: INVOICE_NOT_GENERATED_MESSAGE,
      });
      return;
    }
    navigation.navigate('KshopeInvoiceViewer', {
      invoiceUrl,
      invoiceNumber: header?.invoiceNumber,
      title: 'Invoice',
    });
  };

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
          <AppIcons.ArrowBack color={DESIGN_COLORS.ink} size={dp(24)} />
        </TouchableOpacity>

        <Text style={d.headerTitle}>Order Details</Text>

        <TouchableOpacity
          style={d.headerCartBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('KshopeCart')}
          accessibilityRole="button"
          accessibilityLabel="Go to cart"
        >
          <AppIcons.Cart size={dp(26)} color={DESIGN_COLORS.orange} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={d.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={d.whiteBlock}>
          {!!header?.orderStatusText && (
            <Text style={d.statusHeading}>
              {`Order ${header.orderStatusText}${
                longDate(header.orderDate)
                  ? ` on ${longDate(header.orderDate)}`
                  : ''
              }`}
            </Text>
          )}

          {items.map(item => (
            <View key={item.orderItemId} style={d.itemBlock}>
              <View style={d.itemRow}>
                <FallbackImage
                  source={getImageUrl(item.featuredImage)}
                  style={d.itemImage}
                  resizeMode="cover"
                />

                <View style={d.itemInfo}>
                  {!!orderNumber && (
                    <Text style={d.itemOrderNo}>{`Order #${orderNumber}`}</Text>
                  )}
                  <Text style={d.itemName} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <View style={d.itemQtyRow}>
                    <Text style={d.itemQty}>
                      {`Qty :  ${String(item.quantity || 1).padStart(2, '0')}`}
                    </Text>
                    <Text style={d.itemPrice}>
                      {money(
                        item.lineTotal ||
                          (item.quantity || 1) *
                            (item.soldPrice || item.unitPrice || 0),
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              {item.canReturn && (
                <View style={d.returnRow}>
                  <TouchableOpacity
                    style={d.returnBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedItem(item);
                      setConfirmModal({ visible: true, type: 'return' });
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Return ${item.productName}`}
                  >
                    <Text style={d.returnBtnText}>Return</Text>
                  </TouchableOpacity>

                  <View style={d.returnNote}>
                    <AppIcons.Reload
                      size={dp(16)}
                      color={DESIGN_COLORS.orange}
                    />
                    <Text style={d.returnNoteText}>
                      Return window close after{' '}
                      <Text style={d.returnNoteAccent}>7 days</Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {(header?.canMarkOverallReview || ratingSubmitted) && (
            <RatingBlock
              title="How was your experience?"
              caption="Tap a star to rate this order"
              rating={rating}
              onRate={setRating}
              reviewText={reviewText}
              onChangeReview={setReviewText}
              placeholder="Write a review (optional)"
              submitted={ratingSubmitted}
              submittedText="Thanks for rating this order."
              onSubmit={handleSubmitRating}
            />
          )}
        </View>

        {!!header && (
          <View style={d.card}>
            <View style={d.cardPad}>
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
                  <Text style={d.toPayLabel}>{totalLabel}</Text>
                  <Text style={d.toPayNote}>
                    {`Inclusive of GST ${money(taxTotal)}`}
                  </Text>
                </View>
                <Text style={d.toPayValue}>{money(grandTotal)}</Text>
              </View>
            </View>

            {discountTotal > 0 && !isCancelled && (
              <View style={d.savedStrip}>
                <AppIcons.CheckCircle
                  size={dp(15)}
                  color={DESIGN_COLORS.greenDeep}
                />
                <Text style={d.savedText}>
                  {`You saved ${money(discountTotal)} on this order`}
                </Text>
              </View>
            )}
          </View>
        )}

        {!!payment && (
          <View style={[d.card, d.cardPad]}>
            <Text style={d.sectionTitle}>Payment details</Text>

            <View style={d.payRow}>
              <View style={d.iconTile}>
                <AppIcons.PaymentCard
                  size={dp(19)}
                  color={DESIGN_COLORS.body}
                />
              </View>

              <View style={d.payBody}>
                <Text style={d.payMethod}>
                  {payment.paymentMethod === 'COD'
                    ? 'Cash on delivery'
                    : 'Online payment'}
                </Text>
                <Text style={d.payCaption}>Total Amount</Text>
              </View>

              <View style={d.payValueCol}>
                <Text style={d.payAmount}>{money(payment.paymentAmount)}</Text>
                {payment.paymentMethod !== 'COD' &&
                  payment.paymentStatus === 'success' && (
                    <View style={d.paidPill}>
                      <AppIcons.CheckCircle
                        size={dp(11)}
                        color={DESIGN_COLORS.greenDeep}
                      />
                      <Text style={d.paidPillText}>Paid successfully</Text>
                    </View>
                  )}
              </View>
            </View>
          </View>
        )}

        {!!invoiceUrl && (
          <View style={[d.card, d.cardPad]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={openInvoice}
              accessibilityRole="button"
              accessibilityLabel="View invoice"
            >
              <View style={d.invoiceRow}>
                <View style={d.iconTile}>
                  <AppIcons.Invoice size={dp(19)} color={DESIGN_COLORS.body} />
                </View>

                <View style={d.invoiceBody}>
                  <Text style={d.invoiceTitle}>View invoice</Text>
                  {!!header?.invoiceNumber && (
                    <Text style={d.invoiceNo}>
                      {`Invoice ${header.invoiceNumber}`}
                    </Text>
                  )}
                </View>

                <AppIcons.ChevronRight
                  size={dp(22)}
                  color={DESIGN_COLORS.muted}
                />
              </View>
            </TouchableOpacity>

            <View style={d.invoiceRule} />

            <TouchableOpacity
              style={d.invoiceDownloadRow}
              activeOpacity={0.85}
              onPress={downloadInvoice}
              disabled={downloading || !canDownload}
              accessibilityRole="button"
              accessibilityLabel="Download invoice"
            >
              {downloading ? (
                <ActivityIndicator size="small" color={DESIGN_COLORS.orange} />
              ) : (
                <AppIcons.Download
                  size={dp(18)}
                  color={
                    canDownload ? DESIGN_COLORS.orange : DESIGN_COLORS.muted
                  }
                />
              )}
              <Text
                style={[
                  d.invoiceDownloadText,
                  !canDownload && d.invoiceDownloadTextDisabled,
                ]}
              >
                {downloading ? 'Downloading…' : 'Download invoice'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {reachedStage >= 0 && (
          <View style={d.trackBlock}>
            <View style={d.trackHeaderRow}>
              <FallbackImage
                source={getImageUrl(items[0]?.featuredImage)}
                style={d.trackThumb}
                resizeMode="contain"
              />

              <View style={d.trackInfo}>
                <Text style={d.trackEta}>{header?.orderStatusText}</Text>
                <Text style={d.trackName} numberOfLines={1}>
                  {items[0]?.productName}
                </Text>
                {!!orderNumber && (
                  <Text style={d.trackOrderNo}>{`Order #${orderNumber}`}</Text>
                )}
              </View>

              {/* <TouchableOpacity
                style={d.trackCta}
                activeOpacity={0.85}
                onPress={() => setIsTrackOpen(!isTrackOpen)}
                accessibilityRole="button"
                accessibilityLabel="Track order"
              >
                <Text style={d.trackCtaText}>Track</Text>
                <AppIcons.ArrowRightCircle
                  size={dp(15)}
                  color={DESIGN_COLORS.white}
                />
              </TouchableOpacity> */}
            </View>

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
                        {done && (
                          <AppIcons.CheckMark
                            size={dp(12)}
                            color={DESIGN_COLORS.white}
                          />
                        )}
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
        )}

        {!!shipping && (
          <View style={d.deliveryCard}>
            <View style={d.deliveryRow}>
              <View style={d.deliveryAvatar}>
                <AppIcons.Person
                  size={dp(26)}
                  color={DESIGN_COLORS.deliveryCard}
                />
              </View>
              <View style={d.deliveryBody}>
                <Text style={d.deliveryTitle}>Delivery To</Text>
                <Text style={d.deliveryValue}>{shipping.custName}</Text>
              </View>
            </View>

            <View style={d.deliveryRule} />

            <View style={d.deliveryRowTop}>
              <View style={d.deliveryIconCol}>
                <AppIcons.Phone size={dp(20)} color={DESIGN_COLORS.ink} />
              </View>
              <View style={d.deliveryBody}>
                <Text style={d.deliveryTitle}>Contact Details</Text>
                <Text style={d.deliveryValue}>{`+91 ${shipping.phone}`}</Text>
              </View>
            </View>

            <View style={d.deliveryGap} />

            <View style={d.deliveryRowTop}>
              <View style={d.deliveryIconCol}>
                <AppIcons.Location size={dp(20)} color={DESIGN_COLORS.ink} />
              </View>
              <View style={d.deliveryBody}>
                <Text style={d.deliveryTitle}>Address</Text>
                <Text style={d.deliveryAddress}>
                  {[
                    shipping.addLine1,
                    shipping.addLine2,
                    shipping.landmark,
                    shipping.pincodeAreaName,
                    shipping.district,
                    shipping.state,
                    shipping.pincode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
            </View>

            <View style={d.deliveryRule} />

            <View style={d.itemPriceRow}>
              <Text style={d.itemPriceLabel}>Item price</Text>
              <Text style={d.itemPriceValue}>{money(grandTotal)}</Text>
            </View>
          </View>
        )}

        {groupOrders.length > 0 && (
          <View style={[d.card, d.cardPad]}>
            <Text style={d.sectionTitle}>
              {`Group Order Placed on, ${longDate(groupOrders[0]?.orderDate)}`}
            </Text>

            {groupOrders.map((groupOrder, index) => (
              <View key={groupOrder.orderId || index}>
                <View style={d.groupRow}>
                  <FallbackImage
                    source={getImageUrl(groupOrder.featuredImage)}
                    style={d.groupThumb}
                    resizeMode="cover"
                  />

                  <View style={d.groupInfo}>
                    <Text style={d.groupStatusText}>
                      {groupOrder.orderStatusText}
                    </Text>
                    <Text style={d.groupName} numberOfLines={1}>
                      {groupOrder.productName}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={d.groupCta}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.push('KshopeOrderDetails', {
                        orderId: groupOrder.orderId,
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`View status of order ${groupOrder.orderNumber}`}
                  >
                    <Text style={d.groupCtaText}>Status</Text>
                    <AppIcons.ArrowRightCircle
                      size={dp(14)}
                      color={DESIGN_COLORS.white}
                    />
                  </TouchableOpacity>
                </View>

                <View style={d.groupMetaRow}>
                  <View>
                    <Text style={d.groupMetaLabel}>Order ID :</Text>
                    <Text
                      style={d.groupMetaValue}
                    >{`#${groupOrder.orderNumber}`}</Text>
                  </View>
                  <View style={d.groupMetaRight}>
                    <Text style={d.groupMetaLabel}>Total Amount :</Text>
                    <Text style={d.groupTotal}>
                      {money(groupOrder.grandTotal)}
                    </Text>
                  </View>
                </View>

                {index < groupOrders.length - 1 && <View style={d.groupRule} />}
              </View>
            ))}
          </View>
        )}

        {(header?.canMarkDeliveryReview || agentRatingSubmitted) && (
          <View style={[d.card, d.rateCard]}>
            <RatingBlock
              title="Rate your delivery partner"
              caption={header?.deliveryAgentName || 'Delivery partner'}
              rating={agentRating}
              onRate={setAgentRating}
              reviewText={agentReviewText}
              onChangeReview={setAgentReviewText}
              placeholder="How was the delivery? (optional)"
              submitted={agentRatingSubmitted}
              submittedText="Thanks for rating your delivery partner."
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

      {(isCancelled || canCancel) && (
        <View style={d.bottomBar}>
          {isCancelled ? (
            <View style={[d.barGhostBtn, d.barGhostDanger]}>
              <AppIcons.Close size={dp(18)} color={DESIGN_COLORS.danger} />
              <Text style={d.barBtnTextDanger}>Cancelled</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={d.barGhostBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmModal({ visible: true, type: 'cancel' })}
              accessibilityRole="button"
              accessibilityLabel="Cancel this order"
            >
              <AppIcons.Close size={dp(18)} color={DESIGN_COLORS.ink} />
              <Text style={d.barBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
        themeColor={DESIGN_COLORS.orange}
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
