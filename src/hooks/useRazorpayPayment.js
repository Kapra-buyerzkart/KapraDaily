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
      logger.debug('[PAY:cart] 1/6 create-order payload:', { orderId });
      const rzpResponse = await createRazorpayOrderApi({ orderId });
      logger.debug('[PAY:cart] 1/6 create-order response:', rzpResponse);
      if (rzpResponse?.success && rzpResponse?.data) {
        const keyId =
          rzpResponse.data.keyId ||
          rzpResponse.data.razorpayKeyId ||
          rzpResponse.data.razorPayKeyId;
        const razorpayOrderId =
          rzpResponse.data.razorpayOrderId || rzpResponse.data.razorPayOrderId;
        const amount = rzpResponse.data.amount;

        logger.debug('[PAY:cart] 2/6 mapped gateway fields:', {
          keyId,
          razorpayOrderId,
          amount,
          orderId,
          orderNumber,
        });

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

        logger.debug('[PAY:cart] 3/6 razorpay checkout options:', options);

        showLoader(false);
        setTimeout(async () => {
          try {
            const sdkResponse = await RazorpayCheckout.open(options);
            logger.debug('[PAY:cart] 4/6 razorpay sdk response:', sdkResponse);
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

            logger.debug('[PAY:cart] 5/6 verify payload:', verifyPayload);

            const attemptVerification = async () => {
              try {
                verifyError = null;
                const res = await verifyRazorpayPaymentApi(verifyPayload);
                logger.debug(
                  `[PAY:cart] 5/6 verify response (attempt ${retryCount + 1}):`,
                  res,
                );
                logger.warn('[useRazorpayPayment] verify response:', res);
                return res;
              } catch (e) {
                verifyError = e;
                logger.debug(
                  `[PAY:cart] 5/6 verify error (attempt ${retryCount + 1}):`,
                  {
                    status: e?.status,
                    message: e?.message,
                    data: e?.data || e?.response?.data,
                  },
                );
                logger.error('[useRazorpayPayment] verify error:', {
                  status: e?.status,
                  message: e?.message,
                  data: e?.data || e?.response?.data,
                });
                return null;
              }
            };

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

            logger.debug('[PAY:cart] 6/6 verify outcome:', {
              retries: retryCount,
              success: verifyResponse?.success,
              status: verifyResponse?.status,
              settledByBackend: isSettled(),
            });

            if (verifyResponse?.success || isSettled()) {
              logger.debug('[PAY:cart] 6/6 → OrderSuccessScreen', {
                orderId,
                orderNumber,
              });
              await finalizeOrder({ orderId, orderNumber });
            } else {
              logger.debug('[PAY:cart] 6/6 → OrderPendingScreen', {
                orderId,
                orderNumber,
                razorpayOrderId,
              });
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
            logger.debug('[PAY:cart] ✖ sdk/verify threw → OrderFailedScreen:', {
              code: sdkError?.code,
              description: sdkError?.description,
              message: sdkError?.message,
              error: sdkError,
            });
            showLoader(false);
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
        }, 500);
      } else {
        throw new Error(rzpResponse?.message || 'Payment initiation failed');
      }
    } catch (error) {
      logger.debug('[PAY:cart] ✖ processPayment failed:', {
        orderId,
        orderNumber,
        message: error?.message,
        status: error?.status,
        data: error?.data || error?.response?.data,
      });
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
