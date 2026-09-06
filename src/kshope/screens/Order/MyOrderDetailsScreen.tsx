import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import { BackHandler } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { detailsStyles as d } from './detailsStyles';
import { AppIcons } from '../../assets/icons';
import { AppText, Badge, Divider, IconDisc } from '../../components/atoms';
import { UI_COLORS, UI_SPACING, wp } from '../../theme/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoaderContext } from '../../context/loaderContext';
import {
  getOrderDetailsApi,
  reorderApi,
  returnOrderItemApi,
  cancelOrderApi,
} from '../../api/services/orderService';
import { verifyRazorpayPaymentApi } from '../../api/services/paymentService';
import RazorpayCheckout from 'react-native-razorpay';
import { useUser } from '../../context/UserContext';
import KSHOPE_CONFIG from '../../globals/config';
import ConfirmationModal from '../../components/ConfirmationModal';
import StatusModal from '../../components/StatusModal';
import FallbackImage from '../../components/FallbackImage';
import BillSection from '../../components/BillSection';
import { OrderDetails, OrderLineItem } from '../../types/order';

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return require('../../assets/images/logos/noimage.png');
  if (typeof imagePath !== 'string') return imagePath;
  if (imagePath.startsWith('http')) return { uri: imagePath };
  return {
    uri: `${KSHOPE_CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, '$1'),
  };
};

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
    if (orderDetails?.items && orderDetails.items.length > 0 && !selectedItem?.productName) {
      setSelectedItem(orderDetails.items[0]);
    }
  }, [orderDetails]);

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

  const loadedItem =
    orderDetails?.items?.find(i => {
      if (selectedItem?.productId && i.productId)
        return i.productId === selectedItem.productId;
      return i.productName === selectedItem?.productName;
    }) || selectedItem;

  const canReturn = loadedItem?.canReturn === true;
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

  const trackingSteps = orderDetails?.timeline
    ? orderDetails.timeline.map((step, index, arr) => {
        const isCurrent = index === arr.length - 1;
        const isCompleted = true;

        let icon = null;
        if (isCurrent) {
          icon = <AppIcons.Bag size={14} color={UI_COLORS.primary} />;
        }
        return {
          id: index.toString(),
          title: step.statusText,
          subtitle: step.notes,
          time: step.changedAt ? new Date(step.changedAt).toLocaleString() : '',
          isCompleted,
          isCurrent,
          icon,
        };
      })
    : [];

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
      const resolvedOrderId =
        order?.orderId ||
        orderDetails?.header?.orderId ||
        route.params?.orderId ||
        route.params?.order?.orderId;

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
      const resolvedOrderId =
        order?.orderId ||
        orderDetails?.header?.orderId ||
        route.params?.orderId ||
        route.params?.order?.orderId;

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

  const handleRetryPayment = async () => {
    const header = orderDetails?.header;
    const razorpayOrderId = header?.razorPayOrderId;
    const razorpayKeyId = header?.razorPayKeyId;
    const razorpayAmount = header?.razorPayAmount;

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
        description: `Order #${header?.orderNumber || order?.orderId}`,
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
  if (!activeOrderId) return <View style={styles.container} />;

  const orderNumber =
    orderDetails?.header?.orderNumber || selectedItem?.orderNumber;
  const shipping = orderDetails?.shippingAddress;
  const otherItems = (orderDetails?.items || []).filter(i => {
    if (selectedItem?.productId && i.productId)
      return i.productId !== selectedItem.productId;
    return i.productName !== selectedItem?.productName;
  });
  const lineTotal =
    selectedItem?.lineTotal ||
    (selectedItem?.quantity || 1) *
      (selectedItem?.unitPrice || selectedItem?.price || 0);

  return (
    <SafeAreaView style={d.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={UI_COLORS.card} />

      <View style={d.topContainer}>
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
            <AppIcons.Back color={UI_COLORS.textPrimary} size={22} />
          </TouchableOpacity>
          <View style={d.headerTitleWrap}>
            <AppText variant="title">Order details</AppText>
            {!!orderNumber && (
              <AppText variant="caption" tone="muted">
                {orderNumber}
              </AppText>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={d.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={d.card}>
          <View style={d.productRow}>
            <View style={d.productImageTile}>
              <FallbackImage
                source={getImageUrl(selectedItem?.featuredImage)}
                style={d.productImage}
                resizeMode="cover"
              />
            </View>
            <View style={d.productInfo}>
              <AppText variant="bodyStrong" numberOfLines={2}>
                {selectedItem?.productName}
              </AppText>
              <View style={d.productMetaRow}>
                <Badge
                  tone="neutral"
                  label={`Qty ${selectedItem?.quantity || 1}`}
                />
                <AppText variant="priceLarge">
                  ₹{lineTotal.toFixed(2)}
                </AppText>
              </View>
            </View>
          </View>

          <Divider inset={UI_SPACING.lg} />

          <TouchableOpacity
            style={d.buyAgainBtn}
            activeOpacity={0.85}
            onPress={() => setConfirmModal({ visible: true, type: 'reorder' })}
            accessibilityRole="button"
            accessibilityLabel="Buy this item again"
          >
            <MaterialCommunityIcons
              name="refresh"
              size={wp('4.6%')}
              color={UI_COLORS.primary}
            />
            <AppText variant="labelStrong" tone="brand">
              Buy again
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={d.card}>
          <View style={d.statusRow}>
            <View style={d.statusInfo}>
              <AppText variant="micro" tone="faint">
                ORDER STATUS
              </AppText>
              <AppText variant="bodyStrong" numberOfLines={1}>
                {orderDetails?.header?.orderStatusText ||
                  selectedItem?.orderStatusText ||
                  'Order placed'}
              </AppText>
              {!!orderDetails?.header?.orderDate && (
                <AppText variant="caption" tone="muted">
                  {new Date(
                    orderDetails.header.orderDate,
                  ).toLocaleDateString()}
                </AppText>
              )}
            </View>

            {trackingSteps.length > 0 && (
              <TouchableOpacity
                style={d.trackBtn}
                activeOpacity={0.85}
                onPress={() => setIsTrackOpen(!isTrackOpen)}
                accessibilityRole="button"
                accessibilityLabel={
                  isTrackOpen ? 'Hide order tracking' : 'Track order'
                }
              >
                <AppText variant="labelStrong" tone="brand">
                  Track
                </AppText>
                {isTrackOpen ? (
                  <AppIcons.ArrowUp size={16} color={UI_COLORS.primary} />
                ) : (
                  <AppIcons.ArrowDown size={16} color={UI_COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
          </View>

          {isTrackOpen && trackingSteps.length > 0 && (
            <>
              <Divider inset={UI_SPACING.lg} dashed />
              <View style={d.timeline}>
                {trackingSteps.map((step, index) => {
                  const isLast = index === trackingSteps.length - 1;
                  return (
                    <View key={step.id} style={d.timelineRow}>
                      <View style={d.timelineRail}>
                        {step.isCurrent ? (
                          <View style={d.dotCurrent}>{step.icon}</View>
                        ) : step.isCompleted ? (
                          <View style={d.dotDone} />
                        ) : (
                          <View style={d.dotPending} />
                        )}
                        {!isLast && (
                          <View
                            style={
                              step.isCompleted
                                ? d.railLineDone
                                : d.railLinePending
                            }
                          />
                        )}
                      </View>
                      <View style={d.timelineBody}>
                        <AppText
                          variant="labelStrong"
                          tone={step.isCurrent ? 'brand' : 'primary'}
                        >
                          {step.title}
                        </AppText>
                        {!!step.subtitle && (
                          <AppText variant="caption" tone="muted">
                            {step.subtitle}
                          </AppText>
                        )}
                        {!!step.time && (
                          <AppText variant="caption" tone="faint">
                            {step.time}
                          </AppText>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {otherItems.length > 0 && (
          <View style={d.card}>
            <View style={d.sectionHeading}>
              <AppText variant="heading">Also in this order</AppText>
              <Badge
                tone="neutral"
                label={`${otherItems.length} ${
                  otherItems.length === 1 ? 'item' : 'items'
                }`}
              />
            </View>
            <Divider inset={UI_SPACING.lg} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={d.thumbRow}
            >
              {otherItems.map(otherItem => (
                <TouchableOpacity
                  key={otherItem.orderItemId}
                  style={d.thumb}
                  activeOpacity={0.85}
                  onPress={() => setSelectedItem(otherItem)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${otherItem.productName}`}
                >
                  <FallbackImage
                    source={getImageUrl(otherItem.featuredImage)}
                    style={d.thumbImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {!!orderNumber && (
          <View style={d.card}>
            <View style={d.metaRow}>
              <AppText variant="micro" tone="faint">
                ORDER ID
              </AppText>
              <AppText variant="labelStrong">{orderNumber}</AppText>
            </View>
          </View>
        )}

        {!!shipping && (
          <View style={d.card}>
            <View style={d.addressRow}>
              <IconDisc size={wp('9.5%')} tone="ink">
                <AppIcons.Location
                  size={wp('4.6%')}
                  color={UI_COLORS.ink}
                />
              </IconDisc>
              <View style={d.addressBody}>
                <View style={d.addressHeadingRow}>
                  <AppText variant="micro" tone="muted">
                    DELIVERED TO
                  </AppText>
                  <Badge
                    tone="ink"
                    label={(shipping.addressType || 'Home').toUpperCase()}
                  />
                </View>
                <AppText variant="label" tone="secondary">
                  {`${shipping.custName}, ${shipping.addLine1}, ${
                    shipping.pincodeAreaName || ''
                  }, ${shipping.pincode}`}
                </AppText>
              </View>
            </View>
          </View>
        )}

        {orderDetails?.header && (
          <BillSection
            bordered
            billCalculations={{
              itemTotal:
                orderDetails.header.subTotal ??
                orderDetails.header.subtotal ??
                orderDetails.header.itemTotal ??
                orderDetails.header.item_total ??
                0,
              savings:
                orderDetails.header.discountTotal ??
                orderDetails.header.productDiscount ??
                orderDetails.header.product_discount ??
                orderDetails.header.discountAmount ??
                orderDetails.header.savings ??
                orderDetails.header.totalDiscount ??
                orderDetails.header.total_discount ??
                0,
              deliveryCharge:
                orderDetails.header.deliveryCharge ??
                orderDetails.header.deliveryAmount ??
                orderDetails.header.delivery_amount ??
                orderDetails.header.shippingFee ??
                0,
              totalTax:
                orderDetails.header.taxTotal ??
                orderDetails.header.totalTax ??
                orderDetails.header.taxAmount ??
                orderDetails.header.tax_total ??
                0,
              couponDiscount:
                orderDetails.header.couponDiscount ??
                orderDetails.header.couponAmount ??
                orderDetails.header.appliedCouponAmount ??
                0,
              giftCardAmount:
                orderDetails.header.giftCardAmount ??
                orderDetails.header.giftcardValue ??
                orderDetails.header.appliedGiftCardAmount ??
                0,
              bcoinsAppliedValue:
                orderDetails.header.bCoinAppliedValue ??
                orderDetails.header.bcoinsAppliedValue ??
                orderDetails.header.appliedBcoins ??
                orderDetails.header.bcoinValue ??
                0,
              totalSavings:
                orderDetails.header.discountTotal ??
                orderDetails.header.totalDiscount ??
                orderDetails.header.total_discount ??
                orderDetails.header.totalSavings ??
                orderDetails.header.productDiscount ??
                orderDetails.header.discountAmount ??
                0,
              toPay:
                orderDetails.header.grandTotal ??
                orderDetails.header.grand_total ??
                orderDetails.header.totalAmount ??
                orderDetails.header.total_amount ??
                orderDetails.header.toPay ??
                0,
            }}
          />
        )}

        {canRetryPayment && (
          <TouchableOpacity
            onPress={handleRetryPayment}
            style={d.retryBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Retry payment"
          >
            <AppIcons.ArrowUpBold color={UI_COLORS.onPrimary} size={18} />
            <AppText variant="cta" tone="onDark">
              Retry payment
            </AppText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {(isCancelled || canCancel || canReturn) && (
        <View style={d.bottomBar}>
          {isCancelled ? (
            <View style={[d.barGhostBtn, d.barGhostDanger]}>
              <AppIcons.Close size={18} color={UI_COLORS.danger} />
              <AppText variant="cta" tone="danger">
                Cancelled
              </AppText>
            </View>
          ) : canCancel ? (
            <TouchableOpacity
              style={d.barGhostBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmModal({ visible: true, type: 'cancel' })}
              accessibilityRole="button"
              accessibilityLabel="Cancel this order"
            >
              <AppIcons.Close size={18} color={UI_COLORS.textPrimary} />
              <AppText variant="cta">Cancel</AppText>
            </TouchableOpacity>
          ) : null}

          {canReturn && (
            <TouchableOpacity
              style={d.barSolidBtn}
              activeOpacity={0.85}
              onPress={() => setConfirmModal({ visible: true, type: 'return' })}
              accessibilityRole="button"
              accessibilityLabel="Return this item"
            >
              <AppIcons.ArrowDownBold color={UI_COLORS.onPrimary} size={18} />
              <AppText variant="cta" tone="onDark">
                Return item
              </AppText>
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
        themeColor={UI_COLORS.primary}
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
