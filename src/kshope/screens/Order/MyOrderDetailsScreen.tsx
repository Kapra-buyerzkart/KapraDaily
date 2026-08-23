import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
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
import Svg, { Line } from 'react-native-svg';
import { colors } from '../../theme/colours';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { useCommonStyles } from '../../assets/styles';
import LinearGradient from 'react-native-linear-gradient';
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

const DashedLine = () => (
  <View style={styles.trackingDashedSeparator}>
    <Svg height="1" width="100%">
      <Line
        x1="0"
        y1="0.5"
        x2="100%"
        y2="0.5"
        stroke={colors.lightGrey}
        strokeWidth="1"
        strokeDasharray="8, 8"
      />
    </Svg>
  </View>
);

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
  const homeStyles = useCommonStyles();
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
          icon = <AppIcons.Bag size={14} color={colors.themeTeal} />;
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (sdkError: any) {
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

  return (
    <SafeAreaView style={styles.detailsContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.detailsHeader}>
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
          style={styles.backButton}
        >
          <AppIcons.ArrowBack size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.detailsHeaderTitle}>Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.detailsScrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
          <View style={styles.productTopRow}>
            <View style={styles.productImageContainer}>
              <FallbackImage
                source={getImageUrl(selectedItem?.featuredImage)}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.productRightInfo}>
              <Text style={styles.productNameDetail}>
                {selectedItem?.productName}
              </Text>
              <View style={styles.productInfoRow}>
                <Text style={styles.productQtyText}>
                  Qty: {selectedItem?.quantity || 1}
                </Text>
                <Text style={styles.productPriceText}>
                  ₹
                  {(
                    selectedItem?.lineTotal ||
                    (selectedItem?.quantity || 1) *
                      (selectedItem?.unitPrice || selectedItem?.price || 0)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buyAgainBtn}
            onPress={() => setConfirmModal({ visible: true, type: 'reorder' })}
          >
            <Text style={styles.buyAgainText}>Buy again</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
          <View style={styles.trackingTopRow}>
            <View style={styles.trackingLeftInfo}>
              <View>
                <Text style={styles.trackingStatusDetail}>
                  {orderDetails?.header?.orderStatusText ||
                    selectedItem?.orderStatusText}
                </Text>
                <Text style={styles.trackingDateDetail}>
                  {orderDetails?.header?.orderDate
                    ? new Date(
                        orderDetails.header.orderDate,
                      ).toLocaleDateString()
                    : ''}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.trackOrderBtn}
              onPress={() => setIsTrackOpen(!isTrackOpen)}
            >
              <Text style={styles.trackOrderText}>Track Order</Text>
              {isTrackOpen ? (
                <AppIcons.ArrowUp size={16} color={colors.themeTeal} />
              ) : (
                <AppIcons.ArrowDown size={16} color={colors.themeTeal} />
              )}
            </TouchableOpacity>
          </View>

          {isTrackOpen && (
            <View style={styles.trackingExpandedContainer}>
              {trackingSteps.map((step, index) => {
                const isLast = index === trackingSteps.length - 1;
                return (
                  <View key={step.id} style={styles.trackingStepRow}>
                    <View style={styles.trackingStepLeft}>
                      {step.isCurrent ? (
                        <View style={styles.trackingDotCurrentContainer}>
                          {step.icon}
                        </View>
                      ) : step.isCompleted ? (
                        <View style={styles.trackingDotCompleted} />
                      ) : (
                        <View style={styles.trackingDotPending} />
                      )}
                      {!isLast && (
                        <View
                          style={
                            step.isCompleted
                              ? styles.trackingLineCompleted
                              : styles.trackingLinePending
                          }
                        />
                      )}
                    </View>
                    <View style={styles.trackingStepRight}>
                      <Text
                        style={
                          step.isCurrent
                            ? styles.trackingStepTitleCurrent
                            : styles.trackingStepTitlePending
                        }
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.trackingStepSubtitle}>
                        {step.subtitle}
                      </Text>
                      <Text style={styles.trackingStepTime}>{step.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <DashedLine />
        </View>

        {orderDetails?.items && orderDetails.items.length > 1 && (
          <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
            <Text style={styles.otherProductsTitle}>
              Other Products in this order
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.otherProductsRow}
            >
              {orderDetails.items
                .filter(i => {
                  if (selectedItem?.productId && i.productId)
                    return i.productId !== selectedItem.productId;
                  return i.productName !== selectedItem?.productName;
                })
                .map(otherItem => (
                  <TouchableOpacity
                    key={otherItem.orderItemId}
                    onPress={() => setSelectedItem(otherItem)}
                  >
                    <FallbackImage
                      source={getImageUrl(otherItem.featuredImage)}
                      style={styles.otherProductItemImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.orderIdContainer}>
              <Text style={styles.orderIdLabelDetail}>
                Order ID :{' '}
                {orderDetails?.header?.orderNumber || selectedItem?.orderNumber}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.detailCard, { marginHorizontal: 16 }]}>
          <View style={styles.deliveryRow}>
            <View style={styles.deliveryPinContainer}>
              <AppIcons.Location size={14} color={colors.themeTeal} />
            </View>
            <Text style={styles.deliveryToText}>Delivered to :</Text>
            <Text style={styles.deliveryTypeText}>
              {orderDetails?.shippingAddress?.addressType || 'Home'}
            </Text>
          </View>
          <Text style={styles.addressText}>
            {orderDetails?.shippingAddress
              ? `${orderDetails.shippingAddress.custName}, ${
                  orderDetails.shippingAddress.addLine1
                }, ${orderDetails.shippingAddress.pincodeAreaName || ''}, ${
                  orderDetails.shippingAddress.pincode
                }`
              : ''}
          </Text>
        </View>

        {orderDetails?.header && (
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            <BillSection
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
          </View>
        )}

        {canRetryPayment && (
          <TouchableOpacity
            onPress={handleRetryPayment}
            style={{ marginHorizontal: 16, marginBottom: 16 }}
          >
            <LinearGradient
              colors={['#FF5200', '#FF7A3D', '#FF9B5E']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                borderRadius: 30,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
              }}
            >
              <AppIcons.ArrowUpBold color={colors.white} size={20} />
              <Text
                style={[
                  homeStyles.reviewFilterText,
                  homeStyles.reviewFilterTextActive,
                  { marginLeft: 4 },
                ]}
              >
                Retry Payment
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.fixedBottomBar}>
        {isCancelled ? (
          <View
            style={[
              styles.returnBtn,
              { borderColor: '#FF4444', backgroundColor: '#FFF0F0' },
            ]}
          >
            <AppIcons.Close size={20} color="#FF4444" />
            <Text style={[styles.returnBtnText, { color: '#FF4444' }]}>
              Cancelled
            </Text>
          </View>
        ) : canCancel ? (
          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => setConfirmModal({ visible: true, type: 'cancel' })}
          >
            <AppIcons.Close size={20} color={colors.themeTeal} />
            <Text style={[styles.returnBtnText, { color: colors.themeTeal }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        ) : null}

        {canReturn && (
          <LinearGradient
            colors={[colors.themeTeal, colors.themeDarkTeal]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              homeStyles.reviewFilterPillActiveGradient,
              {
                borderRadius: 39,
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
                marginLeft: canCancel || isCancelled ? 10 : 0,
              },
            ]}
          >
            <AppIcons.ArrowDownBold color={colors.white} size={20} />
            <TouchableOpacity
              onPress={() => setConfirmModal({ visible: true, type: 'return' })}
              style={{ marginLeft: 4 }}
            >
              <Text
                style={[
                  homeStyles.reviewFilterText,
                  homeStyles.reviewFilterTextActive,
                ]}
              >
                Return Item
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>

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
        themeColor={colors.themeTeal}
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
