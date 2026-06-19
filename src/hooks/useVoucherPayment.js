import { useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {
  getVoucherQuoteApi,
  initiateVoucherPurchaseApi,
  verifyVoucherPurchaseApi,
} from '../api/voucherService';
import { useCart } from '../context/CartContext';

export const useVoucherPayment = () => {
  const { showStatus } = useCart();
  const [successVisible, setSuccessVisible] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  const handleBuyNow = async ({ voucherId, quantity, bCoins, voucherName }) => {
    let purchaseId;
    let amountPayable;
    let sdkResponse;

    try {
      const quoteRes = await getVoucherQuoteApi(voucherId, quantity, bCoins);
      console.log('getVoucherQuoteApi response:', quoteRes);

      const initiateRes = await initiateVoucherPurchaseApi({
        voucherid: voucherId,
        quantity,
        udcoinsrequested: bCoins,
      });

      if (!initiateRes?.success || !initiateRes?.data) {
        showStatus({
          type: 'error',
          title: 'Payment Error',
          message: initiateRes?.message || 'Failed to initiate payment',
        });
        return;
      }

      let razorpayKeyId, razorpayOrderId;
      ({ razorpayKeyId, razorpayOrderId, amountPayable, purchaseId } =
        initiateRes.data);
      setPaidAmount(amountPayable);

      const options = {
        key: razorpayKeyId,
        amount: amountPayable * 100,
        currency: 'INR',
        name: 'Kapra Daily',
        description: `${voucherName || 'Voucher'} x${quantity}`,
        order_id: razorpayOrderId,
        theme: { color: '#e07f2bff' },
      };

      sdkResponse = await RazorpayCheckout.open(options);
    } catch (err) {
      if (err?.code === 'PAYMENT_CANCELLED') {
        showStatus({
          type: 'error',
          title: 'Payment Not Completed',
          message:
            'You exited before completing the payment. Your UD Coins have not been deducted.',
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Payment Failed',
          message: err?.description || 'Something went wrong. Please try again.',
        });
      }
      return;
    }

    // Razorpay reported success here, so the payment itself went through.
    // Any failure below is a verification/network issue, not a failed
    // payment - never tell the user the payment failed once we reach this point.
    try {
      const verifyRes = await verifyVoucherPurchaseApi({
        purchaseId,
        razorpayOrderId: sdkResponse.razorpay_order_id,
        razorpayPaymentId: sdkResponse.razorpay_payment_id,
        razorpaySignature: sdkResponse.razorpay_signature,
        amount: amountPayable * 100,
      });

      if (verifyRes?.success) {
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
      showStatus({
        type: 'error',
        title: 'Payment Pending',
        message:
          'Your payment was received but we could not confirm verification. Check My Vouchers for status.',
      });
    }
  };

  const resetPayment = () => {
    setSuccessVisible(false);
    setPaidAmount(0);
  };

  return { handleBuyNow, successVisible, paidAmount, resetPayment };
};
