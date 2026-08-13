import { StatusBar, View } from 'react-native';
import React, {
  useContext,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useCartScreen } from '../hooks/useCartScreen';
import { usePaymentModes } from '../hooks/usePaymentModes';
import { useCartRefresh } from '../hooks/useCartRefresh';
import { useScrollToPayment } from '../hooks/useScrollToPayment';
import { useCartDerivedState } from '../hooks/useCartDerivedState';
import { useCartOrder } from '../hooks/useCartOrder';
import { CartContext } from '../context/CartContext';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';
import CartEmptyComponent from '../components/CartEmptyComponent';

import CartHeader from './cart/components/CartHeader';
import AddressSelector from './cart/components/AddressSelector';
import CartHeaderSection from './cart/components/CartHeaderSection';
import CartFooterSection from './cart/components/CartFooterSection';
import CartList from './cart/components/CartList';
import CartModals from './cart/components/CartModals';
import StickyCheckoutBar from './cart/components/StickyCheckoutBar';
import PaymentBottomSheet from './cart/components/PaymentBottomSheet';
import { styles } from './cart/styles/Cart.styles';
import images from '@/assets/images';
import icons from '@/assets/icons';

const CartScreen = () => {
  const navigation = useNavigation();
  const { profile, loadProfile } = useContext(AppContext);
  const {
    billCalculations,
    cartSummary,

    showCouponModal,
    setShowCouponModal,
    couponCode,
    setCouponCode,
    isGiftCard,
    availableCoupons,
    availableGiftCards,
    appliedCouponCode,
    appliedGiftCardCode,
    isCouponApplied,
    isGiftCardApplied,
    onApplyOffer,
    onRejectOffer,
    handleApplyCoupon,
    handleCouponClick,

    selectedDeliveryType,
    setSelectedDeliveryType,

    showSlotModal,
    setShowSlotModal,
  } = useCartScreen();

  const { showLoader } = useContext(LoaderContext);
  const {
    cartItems,
    clearCart,
    removeFromCart,
    getCartSummary,
    error: cartError,
    addresses,
    fetchAddresses,
    showAddressModal,
    setShowAddressModal,
    onSelectAddress,
    onThreeDotsClicked,
    onDeleteClicked,
    onCloseThreeDots,
    addressConfirmationData,
    setAddressConfirmationData,
    refreshCart,
    serviceabilityTrigger,
    setServiceabilityTrigger,
  } = useContext(CartContext);

  const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [checkoutBarHeight, setCheckoutBarHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const selectedAddress = addresses.find(a => a.selected);

  const { paymentModes, paymentMethod, setPaymentMethod } = usePaymentModes();

  const { refreshing, onRefresh } = useCartRefresh({
    getCartSummary,
    fetchAddresses,
    loadProfile,
  });

  const { listRef, scrollOffsetRef } = useScrollToPayment();

  const paymentSheetRef = useRef(null);

  const {
    isCartStoreNotFound,
    hasSoldOutItems,
    soldOutItems,
    ctaLabel,
    scheduleLabel,
    tokenLabel,
    firstProductId,
  } = useCartDerivedState({
    cartItems,
    cartSummary,
    cartError,
    serviceabilityTrigger,
    chosenSlot,
  });

  const {
    isFinalizingOrder,
    statusModalVisible,
    setStatusModalVisible,
    statusType,
    statusTitle,
    statusMessage,
    handleConfirmOrder,
    submitOrder,
  } = useCartOrder({
    navigation,
    profile,
    showLoader,
    cartItems,
    cartSummary,
    billCalculations,
    selectedAddress,
    selectedDeliveryType,
    chosenSlot,
    getCartSummary,
    setShowAddressModal,
    setAddressConfirmationData,
    isCartStoreNotFound,
    clearCart,
    refreshCart,
    paymentMethod,
  });

  const [isRemovingSoldOut, setIsRemovingSoldOut] = useState(false);

  const handleRemoveSoldOut = useCallback(async () => {
    if (isRemovingSoldOut || soldOutItems.length === 0) {
      return;
    }
    setIsRemovingSoldOut(true);
    try {
      for (const item of soldOutItems) {
        await removeFromCart(
          item.cartItemId || item.productId || item.id,
          selectedAddress?.pincodeAreaId,
        );
      }
      await getCartSummary(selectedAddress?.pincodeAreaId);
    } finally {
      setIsRemovingSoldOut(false);
    }
  }, [
    isRemovingSoldOut,
    soldOutItems,
    removeFromCart,
    getCartSummary,
    selectedAddress?.pincodeAreaId,
  ]);

  const ListHeader = useMemo(
    () => (
      <CartHeaderSection
        onAddressPress={() => setShowAddressModal(true)}
        isCartStoreNotFound={isCartStoreNotFound}
        cartError={cartError}
        itemCount={cartItems.length}
        tokenLabel={tokenLabel}
        isScheduled={selectedDeliveryType === 'slot'}
        scheduleLabel={scheduleLabel}
        onSchedulePress={() => setShowSlotModal(true)}
        onSwitchToExpress={() => setSelectedDeliveryType('express')}
      />
    ),
    [
      isCartStoreNotFound,
      cartError,
      cartItems.length,
      tokenLabel,
      selectedDeliveryType,
      scheduleLabel,
      setShowAddressModal,
      setShowSlotModal,
      setSelectedDeliveryType,
    ],
  );

  const ListFooter = useMemo(
    () => (
      <CartFooterSection
        onWishlistPress={() =>
          navigation.navigate('MainTabs', { screen: 'Wishlist' })
        }
        appliedCouponCode={appliedCouponCode}
        appliedGiftCardCode={appliedGiftCardCode}
        isCouponApplied={isCouponApplied}
        isGiftCardApplied={isGiftCardApplied}
        bcoinsAppliedValue={billCalculations.bcoinsAppliedValue}
        availableBCoins={profile?.totalBCoins || profile?.bCoins || 0}
        onApplyOffer={onApplyOffer}
        onRejectOffer={onRejectOffer}
        billCalculations={billCalculations}
        firstProductId={firstProductId}
        pincodeAreaId={selectedAddress?.pincodeAreaId}
        bottomSpacerHeight={hp('14%') + insets.bottom}
      />
    ),
    [
      navigation,
      appliedCouponCode,
      appliedGiftCardCode,
      isCouponApplied,
      isGiftCardApplied,
      billCalculations,
      profile?.totalBCoins,
      profile?.bCoins,
      onApplyOffer,
      onRejectOffer,
      firstProductId,
      selectedAddress?.pincodeAreaId,
      insets.bottom,
    ],
  );

  if (cartItems.length === 0 && !isFinalizingOrder) {
    return (
      <View style={[styles.mainContainer, styles.emptyContainer]}>
        <CartEmptyComponent />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <CartHeader
          onBack={() => navigation.goBack()}
          onClearAll={() => setIsClearCartModalVisible(true)}
          itemCount={cartItems.length}
        />
        <AddressSelector
          address={selectedAddress?.address}
          onPress={() => setShowAddressModal(true)}
        />
      </View>

      <CartList
        listRef={listRef}
        data={cartItems}
        pincodeAreaId={selectedAddress?.pincodeAreaId}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={e => {
          scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
        }}
      />

      <StickyCheckoutBar
        paymentMethod={paymentMethod}
        onPaymentChipPress={() => paymentSheetRef.current?.open()}
        totalToPay={billCalculations.toPay}
        ctaLabel={isRemovingSoldOut ? 'Removing…' : ctaLabel}
        ctaDisabled={isCartStoreNotFound || isRemovingSoldOut}
        ctaShowPrice={!isCartStoreNotFound && !hasSoldOutItems}
        onCheckout={hasSoldOutItems ? handleRemoveSoldOut : handleConfirmOrder}
        onLayout={e => setCheckoutBarHeight(e.nativeEvent.layout.height)}
      />

      <PaymentBottomSheet
        ref={paymentSheetRef}
        paymentModes={paymentModes}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        bottomInset={checkoutBarHeight}
      />

      <CartModals
        navigation={navigation}
        statusModalVisible={statusModalVisible}
        setStatusModalVisible={setStatusModalVisible}
        statusType={statusType}
        statusTitle={statusTitle}
        statusMessage={statusMessage}
        onRefresh={onRefresh}
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        addresses={addresses}
        onSelectAddress={onSelectAddress}
        onThreeDotsClicked={onThreeDotsClicked}
        onDeleteClicked={onDeleteClicked}
        onCloseThreeDots={onCloseThreeDots}
        showSlotModal={showSlotModal}
        setShowSlotModal={setShowSlotModal}
        setChosenSlot={setChosenSlot}
        setSelectedDeliveryType={setSelectedDeliveryType}
        pincodeAreaId={selectedAddress?.pincodeAreaId}
        showCouponModal={showCouponModal}
        setShowCouponModal={setShowCouponModal}
        isGiftCard={isGiftCard}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        handleApplyCoupon={handleApplyCoupon}
        availableCoupons={availableCoupons}
        availableGiftCards={availableGiftCards}
        handleCouponClick={handleCouponClick}
        isClearCartModalVisible={isClearCartModalVisible}
        setIsClearCartModalVisible={setIsClearCartModalVisible}
        clearCart={clearCart}
        addressConfirmationData={addressConfirmationData}
        setAddressConfirmationData={setAddressConfirmationData}
        setServiceabilityTrigger={setServiceabilityTrigger}
        cartError={cartError}
        submitOrder={submitOrder}
      />
    </View>
  );
};

export default CartScreen;
