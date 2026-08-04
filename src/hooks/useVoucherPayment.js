import { useState, useContext } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {
  getVoucherQuoteApi,
  initiateVoucherPurchaseApi,
  verifyVoucherPurchaseApi,
} from '../api/voucherService';
import { useCart } from '../context/CartContext';
import { AppContext } from '../context/appContext';
import { isPaymentAlreadyCompleted } from '../utils/paymentStatus';
import logger from '../utils/logger';

export const useVoucherPayment = onBalanceChange => {
  const { showStatus } = useCart();
  const { profile } = useContext(AppContext);
  const [successVisible, setSuccessVisible] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  const handleBuyNow = async ({ voucherId, quantity, bCoins, voucherName }) => {
    let purchaseId;
    let amountPayable;
    let sdkResponse;
    let initiated = false;

    try {
      logger.debug('[PAY:voucher] 1/5 quote payload:', {
        voucherId,
        quantity,
        bCoins,
      });
      const quoteRes = await getVoucherQuoteApi(voucherId, quantity, bCoins);
      logger.debug('[PAY:voucher] 1/5 quote response:', quoteRes);

      const initiatePayload = {
        voucherid: voucherId,
        quantity,
        udcoinsrequested: bCoins,
      };
      logger.debug('[PAY:voucher] 2/5 initiate payload:', initiatePayload);
      const initiateRes = await initiateVoucherPurchaseApi(initiatePayload);
      logger.debug('[PAY:voucher] 2/5 initiate response:', initiateRes);

      if (!initiateRes?.success || !initiateRes?.data) {
        showStatus({
          type: 'error',
          title: 'Payment Error',
          message: initiateRes?.message || 'Failed to initiate payment',
        });
        return;
      }
      initiated = true;

      let razorpayKeyId, razorpayOrderId;
      ({ razorpayKeyId, razorpayOrderId, amountPayable, purchaseId } =
        initiateRes.data);
      setPaidAmount(amountPayable);

      if (amountPayable > 0) {
        const options = {
          key: razorpayKeyId,
          amount: amountPayable * 100,
          currency: 'INR',
          name: 'Kapra Daily',
          description: `${voucherName || 'Voucher'} x${quantity}`,
          order_id: razorpayOrderId,
          prefill: {
            email: profile?.email || '',
            contact: profile?.phone || profile?.phoneNo || '',
          },
          theme: { color: '#5500ffff' },
        };

        logger.debug('[PAY:voucher] 3/5 razorpay checkout options:', options);
        sdkResponse = await RazorpayCheckout.open(options);
        logger.debug('[PAY:voucher] 3/5 razorpay sdk response:', sdkResponse);
      } else {
        logger.debug(
          '[PAY:voucher] 3/5 fully coin-funded, skipping razorpay + verify:',
          { purchaseId, amountPayable },
        );
        // Fully coin-funded - backend already deducted UD Coins on
        // initiate, so there's nothing to collect or verify.
        setSuccessVisible(true);
        onBalanceChange?.();
        return;
      }
    } catch (err) {
      logger.debug('[PAY:voucher] ✖ quote/initiate/sdk failed:', {
        code: err?.code,
        description: err?.description,
        message: err?.message,
        data: err?.data || err?.response?.data,
        error: err,
      });
      if (err?.code === 'PAYMENT_CANCELLED') {
        showStatus({
          type: 'error',
          title: 'Payment Not Completed',
          message:
            'You exited before completing the payment. Your UD Coins have not been deducted.',
        });
      } else {
        // Never surface raw SDK/backend error text to the user.
        showStatus({
          type: 'error',
          title: 'Payment Failed',
          message:
            'Something went wrong while processing your payment. Please try again.',
        });
      }
      if (initiated) onBalanceChange?.();
      return;
    }

    // Payment was confirmed by Razorpay. Any failure below is a
    // verification/network issue, not a failed payment - never tell the
    // user the payment failed once we reach this point.
    try {
      const verifyPayload = {
        purchaseId,
        razorpayOrderId: sdkResponse?.razorpay_order_id,
        razorpayPaymentId: sdkResponse?.razorpay_payment_id,
        razorpaySignature: sdkResponse?.razorpay_signature,
        amount: amountPayable * 100,
      };
      logger.debug('[PAY:voucher] 4/5 verify payload:', verifyPayload);
      const verifyRes = await verifyVoucherPurchaseApi(verifyPayload);
      logger.debug('[PAY:voucher] 4/5 verify response:', verifyRes);
      logger.warn('[useVoucherPayment] verify response:', verifyRes);

      // The purchase may already be settled by the backend (e.g. via a
      // webhook), in which case verify reports "already processed" /
      // "completed successfully" — treat that as a success.
      logger.debug('[PAY:voucher] 5/5 verify outcome:', {
        success: verifyRes?.success,
        alreadyCompleted: isPaymentAlreadyCompleted(verifyRes),
        message: verifyRes?.message,
      });

      if (verifyRes?.success || isPaymentAlreadyCompleted(verifyRes)) {
        setSuccessVisible(true);
      } else {
        showStatus({
          type: 'error',
          title: 'Payment Pending',
          message:
            verifyRes?.message ||
            'Payment verification is pending. Check My Vouchers for status.',
        });
      }
    } catch (err) {
      logger.debug('[PAY:voucher] 4/5 verify error:', {
        status: err?.status,
        message: err?.message,
        data: err?.data || err?.response?.data,
        alreadyCompleted: isPaymentAlreadyCompleted(err),
      });
      logger.error('[useVoucherPayment] verify error:', {
        status: err?.status,
        message: err?.message,
        data: err?.data || err?.response?.data,
      });
      if (isPaymentAlreadyCompleted(err)) {
        setSuccessVisible(true);
        return;
      }
      showStatus({
        type: 'error',
        title: 'Payment Pending',
        message:
          'Your payment was received but we could not confirm verification. Check My Vouchers for status.',
      });
    } finally {
      onBalanceChange?.();
    }
  };

  const resetPayment = () => {
    setSuccessVisible(false);
    setPaidAmount(0);
  };

  return { handleBuyNow, successVisible, paidAmount, resetPayment };
};
