import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
  StatusBar,
} from 'react-native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import CartItemCard from '../../components/CartItemCard';
import SaveMoneySection from '../../components/SaveMoneySection';
import { AppText, Badge, Divider } from '../../components/atoms';
import CartStepper from './components/CartStepper';
import AddressCard from './components/AddressCard';
import CheckoutBar from './components/CheckoutBar';
import { UI_COLORS, UI_RADIUS, UI_SPACING, hp, wp } from '../../theme/tokens';
import { colors } from '../../theme/colours';
import { Fonts } from '../../theme/fonts';
import { AppIcons } from '../../assets/icons';
import { useCartScreen } from '../../hooks/useCartScreen';
import { useCart } from '../../context/CartContext';
import { LoaderContext } from '../../context/loaderContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getPaymentModesApi } from '../../api/services/configService';
import { createOrderApi, confirmCodApi } from '../../api/services/orderService';
import {
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from '../../api/services/paymentService';
import {
  updateCartItemApi,
  removeFromCartApi,
} from '../../api/services/cartService';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import { isCartSuccess, cartErrorMessage } from '../../utils/cartFeedback';

const CartStatusBar = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const QTY_UPDATE_FAILED = 'Could not update the quantity';
const ITEM_REMOVE_FAILED = 'Could not remove this item';

import AddressModal from '../../components/AddressModal';
import AddressConfirmationModal from '../../components/AddressConfirmationModal';
import DeliverySlotModal from '../../components/DeliverySlotModal';
import CouponModal from '../../components/CouponModal';
import BillSection from '../../components/BillSection';
import CartEmptyComponent from '../../components/CartEmptyComponent';
import StatusModal from '../../components/StatusModal';
import { useUser } from '../../context/UserContext';

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const {
    cartItems,
    cartSummary,
    billCalculations,
    loadCart,
    getCartSummary,
    clearCart,
    fetchAddresses,

    showCouponModal,
    setShowCouponModal,
    isGiftCard,
    availableCoupons,
    availableGiftCards,
    appliedCouponCode,
    appliedGiftCardCode,
    onApplyOffer,
    onRejectOffer,
    handleCouponClick,

    selectedDeliveryType,
    setSelectedDeliveryType,
    showSlotModal,
    setShowSlotModal,
    datesList,
    slotsByDate,
    addresses,
    onSelectAddress,
    addressConfirmationData,
    setAddressConfirmationData,
    refreshAddresses,
  } = useCartScreen();

  const { showLoader } = useContext(LoaderContext);
  const { refreshCart } = useCart();

  const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModes, setPaymentModes] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [chosenSlot, setChosenSlot] = useState<any>(null);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const selectedAddress = addresses.find(a => a.selected);

  const handleUpdateQty = async (item: any, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(item);
      return;
    }
    try {
      showLoader(true);
      const res = await updateCartItemApi(
        item.cartItemId,
        newQty,
        cartSummary?.cartVersion,
        item.productId,
        selectedAddress?.pincodeAreaId,
      );
      if (isCartSuccess(res)) {
        await refreshCart();
        await getCartSummary(
          selectedDeliveryType,
          chosenSlot?.id,
          null,
          null,
          selectedAddress?.pincodeAreaId,
        );
      } else {
        Toast.show(cartErrorMessage(res, QTY_UPDATE_FAILED), Toast.SHORT);
        await refreshCart();
      }
    } catch (err) {
      Toast.show(cartErrorMessage(err, QTY_UPDATE_FAILED), Toast.SHORT);
    } finally {
      showLoader(false);
    }
  };

  const handleRemoveItem = async (item: any) => {
    try {
      showLoader(true);
      const res = await removeFromCartApi(
        item.cartItemId,
        cartSummary?.cartVersion,
        item.productId,
        selectedAddress?.pincodeAreaId,
      );
      if (isCartSuccess(res)) {
        await refreshCart();
        await getCartSummary(
          selectedDeliveryType,
          chosenSlot?.id,
          null,
          null,
          selectedAddress?.pincodeAreaId,
        );
      } else {
        Toast.show(cartErrorMessage(res, ITEM_REMOVE_FAILED), Toast.SHORT);
        await refreshCart();
      }
    } catch (err) {
      Toast.show(cartErrorMessage(err, ITEM_REMOVE_FAILED), Toast.SHORT);
    } finally {
      showLoader(false);
    }
  };

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await getPaymentModesApi();
        if (response?.success && response?.data) {
          let modes = [...response.data];
          if (
            !modes.some(m =>
              ['online', 'razorpay', 'upi'].includes(
                m.paymentModeName?.toLowerCase(),
              ),
            )
          ) {
            modes.push({
              paymentModeId: 'online_test',
              paymentModeName: 'Online',
              description: 'UPI, Cards, Net Banking',
            });
          }
          setPaymentModes(modes);
          const online = modes.find(m =>
            ['online', 'razorpay', 'upi', 'online payment'].includes(
              m.paymentModeName?.toLowerCase(),
            ),
          );
          if (online) {
            setPaymentMethod(online.paymentModeName);
          } else if (modes.length > 0) {
            setPaymentMethod(modes[0].paymentModeName);
          }
        }
      } catch (err) {
        console.error('Error fetching payment modes:', err);
      }
    };
    fetchPaymentModes();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([getCartSummary(), refreshAddresses()]);
    } finally {
      setRefreshing(false);
    }
  }, [getCartSummary, fetchAddresses]);

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }

    try {
      showLoader(true);
      const summaryRes = await getCartSummary(
        selectedDeliveryType,
        chosenSlot?.id,
        null,
        null,
        selectedAddress?.pincodeAreaId,
      );

      showLoader(false);

      const pincode = selectedAddress.pin || '';
      const area =
        selectedAddress.area ||
        selectedAddress.raw?.areaName ||
        selectedAddress.raw?.pincodeAreaName ||
        selectedAddress.raw?.area ||
        selectedAddress.raw?.area_name ||
        selectedAddress.raw?.district ||
        'N/A';

      if (
        summaryRes?.success === false &&
        (summaryRes?.status === 'STORE_NOT_FOUND' ||
          summaryRes?.status === 'STORE_CLOSED_FOR_DELIVERY')
      ) {
        setAddressConfirmationData({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: false,
          unavailableMessage:
            summaryRes?.message || 'Store is currently closed for delivery',
        });
      } else {
        setAddressConfirmationData({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: true,
          cartVersion:
            summaryRes?.data?.cartVersion ||
            summaryRes?.data?.cart?.cartVersion ||
            summaryRes?.cartVersion,
        });
      }
    } catch (error: any) {
      showLoader(false);
      console.error('❌ [ORDER] Validation Error:', error);
      const pincode = selectedAddress.pin || '';
      const area =
        selectedAddress.area ||
        selectedAddress.raw?.areaName ||
        selectedAddress.raw?.pincodeAreaName ||
        selectedAddress.raw?.area ||
        selectedAddress.raw?.area_name ||
        selectedAddress.raw?.district ||
        'N/A';
      const errorMsg =
        typeof error === 'string'
          ? error
          : error?.message || error?.Message || '';

      if (
        errorMsg.toLowerCase().includes('no store') ||
        errorMsg.toLowerCase().includes('not found') ||
        errorMsg.toLowerCase().includes('closed') ||
        errorMsg.toLowerCase().includes('pincode area')
      ) {
        setAddressConfirmationData({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: false,
          unavailableMessage:
            errorMsg || 'Delivery currently not available in this area.',
        });
      } else {
        setAddressConfirmationData({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: true,
        });
      }
    }
  };

  const submitOrder = async () => {
    const onlineTerms = [
      'online',
      'prepaid',
      'razorpay',
      'upi',
      'online_test',
      'online payment',
    ];
    const isOnlinePayment = onlineTerms.some(term =>
      paymentMethod?.toLowerCase()?.includes(term),
    );

    try {
      showLoader(true);
      const verifiedCartVersion =
        addressConfirmationData?.cartVersion || cartSummary?.cartVersion;
      setAddressConfirmationData(null);

      const refreshedCart = await loadCart();
      const latestVersion =
        refreshedCart?.cartVersion ||
        refreshedCart?.cart?.cartVersion ||
        addressConfirmationData?.cartVersion ||
        cartSummary?.cartVersion;
      const resolvedCartId =
        refreshedCart?.cartId ??
        refreshedCart?.cart?.cartId ??
        cartSummary?.cartId ??
        cartSummary?.cart?.cartId ??
        cartItems?.[0]?.cartId;

      if (resolvedCartId === undefined || resolvedCartId === null) {
        throw new Error('Could not resolve cart ID. Please try again.');
      }

      const createPayload = {
        ...(resolvedCartId !== undefined &&
          resolvedCartId !== null && { cartId: resolvedCartId }),
        shippingAddressId: selectedAddress?.id,
        billingAddressId: selectedAddress?.id,
        paymentMethod: paymentMethod,
        ifMatchCartVersion: latestVersion,
        deliverySlotDate:
          selectedDeliveryType === 'slot'
            ? chosenSlot?.date?.split('T')[0] ||
              (typeof chosenSlot?.date === 'string' ? chosenSlot.date : null)
            : null,
        deliverySlotTime:
          selectedDeliveryType === 'slot'
            ? chosenSlot?.slotValue || null
            : null,
        deliveryMode: 'express',
        orderPlacedFromDevice: 'app',
        pincodeAreaId: selectedAddress?.pincodeAreaId,
      };

      const createResponse = await createOrderApi(createPayload);

      if (createResponse?.success && createResponse?.data?.orderId) {
        const orderId = createResponse.data.orderId;
        const orderNumber = createResponse.data.orderNumber || orderId;

        if (isOnlinePayment) {
          await handlePaymentFlow(orderId, orderNumber);
        } else {
          const confirmResponse = await confirmCodApi(orderId);
          if (confirmResponse?.success) {
            await finalizeOrder(createResponse.data);
          } else {
            throw new Error(
              confirmResponse?.message || 'Failed to confirm COD',
            );
          }
        }
      } else if (createResponse?.status === 'CART_CONFLICT') {
        showLoader(false);
        setStatusType('error');
        setStatusTitle('Price/Stock Changed');
        setStatusMessage(
          'Price or stock of some items has changed, please reload',
        );
        setStatusModalVisible(true);
      } else {
        throw new Error(createResponse?.message || 'Failed to create order');
      }
    } catch (error: any) {
      showLoader(false);
      console.error('❌ [ORDER] submitOrder Catch Error:', error);

      setStatusType('error');
      setStatusTitle('Order Failed');
      setStatusMessage(
        typeof error === 'string'
          ? error
          : error.message ||
              error.Message ||
              'An unexpected error occurred during order creation.',
      );
      setTimeout(() => setStatusModalVisible(true), 500);
    }
  };

  const handlePaymentFlow = async (orderId: any, orderNumber: any) => {
    try {
      const rzpResponse = await createRazorpayOrderApi({ orderId });
      if (rzpResponse?.success && rzpResponse?.data) {
        const keyId = rzpResponse.data.keyId || rzpResponse.data.razorpayKeyId;
        const razorpayOrderId = rzpResponse.data.razorpayOrderId;
        const amount = rzpResponse.data.amount;

        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'KShopee',
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          prefill: {
            email: profile?.email || '',
            contact: profile?.phone || profile?.phoneNo || '',
          },
          theme: { color: '#F25000' },
        };

        showLoader(false);
        setTimeout(async () => {
          try {
            const sdkResponse = await RazorpayCheckout.open(options);
            showLoader(true);
            const verifyPayload = {
              orderId,
              razorpayOrderId: sdkResponse.razorpay_order_id,
              razorpayPaymentId: sdkResponse.razorpay_payment_id,
              razorpaySignature: sdkResponse.razorpay_signature,
              amount: Number(amount),
            };

            let verifyResponse;
            let retryCount = 0;
            const maxRetries = 2;

            const attemptVerification = async () => {
              try {
                return await verifyRazorpayPaymentApi(verifyPayload);
              } catch (e) {
                return null;
              }
            };

            verifyResponse = await attemptVerification();
            while (
              (!verifyResponse?.success ||
                verifyResponse?.status === 'pending') &&
              retryCount < maxRetries
            ) {
              retryCount++;
              await new Promise(resolve =>
                setTimeout(() => resolve(undefined), 3000),
              );
              verifyResponse = await attemptVerification();
            }

            if (verifyResponse?.success) {
              await finalizeOrder({ orderId, orderNumber });
            } else {
              showLoader(false);
              navigation.replace('KshopeOrderPending', {
                orderId,
                orderNumber,
                razorpayOrderId: sdkResponse.razorpay_order_id,
                razorpayAmount: amount,
                razorpayKeyId: keyId,
              });
            }
          } catch (sdkError: any) {
            showLoader(false);
            navigation.navigate('KshopeOrderFailed', {
              errorMessage:
                sdkError?.description || 'Payment cancelled or failed.',
              orderId,
              orderNumber,
              paymentMethod: paymentMethod || 'online',
              totalItems: cartItems?.length || 0,
              totalAmount: billCalculations?.toPay || 0,
            });
            refreshCart();
          }
        }, 500);
      }
    } catch (error: any) {
      showLoader(false);
      setStatusType('error');
      setStatusTitle('Payment Error');
      setStatusMessage(error.message || 'Failed to initialize payment');
      setStatusModalVisible(true);
    }
  };

  const finalizeOrder = async (orderData: any) => {
    const itemsCount = cartItems.length;
    const totalAmount = billCalculations.toPay;
    const mode = selectedDeliveryType === 'slot' ? 'slotted' : 'express';
    const addr = selectedAddress?.address || '';

    try {
      setIsFinalizingOrder(true);
      await clearCart();
    } finally {
      showLoader(false);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'KshopeOrderSuccess',
            params: {
              orderId: orderData.orderId,
              orderNumber: orderData.orderNumber || orderData.orderId,
              paymentMethod,
              totalItems: itemsCount,
              totalAmount: totalAmount,
              deliveryMode: mode,
              address: addr,
            },
          },
        ],
      });
    }
  };

  const mappedItems = cartItems.map(item => ({
    id: String(item.cartItemId),
    title: item.productName,
    price: item.specialPrice || item.unitPrice,
    originalPrice: item.unitPrice,
    discount:
      item.unitPrice > (item.specialPrice || item.unitPrice)
        ? `${Math.round(
            ((item.unitPrice - (item.specialPrice || item.unitPrice)) /
              item.unitPrice) *
              100,
          )}%`
        : '0%',
    quantity: item.quantity,
    image: item.productImage,
  }));

  if (cartItems.length === 0 && !isFinalizingOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <CartStatusBar />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AppIcons.Back color={UI_COLORS.textPrimary} size={22} />
          </TouchableOpacity>
          <AppText variant="title">Cart</AppText>
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <CartEmptyComponent />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CartStatusBar />
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AppIcons.Back color={UI_COLORS.textPrimary} size={22} />
          </TouchableOpacity>
          <AppText variant="title">Summary</AppText>
        </View>

        <CartStepper current={1} />

        <AddressCard
          addressType={selectedAddress?.type}
          addressLine={selectedAddress?.address}
          onChange={() => setShowAddressModal(true)}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sectionCard}>
          <View style={styles.itemsHeading}>
            <AppText variant="heading">Your items</AppText>
            <Badge
              tone="neutral"
              label={`${cartItems.length} ${
                cartItems.length === 1 ? 'item' : 'items'
              }`}
            />
          </View>
          {mappedItems.map(item => (
            <React.Fragment key={item.id}>
              <Divider inset={UI_SPACING.lg} />
              <CartItemCard
                item={item}
                embedded
                onDelete={id => {
                  const originalItem = cartItems.find(
                    i => String(i.cartItemId) === id,
                  );
                  if (originalItem) setItemToRemove(originalItem);
                }}
                onIncrement={id => {
                  const originalItem = cartItems.find(
                    i => String(i.cartItemId) === id,
                  );
                  if (originalItem)
                    handleUpdateQty(
                      originalItem,
                      (originalItem.quantity || 0) + 1,
                    );
                }}
                onDecrement={id => {
                  const originalItem = cartItems.find(
                    i => String(i.cartItemId) === id,
                  );
                  if (originalItem) {
                    if ((originalItem.quantity || 0) <= 1) {
                      setItemToRemove(originalItem);
                    } else {
                      handleUpdateQty(
                        originalItem,
                        (originalItem.quantity || 0) - 1,
                      );
                    }
                  }
                }}
              />
            </React.Fragment>
          ))}
        </View>

        <SaveMoneySection
          appliedCouponCode={appliedCouponCode}
          appliedGiftCardCode={appliedGiftCardCode}
          bcoinsAppliedValue={billCalculations.bcoinsAppliedValue || 0}
          availableBCoins={
            profile?.totalBCoins ||
            profile?.bCoins ||
            profile?.bCoinBalance ||
            0
          }
          onApplyOffer={onApplyOffer}
          onRejectOffer={onRejectOffer}
          bordered
        />
        <BillSection billCalculations={billCalculations} bordered />
      </ScrollView>

      <CheckoutBar
        totalSavings={billCalculations.totalSavings}
        toPay={billCalculations.toPay}
        paymentMethod={paymentMethod}
        onSelectPayment={() => setShowPaymentModal(true)}
        onPay={handleConfirmOrder}
      />

      <StatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />
      <AddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addresses={addresses}
        onSelectAddress={onSelectAddress}
      />
      <DeliverySlotModal
        visible={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        onSelectSlot={(slot: any) => {
          setChosenSlot(slot);
          setSelectedDeliveryType('slot');
        }}
        datesList={datesList}
        slotsByDate={slotsByDate}
      />
      <CouponModal
        profile="cart"
        visible={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        isGiftCard={isGiftCard}
        availableCoupons={availableCoupons}
        availableGiftCards={availableGiftCards}
        onCouponClick={handleCouponClick}
      />
      <ConfirmationModal
        visible={isClearCartModalVisible}
        onClose={() => setIsClearCartModalVisible(false)}
        onConfirm={() => {
          clearCart();
          setIsClearCartModalVisible(false);
        }}
        title="Clear Cart"
        message="Are you sure you want to remove all items?"
        confirmText="Clear All"
        themeColor={colors.red}
      />

      <ConfirmationModal
        visible={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            handleRemoveItem(itemToRemove);
            setItemToRemove(null);
          }
        }}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        themeColor={colors.themeTeal}
      />

      <AddressConfirmationModal
        visible={!!addressConfirmationData}
        onClose={() => {
          setAddressConfirmationData(null);
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }}
        onConfirm={submitOrder}
        data={addressConfirmationData}
      />

      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowPaymentModal(false)}
          />
          <View style={styles.paymentModalContent}>
            <View style={styles.modalHeaderIndicator} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Choose Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentOptionsGrid}>
              {paymentModes.map((mode, index) => {
                const isSelected = paymentMethod === mode.paymentModeName;
                const isCOD = mode.paymentModeName?.toUpperCase() === 'COD';
                return (
                  <TouchableOpacity
                    key={mode.paymentModeId || index}
                    style={[
                      styles.paymentMethodOption,
                      isSelected && styles.paymentMethodOptionActive,
                    ]}
                    onPress={() => {
                      setPaymentMethod(mode.paymentModeName);
                      setShowPaymentModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleActive,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <MaterialCommunityIcons
                      name={isCOD ? 'cash' : 'cellphone'}
                      size={22}
                      color={isCOD ? '#0CA201' : '#1A73E8'}
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.paymentMethodName,
                          isSelected && styles.paymentMethodNameActive,
                        ]}
                      >
                        {mode.paymentModeName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#999',
                          fontFamily: Fonts.gilroyRegular,
                          marginTop: 2,
                        }}
                      >
                        {isCOD
                          ? 'Pay when you receive'
                          : 'UPI, Cards, Net Banking'}
                      </Text>
                    </View>
                    {isSelected && (
                      <AppIcons.Check color={colors.themeTeal} size={16} />
                    )}
                  </TouchableOpacity>
                );
              })}
              {paymentModes.length === 0 && (
                <Text
                  style={{
                    fontSize: 14,
                    color: '#999',
                    fontFamily: Fonts.gilroyMedium,
                    textAlign: 'center',
                    paddingVertical: 12,
                  }}
                >
                  Loading payment methods...
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.card,
  },
  topContainer: {
    backgroundColor: UI_COLORS.card,
    paddingBottom: UI_SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: UI_COLORS.borderStrong,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md,
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.well,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.lg,
    paddingBottom: hp('20%'),
  },
  sectionCard: {
    backgroundColor: UI_COLORS.card,
    borderRadius: UI_RADIUS.card,
    borderWidth: 1,
    borderColor: UI_COLORS.borderStrong,
    overflow: 'hidden',
  },
  itemsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: UI_COLORS.overlay,
    justifyContent: 'flex-end',
  },
  paymentModalContent: {
    backgroundColor: UI_COLORS.card,
    borderTopLeftRadius: UI_RADIUS.card + 8,
    borderTopRightRadius: UI_RADIUS.card + 8,
    padding: UI_SPACING.xxl,
    paddingBottom: hp('5%'),
  },
  modalHeaderIndicator: {
    width: wp('11%'),
    height: 4,
    backgroundColor: UI_COLORS.borderStrong,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: UI_SPACING.lg,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: UI_SPACING.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.gilroyBold,
    color: UI_COLORS.textPrimary,
  },
  paymentOptionsGrid: {
    gap: UI_SPACING.sm,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: UI_SPACING.lg,
    paddingHorizontal: UI_SPACING.lg,
    borderRadius: UI_RADIUS.productCard,
    borderWidth: 1,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
    marginBottom: UI_SPACING.md,
  },
  paymentMethodOptionActive: {
    borderColor: UI_COLORS.primary,
    backgroundColor: UI_COLORS.primaryTint,
  },
  paymentMethodName: {
    fontSize: 15,
    fontFamily: Fonts.gilroyMedium,
    color: UI_COLORS.textPrimary,
  },
  paymentMethodNameActive: {
    fontFamily: Fonts.gilroyBold,
    color: UI_COLORS.primary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: UI_COLORS.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UI_SPACING.md,
  },
  radioCircleActive: {
    borderColor: UI_COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: UI_COLORS.primary,
  },
});
