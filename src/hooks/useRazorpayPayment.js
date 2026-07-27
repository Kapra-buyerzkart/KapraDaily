import RazorpayCheckout from 'react-native-razorpay';
import {
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from '../api/paymentService';
import { isPaymentAlreadyCompleted } from '../utils/paymentStatus';
import logger from '../utils/logger';

export const useRazorpayPayment = ({
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
}) => {
  const processPayment = async (orderId, orderNumber) => {
    try {
      const rzpResponse = await createRazorpayOrderApi({ orderId });
      if (rzpResponse?.success && rzpResponse?.data) {
        // Robust mapping: API might return keyId or razorpayKeyId
        const keyId =
          rzpResponse.data.keyId ||
          rzpResponse.data.razorpayKeyId ||
          rzpResponse.data.razorPayKeyId;
        const razorpayOrderId =
          rzpResponse.data.razorpayOrderId || rzpResponse.data.razorPayOrderId;
        const amount = rzpResponse.data.amount;

        if (!keyId || !razorpayOrderId) {
          throw new Error(
            'Incomplete payment details received (Missing Key or Order ID)',
          );
        }

        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'Kapra Daily',
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          prefill: {
            email: profile?.email || '',
            contact:
              profile?.phone ||
              profile?.phoneNo ||
              selectedAddress?.phone ||
              selectedAddress?.phoneNo ||
              '',
          },
          theme: { color: '#512eb0ff' },
        };

        // Increase timeout to ensure loader modality is fully dismissed before SDK opens
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
            let verifyError = null;
            let retryCount = 0;
            const maxRetries = 2;

            const attemptVerification = async () => {
              try {
                verifyError = null;
                const res = await verifyRazorpayPaymentApi(verifyPayload);
                logger.warn('[useRazorpayPayment] verify response:', res);
                return res;
              } catch (e) {
                verifyError = e;
                logger.error('[useRazorpayPayment] verify error:', {
                  status: e?.status,
                  message: e?.message,
                  data: e?.data || e?.response?.data,
                });
                return null;
              }
            };

            // The payment may have been settled by the backend asynchronously
            // (e.g. via a webhook), so verify can report "already processed" /
            // "completed successfully" either in the response or as an error.
            const isSettled = () =>
              isPaymentAlreadyCompleted(verifyResponse) ||
              isPaymentAlreadyCompleted(verifyError);

            verifyResponse = await attemptVerification();
            while (
              (!verifyResponse?.success ||
                verifyResponse?.status === 'pending') &&
              !isSettled() &&
              retryCount < maxRetries
            ) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 3000));
              verifyResponse = await attemptVerification();
            }

            if (verifyResponse?.success || isSettled()) {
              await finalizeOrder({ orderId, orderNumber });
            } else {
              showLoader(false);
              navigation.replace('OrderPendingScreen', {
                orderId,
                orderNumber,
                razorpayOrderId,
                razorpayAmount: amount,
                razorpayKeyId: keyId,
              });
            }
          } catch (sdkError) {
            showLoader(false);
            // Using reset to ensure stack consistency on failure
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'OrderFailedScreen',
                  params: {
                    orderId,
                    orderNumber,
                    paymentMethod: paymentMethod || 'online',
                    totalItems: cartItems.length,
                    totalAmount: billCalculations.toPay,
                    errorMessage:
                      sdkError?.description || 'Payment cancelled or failed.',
                  },
                },
              ],
            });
            refreshCart();
          }
        }, 500); // 500ms safe delay
      } else {
        throw new Error(rzpResponse?.message || 'Payment initiation failed');
      }
    } catch (error) {
      showLoader(false);
      const errorMsg = error.message || String(error);
      const isSessionExpiry =
        errorMsg.toLowerCase().includes('expired') ||
        errorMsg.toLowerCase().includes('not found');

      setStatusType('error');
      setStatusTitle(isSessionExpiry ? 'Session Refreshed' : 'Payment Error');
      setStatusMessage(
        isSessionExpiry
          ? 'Your session was refreshed. Please try placing the order again.'
          : errorMsg || 'Failed to initialize payment',
      );
      setStatusModalVisible(true);
      if (isSessionExpiry) {
        refreshCart();
      }
    }
  };

  return { processPayment };
};
