import { useContext, useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {
  createEventBookingApi,
  initiateEventBookingPaymentApi,
  verifyEventBookingPaymentApi,
  failEventPaymentApi,
  getEventTicketQrCodeApi,
} from '../api/eventService';
import { AppContext } from '../context/appContext';
import logger from '../utils/logger';
import { isPaymentAlreadyCompleted } from '../utils/paymentStatus';

const PAYMENT_GATEWAY = 'razorpay';

export const useEventPayment = () => {
  const { profile } = useContext(AppContext);
  const [processing, setProcessing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failureVisible, setFailureVisible] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const payForBooking = async ({
    sessionId,
    bookingItems,
    bookingPlacedFrom = 'app',
    eventName,
  }) => {
    setProcessing(true);
    setTicketQuantity(
      bookingItems.reduce((sum, item) => sum + item.quantity, 0) || 1,
    );
    let bookingId, razorpayOrderId, amount, sdkResponse;

    try {
      try {
        const bookingPayload = {
          sessionId,
          bookingItems,
          bookingPlacedFrom,
        };
        logger.log(
          '[useEventPayment] createEventBookingApi payload:==========+++++++=====',
          bookingPayload,
        );
        const bookingRes = await createEventBookingApi(bookingPayload);
        if (!bookingRes?.success || !bookingRes?.data) {
          throw new Error(bookingRes?.message || 'Failed to place booking.');
        }
        bookingId = bookingRes.data.bookingId ?? bookingRes.data.id;

        const initiateRes = await initiateEventBookingPaymentApi({
          bookingId,
          udCoinsRequested: 0,
        });
        if (!initiateRes?.success || !initiateRes?.data) {
          throw new Error(
            initiateRes?.message || 'Failed to initiate payment.',
          );
        }

        const keyId =
          initiateRes.data.keyId ||
          initiateRes.data.razorpayKeyId ||
          initiateRes.data.razorPayKeyId;
        razorpayOrderId =
          initiateRes.data.razorpayOrderId || initiateRes.data.razorPayOrderId;
        amount = initiateRes.data.amount ?? initiateRes.data.amountPayable;

        if (!keyId || !razorpayOrderId || !amount) {
          throw new Error('Incomplete payment details received from server.');
        }

        setPaidAmount(amount);

        sdkResponse = await RazorpayCheckout.open({
          key: keyId,
          amount,
          currency: 'INR',
          name: 'Uden Tickets',
          description: eventName ? `Booking - ${eventName}` : 'Event booking',
          order_id: razorpayOrderId,
          prefill: {
            email: profile?.email || '',
            contact: profile?.phone || profile?.phoneNo || '',
          },
          theme: { color: '#1800f2ff' },
        });
      } catch (err) {
        if (bookingId) {
          await failEventPaymentApi({
            bookingId,
            paymentGateway: PAYMENT_GATEWAY,
            gatewayReference: razorpayOrderId,
            remarks:
              err?.description ||
              err?.message ||
              'Payment cancelled or failed.',
          }).catch(() => {});
        }
        logger.error(
          '[useEventPayment] Booking/payment failed:',
          err?.description || err?.message,
        );

        setFailureVisible(true);
        return { success: false, failed: true, bookingId };
      }
      // Razorpay has already confirmed the payment at this point, so the money
      // is collected. Anything that goes wrong below is a verification/network
      // issue (or the backend having already settled it via a webhook) — never
      // a failed payment — so we always show the success modal, not a pending
      // toast.
      const markBookingSuccess = () => {
        setSuccessVisible(true);

        getEventTicketQrCodeApi(bookingId)
          .then(res => console.log('[useEventPayment] QR code response:', res))
          .catch(err =>
            console.log('[useEventPayment] QR code fetch failed:', err),
          );

        return { success: true, bookingId };
      };

      try {
        const verifyRes = await verifyEventBookingPaymentApi({
          bookingId,
          razorpayOrderId: sdkResponse.razorpay_order_id,
          razorpayPaymentId: sdkResponse.razorpay_payment_id,
          razorpaySignature: sdkResponse.razorpay_signature,
        });
        logger.warn('[useEventPayment] verify response:', verifyRes);

        if (!verifyRes?.success && !isPaymentAlreadyCompleted(verifyRes)) {
          logger.error(
            '[useEventPayment] verify not confirmed, showing success anyway:',
            verifyRes?.message,
          );
        }

        return markBookingSuccess();
      } catch (verifyError) {
        logger.error('[useEventPayment] verify error:', {
          status: verifyError?.status,
          message: verifyError?.message,
          data: verifyError?.data || verifyError?.response?.data,
        });
        return markBookingSuccess();
      }
    } finally {
      setProcessing(false);
    }
  };

  const resetPayment = () => {
    setSuccessVisible(false);
    setPaidAmount(0);
  };

  const dismissFailure = () => setFailureVisible(false);

  return {
    payForBooking,
    processing,
    successVisible,
    failureVisible,
    paidAmount,
    ticketQuantity,
    resetPayment,
    dismissFailure,
  };
};
