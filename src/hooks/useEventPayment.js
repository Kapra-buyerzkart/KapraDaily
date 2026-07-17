import { useContext, useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import {
  createEventBookingApi,
  initiateEventBookingPaymentApi,
  verifyEventBookingPaymentApi,
  confirmEventPaymentApi,
  failEventPaymentApi,
} from '../api/eventService';
import { AppContext } from '../context/appContext';
import logger from '../utils/logger';

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
        const bookingRes = await createEventBookingApi({
          sessionId,
          bookingItems,
          bookingPlacedFrom,
        });
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
          // Booking already exists server-side but payment wasn't captured -
          // record the failure so it isn't left dangling as unpaid.
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
        // Payment was denied by the user or declined for any other reason
        // before it could be captured - surface the failure modal instead of
        // a backend error toast.
        setFailureVisible(true);
        return { success: false, failed: true, bookingId };
      }

      // Razorpay has confirmed the payment at this point - any failure below is
      // a verification/network issue, never a failed payment.
      try {
        const verifyRes = await verifyEventBookingPaymentApi({
          bookingId,
          razorpayOrderId: sdkResponse.razorpay_order_id,
          razorpayPaymentId: sdkResponse.razorpay_payment_id,
          razorpaySignature: sdkResponse.razorpay_signature,
        });

        if (!verifyRes?.success) {
          Toast.show(
            verifyRes?.message ||
              'Payment verification is pending. Check My Bookings for status.',
            Toast.LONG,
          );
          return { success: false, pending: true, bookingId };
        }

        // Signature verified - tell the backend the payment is settled so it
        // can record the transaction and finalize the booking.
        await confirmEventPaymentApi({
          bookingId,
          paymentGateway: PAYMENT_GATEWAY,
          transactionId: sdkResponse.razorpay_payment_id,
          gatewayReference: sdkResponse.razorpay_order_id,
        });

        setSuccessVisible(true);
        return { success: true, bookingId };
      } catch (verifyError) {
        logger.error(
          '[useEventPayment] Payment verification failed:',
          verifyError?.message,
        );
        Toast.show(
          'Payment received. Verification pending - check My Bookings for status.',
          Toast.LONG,
        );
        return { success: false, pending: true, bookingId };
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
