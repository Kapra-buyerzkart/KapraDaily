import { useState } from 'react';
import { createOrderApi, confirmCodApi } from '../api/orderService';
import { useRazorpayPayment } from './useRazorpayPayment';
import logger from '../utils/logger';

export const useCartOrder = ({
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
}) => {
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

  // Status Modal State
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const finalizeOrder = async orderData => {
    const itemsCount = cartItems.length;
    const totalAmount = billCalculations.toPay;
    const mode = selectedDeliveryType === 'slot' ? 'slotted' : 'express';
    const addr = selectedAddress?.address || '';

    try {
      setIsFinalizingOrder(true);
      await clearCart();
    } catch (error) {
      console.error('⚠️ [ORDER SUCCESS] Error clearing cart:', error);
    } finally {
      showLoader(false);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'OrderSuccessScreen',
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

  const { processPayment } = useRazorpayPayment({
    profile,
    selectedAddress,
    navigation,
    showLoader,
    paymentMethod,
    cartItems,
    billCalculations,
    refreshCart,
    finalizeOrder,
    setStatusType,
    setStatusTitle,
    setStatusMessage,
    setStatusModalVisible,
  });

  // The loader is a native <Modal>; opening the (Reanimated-based) address
  // confirmation modal in the same tick that it dismisses races its close
  // transition and makes the confirmation modal flash and immediately
  // disappear. Give the native modal a moment to fully tear down first —
  // same fix already applied to the popup in CartContext's onSelectAddress.
  const openAddressConfirmation = data => {
    setTimeout(() => setAddressConfirmationData(data), 350);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }

    try {
      showLoader(true);
      // Perform a final summary sync before showing the confirmation modal
      // This ensures we have the absolute latest cartVersion and calculation
      logger.debug('[PAY:cart] 0/6 pre-order summary sync payload:', {
        deliveryType: selectedDeliveryType,
        slotId: chosenSlot?.id,
        pincodeAreaId: selectedAddress.pincodeAreaId,
      });
      const summaryRes = await getCartSummary(
        selectedDeliveryType,
        chosenSlot?.id,
        null, // Force refresh version if needed
        selectedAddress.pincodeAreaId,
      );
      logger.debug('[PAY:cart] 0/6 pre-order summary response:', summaryRes);

      showLoader(false);

      // ─── Min Cart Value Validation ───
      const grandTotal = summaryRes?.data?.grandTotal || 0;
      const minVal = summaryRes?.data?.minCartValue || 0;

      if (
        summaryRes?.data &&
        summaryRes.data.isEligibleToPlaceOrder === 0 &&
        grandTotal < minVal
      ) {
        setStatusType('error');
        setStatusTitle('Minimum Order Value');
        setStatusMessage(
          `Minimum cart value required ₹${minVal}. Please add more items.`,
        );
        setStatusModalVisible(true);
        return;
      }

      const pincode = selectedAddress.pin || '';
      const area =
        selectedAddress.raw?.areaName ||
        selectedAddress.raw?.pincodeAreaName ||
        selectedAddress.raw?.area_name ||
        'N/A';

      const isUnserviceable =
        summaryRes?.status === 'STORE_NOT_FOUND' ||
        summaryRes?.status === 'STORE_CLOSED_FOR_DELIVERY' ||
        String(summaryRes?.message || '')
          .toLowerCase()
          .includes('no store') ||
        String(summaryRes?.message || '')
          .toLowerCase()
          .includes('not found');

      if (isUnserviceable) {
        // Rely on the banner UI; no popup needed
        return;
      } else {
        openAddressConfirmation({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: true,
        });
      }
    } catch (error) {
      showLoader(false);
      console.error('❌ [ORDER] Validation Error:', error);

      const pincode = selectedAddress.pin || '';
      const area =
        selectedAddress.raw?.areaName ||
        selectedAddress.raw?.pincodeAreaName ||
        selectedAddress.raw?.area_name ||
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
        openAddressConfirmation({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: false,
          unavailableMessage:
            errorMsg || 'Delivery currently not available in this area.',
        });
      } else {
        openAddressConfirmation({
          pincode,
          areaName: area,
          isPlacingOrder: true,
          isServiceable: true,
        });
      }
    }
  };

  const submitOrder = async () => {
    if (isCartStoreNotFound) {
      console.warn(
        '❌ [ORDER] Blocked: Attempted to submit order while store is not available',
      );
      return;
    }

    setAddressConfirmationData(null);
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
    logger.debug('[PAY:cart] submitOrder start:', {
      paymentMethod,
      isOnlinePayment,
      itemCount: cartItems?.length,
      toPay: billCalculations?.toPay,
      cartId: cartSummary?.cartId,
      cartVersion: cartSummary?.cartVersion,
    });

    try {
      showLoader(true);

      let currentCartId = cartSummary?.cartId || cartItems?.[0]?.cartId;
      let currentCartVersion = cartSummary?.cartVersion;

      if (!currentCartId) {
        console.log('🔄 [ORDER] No cartId found, attempting auto-refresh...');
        // Attempt to get a fresh summary which might recover the session
        const refreshRes = await getCartSummary(
          selectedDeliveryType,
          chosenSlot?.id,
          null,
          selectedAddress?.pincodeAreaId,
        );

        logger.debug('[PAY:cart] cart session refresh response:', refreshRes);

        if (refreshRes?.success && refreshRes?.data?.cartId) {
          console.log('✅ [ORDER] Session recovered successfully');
          currentCartId = refreshRes.data.cartId;
          currentCartVersion = refreshRes.data.cartVersion;
        } else {
          console.error('❌ [ORDER] Session recovery failed');
          throw new Error('Your cart session has expired. Please try again.');
        }
      }

      const createPayload = {
        cartId: currentCartId,
        shippingAddressId: selectedAddress.id,
        billingAddressId: selectedAddress.id,
        paymentMethod: isOnlinePayment ? 'online' : paymentMethod,
        ifMatchCartVersion: currentCartVersion,
        deliverySlotDate:
          selectedDeliveryType === 'slot'
            ? chosenSlot?.date?.includes('T')
              ? chosenSlot.date.split('T')[0]
              : chosenSlot?.date
            : null,
        deliverySlotTime:
          selectedDeliveryType === 'slot'
            ? chosenSlot?.slotValue || null
            : null,
        deliveryMode: selectedDeliveryType === 'slot' ? 'slotted' : 'express',
        orderPlacedFromDevice: 'app',
        pincodeAreaId: selectedAddress.pincodeAreaId,
      };

      logger.debug('[PAY:cart] create-order payload:', createPayload);
      const createResponse = await createOrderApi(createPayload);
      logger.debug('[PAY:cart] create-order response:', createResponse);
      if (createResponse?.success && createResponse?.data?.orderId) {
        const orderId = createResponse.data.orderId;
        const orderNumber = createResponse.data.orderNumber || orderId;

        if (isOnlinePayment) {
          await processPayment(orderId, orderNumber);
        } else {
          logger.debug('[PAY:cart] confirm-COD payload:', { orderId });
          const confirmResponse = await confirmCodApi(orderId);
          logger.debug('[PAY:cart] confirm-COD response:', confirmResponse);
          if (confirmResponse?.success) {
            await finalizeOrder(createResponse.data);
          } else {
            throw new Error(
              confirmResponse?.message || 'Failed to confirm COD',
            );
          }
        }
      } else if (createResponse?.status === 'CART_CONFLICT') {
        logger.debug('[PAY:cart] ✖ create-order CART_CONFLICT:', createResponse);
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
    } catch (error) {
      logger.debug('[PAY:cart] ✖ submitOrder failed:', {
        message: error?.message,
        status: error?.status,
        data: error?.data || error?.response?.data,
      });
      showLoader(false);
      setStatusType('error');
      setStatusTitle('Error');
      setStatusMessage(error.message || 'An unexpected error occurred');
      setStatusModalVisible(true);
    }
  };

  return {
    isFinalizingOrder,
    statusModalVisible,
    setStatusModalVisible,
    statusType,
    statusTitle,
    statusMessage,
    handleConfirmOrder,
    submitOrder,
  };
};
