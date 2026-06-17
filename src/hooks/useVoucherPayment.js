import { useState } from 'react';
import { Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {
  getVoucherQuoteApi,
  initiateVoucherPurchaseApi,
  verifyVoucherPurchaseApi,
} from '../api/voucherService';

export const useVoucherPayment = () => {
  const [successVisible, setSuccessVisible] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  const handleBuyNow = async ({ voucherId, quantity, bCoins, voucherName }) => {
    try {
      const quoteRes = await getVoucherQuoteApi(voucherId, quantity, bCoins);
      console.log('getVoucherQuoteApi response:', quoteRes);

      const initiateRes = await initiateVoucherPurchaseApi({
        voucherid: voucherId,
        quantity,
        udcoinsrequested: bCoins,
      });

      if (!initiateRes?.success || !initiateRes?.data) {
        Alert.alert(
          'Payment Error',
          initiateRes?.message || 'Failed to initiate payment',
        );
        return;
      }

      const { razorpayKeyId, razorpayOrderId, amountPayable, purchaseId } =
        initiateRes.data;
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

      const sdkResponse = await RazorpayCheckout.open(options);

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
        Alert.alert(
          'Payment Pending',
          verifyRes?.message ||
            'Payment verification is pending. Check My Vouchers for status.',
        );
      }
    } catch (err) {
      if (err?.code !== 'PAYMENT_CANCELLED') {
        Alert.alert(
          'Payment Failed',
          err?.description || 'Something went wrong. Please try again.',
        );
      }
    }
  };

  const resetPayment = () => {
    setSuccessVisible(false);
    setPaidAmount(0);
  };

  return { handleBuyNow, successVisible, paidAmount, resetPayment };
};
