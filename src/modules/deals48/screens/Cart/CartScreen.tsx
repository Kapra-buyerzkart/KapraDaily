import { DEALS48_ROUTES } from '../../navigation/routes';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  RefreshControl,
  Modal,
} from 'react-native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../assets/theme/typographyTokens';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CartItemCard, {
  CartItem as UICartItem,
} from '../../components/CartItemCard';
import SaveMoneySection from '../../components/SaveMoneySection';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import { useCartScreen } from '../../hooks/useCartScreen';
import { useCart } from '../../context/CartContext';
import { LoaderContext } from '../../../../context/loaderContext';
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

import AddressModal from '../../components/AddressModal';
import AddressConfirmationModal from '../../components/AddressConfirmationModal';
import DeliverySlotModal from '../../components/DeliverySlotModal';
import CouponModal from '../../components/CouponModal';
import BillSection from '../../components/BillSection';
import CartEmptyComponent from '../../components/CartEmptyComponent';
import StoreUnavailable from '../../components/StoreUnavailable';
import StatusModal from '../../components/StatusModal';
import { useUser } from '../../context/UserContext';

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const {
    // Cart
    cartItems,
    cartSummary,
    billCalculations,
    loadCart,
    getCartSummary,
    clearCart,
    cartError,
    fetchAddresses,

    // Offers
    showCouponModal,
    setShowCouponModal,
    couponCode,
    setCouponCode,
    isGiftCard,
    availableCoupons,
    availableGiftCards,
    appliedCouponCode,
    appliedGiftCardCode,
    onApplyOffer,
    onRejectOffer,
    handleApplyCoupon,
    handleCouponClick,

    // Delivery & Addresses
    selectedDeliveryType,
    setSelectedDeliveryType,
    selectedSlot,
    setSelectedSlot,
    showSlotModal,
    setShowSlotModal,
    datesList,
    slotsByDate,
    onSelectDate,
    deliveryModes,
    addresses,
    onSelectAddress,
    onThreeDotsClicked,
    onDeleteClicked,
    onCloseThreeDots,
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
  const [serviceabilityTrigger, setServiceabilityTrigger] = useState(false);

  // Status Modal State
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [chosenSlot, setChosenSlot] = useState<any>(null);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [isAddressFocused, setIsAddressFocused] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const selectedAddress = addresses.find(a => a.selected);

  // --- Cart Item Actions ---
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
      if (res?.success) {
        await refreshCart();
        // Explicitly refresh summary to update totals
        await getCartSummary(
          selectedDeliveryType,
          chosenSlot?.id,
          null, // uses version from ref
          null, // coupon
          selectedAddress?.pincodeAreaId,
        );
      }
    } catch (err) {
      console.error('Error updating qty:', err);
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
      if (res?.success) {
        await refreshCart();
        // Explicitly refresh summary to update totals
        await getCartSummary(
          selectedDeliveryType,
          chosenSlot?.id,
          null,
          null,
          selectedAddress?.pincodeAreaId,
        );
      }
    } catch (err) {
      console.error('Error removing item:', err);
    } finally {
      showLoader(false);
    }
  };

  // Fetch payment modes on mount
  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await getPaymentModesApi();
        if (response?.success && response?.data) {
          let modes = [...response.data];
          // Ensure online exists for testing
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

  // Addresses and Cart summary are handled by useCartScreen focus effect

  // Calculate total B-Tokens
  const totalCartBTokens = cartItems.reduce(
    (sum, item) =>
      sum + (item.totalBtokens || item.bTokenValue || item.bTokens || 0),
    0,
  );

  // Pull-to-Refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([getCartSummary(), refreshAddresses()]);
    } finally {
      setRefreshing(false);
    }
  }, [getCartSummary, fetchAddresses]);

  // --- Order Placement Logic ---
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
        null, // cartVersion
        null, // couponCode (new 4th arg)
        selectedAddress?.pincodeAreaId, // pincodeAreaId (now 5th arg)
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
    console.log('🚀 [ORDER] Starting submitOrder...');
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

      // --- CRITICAL: Always refresh cart list to get the absolute latest version before placing order ---
      console.log('🔄 [ORDER] Refreshing cart list to get latest version...');
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

      console.log('📦 [ORDER] Payload State:', {
        hasSummary: !!cartSummary,
        couponDiscount:
          cartSummary?.couponDiscount ||
          cartSummary?.couponAmount ||
          cartSummary?.discountCoupon ||
          cartSummary?.appliedCouponAmount ||
          0,
        deliveryCharges:
          cartSummary?.deliveryCharge || cartSummary?.shippingCharge || 0,
        toPay: cartSummary?.grandTotal || cartSummary?.netTotal || 0,
        totalSavings:
          cartSummary?.totalSavings || cartSummary?.totalDiscount || 0,
        bcoinsAppliedValue:
          cartSummary?.bcoinDiscount ||
          cartSummary?.bCoinAmount ||
          cartSummary?.bcoinsApplied ||
          cartSummary?.bCoinDiscount ||
          cartSummary?.appliedBCoins ||
          0,
        userBCoins: profile?.totalBCoins || profile?.bCoins || 0,
        cartId: resolvedCartId,
        latestVersion,
        itemsCount: cartItems.length,
        addressId: selectedAddress?.id,
      });

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

      console.log('📤 [ORDER] Sending createOrderApi call...', createPayload);
      const createResponse = await createOrderApi(createPayload);
      console.log('📥 [ORDER] createOrderApi Response:', createResponse);

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
      console.log(
        '❌ [ORDER] submitOrder FULL ERROR OBJECT:',
        JSON.stringify(error, null, 2),
      );
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
              // Fallback to OrderPendingScreen if verification is inconclusive
              navigation.replace(DEALS48_ROUTES.ORDER_PENDING, {
                orderId,
                orderNumber,
                razorpayOrderId: sdkResponse.razorpay_order_id,
                razorpayAmount: amount,
                razorpayKeyId: keyId,
              });
            }
          } catch (sdkError: any) {
            showLoader(false);
            navigation.navigate(DEALS48_ROUTES.ORDER_FAILED, {
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
            name: DEALS48_ROUTES.ORDER_SUCCESS,
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
  }; // --- Rendering Map ---
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AppIcons.Back color={colors.black} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 44 }} />
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
      {/* Top White Container */}
      <View style={styles.topContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AppIcons.Back color={colors.black} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Summary</Text>
          <View style={{ width: 34 }} />
        </View>

        {/* Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperRow}>
            <View style={styles.stepDotSmallOrange} />
            <View style={[styles.stepLine, { backgroundColor: '#F25000' }]} />
            <View style={styles.stepDotLargeContainer}>
              <View style={styles.stepDotLargeInner} />
            </View>
            <View style={[styles.stepLine, { backgroundColor: '#E0E0E0' }]} />
            <View style={styles.stepDotSmallGrey} />
          </View>
          <View style={styles.stepperTextRow}>
            <Text style={styles.stepTextSmall}>Address</Text>
            <Text style={styles.stepTextOrange}>Summary</Text>
            <Text style={styles.stepTextSmall}>Payment</Text>
          </View>
        </View>

        {/* Delivering to Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <MaterialIcons
              name="location-on"
              color={'#F25000'}
              size={24}
              style={{ marginTop: -2 }}
            />
            <View style={styles.addressInfo}>
              <View style={styles.deliveringToRow}>
                <Text style={styles.deliveringToText}>Delivering to : </Text>
                <Text style={styles.addressType}>
                  {selectedAddress?.type || 'Home'}
                </Text>
              </View>
              <Text style={styles.addressDetail} numberOfLines={2}>
                {selectedAddress
                  ? selectedAddress.address
                  : 'No address selected'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddressModal(true)}
                style={{ marginTop: 8 }}
              >
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cart Items List */}
        <View style={styles.itemsSection}>
          {mappedItems.map(item => (
            <CartItemCard
              key={item.id}
              item={item}
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
          ))}
        </View>

        {/* Save Money Section */}
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
        />
        <BillSection billCalculations={billCalculations} />

        {/* Selected Payment Method Trigger */}
        {/* <TouchableOpacity
          style={styles.paymentSectionTriggerCard}
          onPress={() => setShowPaymentModal(true)}
          activeOpacity={0.8}
        >
          <View style={styles.paymentTriggerLeft}>
            <View style={styles.paymentIconBackground}>
              <MaterialCommunityIcons
                name={
                  paymentMethod?.toUpperCase() === 'COD' ? 'cash' : 'cellphone'
                }
                size={22}
                color={
                  paymentMethod?.toUpperCase() === 'COD' ? '#0CA201' : '#1A73E8'
                }
              />
            </View>
            <View style={styles.paymentTriggerTextContainer}>
              <Text style={styles.paymentTriggerLabel}>Payment Method</Text>
              <Text style={styles.paymentTriggerValue}>
                {paymentMethod || 'Online'}
              </Text>
            </View>
          </View>
          <View style={styles.paymentTriggerChangeButton}>
            <Text style={styles.paymentTriggerChangeText}>Change</Text>
          </View>
        </TouchableOpacity> */}

        {/* Bill Summary */}
        {/* <View style={{ marginBottom: -100 }}>
          <BillSection billCalculations={billCalculations} />
        </View> */}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {billCalculations.totalSavings > 0 && (
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsBannerText}>
              Yay! You are saving{' '}
              <Text style={styles.savingsBold}>
                ₹{billCalculations.totalSavings.toFixed(2)}
              </Text>
            </Text>
          </View>
        )}
        <View style={styles.paymentActionRow}>
          <TouchableOpacity
            style={styles.paymentInfo}
            onPress={() => setShowPaymentModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.payUsingLabel}>PAY USING</Text>
            <View style={styles.paymentMethod}>
              <View style={styles.paymentIconCircleOrange}>
                <MaterialCommunityIcons
                  name={
                    paymentMethod?.toUpperCase() === 'COD'
                      ? 'cash'
                      : 'cellphone'
                  }
                  color="#F25000"
                  size={16}
                />
              </View>
              <Text style={styles.payUsingValue}>{paymentMethod}</Text>
              <MaterialCommunityIcons
                name="menu-up"
                color="#000"
                size={24}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleConfirmOrder}
            style={styles.payButtonContainer}
          >
            <LinearGradient
              colors={['#F25000', '#FF7A00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.payButton}
            >
              <Text style={styles.payButtonText}>
                Pay ₹{billCalculations.toPay.toFixed(2)}
              </Text>
              <MaterialCommunityIcons
                name="menu-right"
                color={colors.white}
                size={20}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

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
          setIsAddressFocused(true);
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          setTimeout(() => setIsAddressFocused(false), 2000);
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
    backgroundColor: colors.figmaTeal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: colors.black,
  },
  heartButton: {
    padding: 5,
  },
  heartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.themeTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F8FA',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addressInfo: {
    flex: 1,
  },
  deliveringToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveringToText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: Fonts.gilroyRegular,
  },
  addressType: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.semiBold,
    fontWeight: '600',
  },
  addressDetail: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.gilroyLight,
    lineHeight: 16,
  },
  changeLink: {
    fontSize: 14,
    color: colors.themeTeal,
    fontFamily: Fonts.bold,
    fontWeight: '400',
    // textDecorationLine: 'underline',
  },
  topContainer: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
    zIndex: 10,
  },
  stepperContainer: {
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotSmallOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F25000',
  },
  stepDotSmallGrey: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  stepDotLargeContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD9C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotLargeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F25000',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  stepperTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepTextSmall: {
    fontSize: 10,
    color: '#999999',
    fontFamily: Fonts.gilroyMedium,
  },
  stepTextOrange: {
    fontSize: 10,
    color: '#F25000',
    fontFamily: Fonts.gilroyBold,
  },
  addressSection: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  deliveryDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#E8F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deliveryByText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.gilroyRegular,
  },
  deliveryDate: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.gilroyBold,
  },
  deliveryToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.themeTeal,
    height: 48,
  },
  toggleButtonActive: {
    borderColor: colors.themeDarkTeal,
  },
  toggleGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: Fonts.gilroyBold,
    color: colors.themeTeal,
  },
  toggleTextActive: {
    color: colors.white,
  },
  itemsSection: {
    backgroundColor: colors.figmaTeal,
    borderRadius: 16,
    //  padding: 12,
    // marginBottom: -10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  paymentModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: colors.black,
  },
  paymentSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F8FA',
  },
  paymentSectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
    marginBottom: 12,
  },
  paymentOptionsGrid: {
    gap: 8,
  },
  paymentSectionTriggerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    //  marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F8FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentTriggerTextContainer: {
    flex: 1,
  },
  paymentTriggerLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: Fonts.gilroyMedium,
  },
  paymentTriggerValue: {
    fontSize: 15,
    color: colors.black,
    fontFamily: Fonts.gilroyBold,
    marginTop: 2,
  },
  paymentTriggerChangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF0E6',
  },
  paymentTriggerChangeText: {
    fontSize: 13,
    color: '#F25000',
    fontFamily: Fonts.gilroyBold,
  },
  modalHeaderIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleActive: {
    borderColor: '#F25000',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F25000',
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  paymentMethodOptionActive: {
    borderColor: colors.themeTeal,
    backgroundColor: colors.figmaTeal,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: Fonts.gilroyMedium,
    color: colors.black,
  },
  paymentMethodNameActive: {
    fontFamily: Fonts.gilroyBold,
    color: colors.themeTeal,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingBottom: 34,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  savingsBanner: {
    backgroundColor: colors.figmaTeal,
    paddingVertical: 10,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  savingsBannerText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.gilroyMedium,
  },
  savingsBold: {
    color: colors.green,
    fontFamily: Fonts.gilroyBold,
  },
  paymentActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  payUsingLabel: {
    fontSize: 10,
    color: '#999',
    fontFamily: Fonts.gilroyBold,
    marginBottom: 4,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.themeTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  paymentIconCircleOrange: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFD9C6',
  },
  payUsingValue: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.gilroyMedium,
  },
  payButtonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 16,
    height: 48,
    minWidth: 160,
  },
  payButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: Fonts.gilroyBold,
    marginRight: 8,
  },
});
