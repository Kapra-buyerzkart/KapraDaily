import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';

import { useCartScreen } from '../../hooks/useCartScreen';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUser } from '../../context/UserContext';
import { LoaderContext } from '../../context/loaderContext';

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
import { searchProductsApi } from '../../api/services/productService';
import { isCartSuccess, cartErrorMessage } from '../../utils/cartFeedback';
import KSHOPE_CONFIG from '../../globals/config';
import { getKshopeAreaId } from '../../globals/storage';

import AddressModal from '../../components/AddressModal';
import AddressConfirmationModal from '../../components/AddressConfirmationModal';
import DeliverySlotModal from '../../components/DeliverySlotModal';
import CouponModal from '../../components/CouponModal';
import StatusModal from '../../components/StatusModal';
import ConfirmationModal from '../../components/ConfirmationModal';

// Redesign components
import { CartHeader } from './components/CartHeader';
import { CartSpecialBanner } from './components/CartSpecialBanner';
import { CartItemLuxuryCard } from './components/CartItemLuxuryCard';
import { CartAddressCard } from './components/CartAddressCard';
import { CartOffersSection } from './components/CartOffersSection';
import { CartCouponCard } from './components/CartCouponCard';
import { CartSummarySection } from './components/CartSummarySection';
import { CartPaymentSection } from './components/CartPaymentSection';
import { CartTrustBadges } from './components/CartTrustBadges';
import { CartStickyBottomBar } from './components/CartStickyBottomBar';
import { CartEmptyLuxury } from './components/CartEmptyLuxury';
import { CART_COLORS, s } from './cartRedesignTheme';

const CartStatusBar = () => {
  const isFocused = useIsFocused();
  if (!isFocused) return null;

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
    selectedAddress,
    onSelectAddress,
    addressConfirmationData,
    setAddressConfirmationData,
    refreshAddresses,
  } = useCartScreen();

  const { showLoader } = useContext(LoaderContext);
  const { refreshCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [refreshing, setRefreshing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [paymentModes, setPaymentModes] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [chosenSlot, setChosenSlot] = useState<any>(null);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch live products for "Offers For You" carousel
  useEffect(() => {
    let cancelled = false;
    const fetchOffers = async () => {
      try {
        const storedAreaId = await getKshopeAreaId();
        const areaId =
          selectedAddress?.pincodeAreaId ||
          storedAreaId ||
          KSHOPE_CONFIG.default_pincode_area_id;
        const response = await searchProductsApi({
          pincodeAreaId: areaId,
          pageNumber: 1,
          pageSize: 10,
        });
        if (!cancelled && response?.success && response?.data?.items) {
          setRecommendedProducts(response.data.items);
        }
      } catch (err) {
        console.error('Error fetching cart offers:', err);
      }
    };
    fetchOffers();
    return () => {
      cancelled = true;
    };
  }, [selectedAddress?.pincodeAreaId]);

  // Fetch payment modes
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
      const storedAreaId = await getKshopeAreaId();
      const areaId =
        selectedAddress?.pincodeAreaId ||
        storedAreaId ||
        KSHOPE_CONFIG.default_pincode_area_id;
      await Promise.all([
        getCartSummary(),
        refreshAddresses(),
        searchProductsApi({
          pincodeAreaId: areaId,
          pageNumber: 1,
          pageSize: 10,
        })
          .then(res => {
            if (res?.success && res?.data?.items) {
              setRecommendedProducts(res.data.items);
            }
          })
          .catch(() => {}),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [getCartSummary, refreshAddresses, selectedAddress?.pincodeAreaId]);

  const handleUpdateQty = async (item: any, newQty: number) => {
    if (newQty < 1) {
      setItemToRemove(item);
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
          theme: { color: '#0C382E' },
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
              } catch {
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

  const onWishlistPress = () => {
    try {
      navigation.navigate('Wishlist');
    } catch {
      navigation.navigate('KshopeHome', { screen: 'Wishlist' });
    }
  };

  const onExploreJewellery = () => {
    navigation.navigate('KshopeCategory');
  };

  const onProductDetails = (item: any) => {
    navigation.navigate('KshopeProductDetails', {
      productId: item.productId || item.id,
      product: item,
    });
  };

  const supportsCOD = paymentModes.some(
    m => m.paymentModeName?.toUpperCase() === 'COD',
  );

  if (cartItems.length === 0 && !isFinalizingOrder) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <CartStatusBar />
        <CartHeader
          cartCount={0}
          onBack={() => navigation.goBack()}
          onWishlist={onWishlistPress}
        />
        <CartEmptyLuxury onExplore={onExploreJewellery} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <CartStatusBar />

      {/* 1. Header with circular Back, Wishlist, and Bag badge count */}
      <CartHeader
        cartCount={cartItems.length}
        onBack={() => navigation.goBack()}
        onWishlist={onWishlistPress}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 2. "Make it Special" Gifting Banner */}
        <CartSpecialBanner onExploreGifts={onExploreJewellery} />

        {/* 3. Luxury Cart Item Cards */}
        {cartItems.map(item => (
          <CartItemLuxuryCard
            key={String(item.cartItemId)}
            item={item}
            onIncrement={target =>
              handleUpdateQty(target, (target.quantity || 0) + 1)
            }
            onDecrement={target => {
              if ((target.quantity || 0) <= 1) {
                setItemToRemove(target);
              } else {
                handleUpdateQty(target, (target.quantity || 0) - 1);
              }
            }}
            onDelete={target => setItemToRemove(target)}
            onDetails={target => onProductDetails(target)}
          />
        ))}

        {/* 4. Edit Saved Address Card */}
        <CartAddressCard
          address={selectedAddress}
          onEditAddress={() => setShowAddressModal(true)}
        />

        {/* 5. "Offers For You" Horizontal Products Carousel */}
        <CartOffersSection
          products={recommendedProducts}
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
          onSelectProduct={onProductDetails}
          onViewAll={onExploreJewellery}
        />

        {/* 6. Apply Coupon Card */}
        <CartCouponCard
          appliedCouponCode={appliedCouponCode}
          onPress={() => setShowCouponModal(true)}
        />

        {/* 7. Cart Summary Breakdown */}
        <CartSummarySection billCalculations={billCalculations} />

        {/* 8. Payment Method Card */}
        {/* <CartPaymentSection
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          onApplyBankOffer={() => setShowCouponModal(true)}
          supportsCOD={supportsCOD}
        /> */}

        {/* 9. 3-Column Trust Badges */}
        <CartTrustBadges />
      </ScrollView>

      {/* 10. Sticky Bottom Bar with Place Order Action */}
      <CartStickyBottomBar
        toPay={billCalculations.toPay}
        mrpTotal={billCalculations.mrpTotal || billCalculations.itemTotal}
        totalSavings={billCalculations.totalSavings || billCalculations.savings}
        onViewDetails={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
        onPlaceOrder={handleConfirmOrder}
      />

      {/* Modals */}
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
        visible={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            handleRemoveItem(itemToRemove);
            setItemToRemove(null);
          }
        }}
        title="Remove Item"
        message="Are you sure you want to remove this jewellery piece from your cart?"
        confirmText="Remove"
        themeColor={CART_COLORS.darkEmerald}
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
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CART_COLORS.background,
  },
  scrollContent: {
    paddingTop: s(6),
    paddingBottom: s(30),
  },
});
