import { useCallback, useContext, useMemo, useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {
  createEventBookingApi,
  initiateEventBookingPaymentApi,
  verifyEventBookingPaymentApi,
  confirmEventPaymentApi,
  failEventPaymentApi,
  getEventTicketQrCodeApi,
} from '../api/eventService';
import { AppContext } from '../context/appContext';
import { isPaymentAlreadyCompleted } from '../utils/paymentStatus';

const PAYMENT_GATEWAY = 'razorpay';
const COIN_PAYMENT_REFERENCE = 'udcoin';

export const useEventPayment = () => {
  const { profile } = useContext(AppContext);
  const [processing, setProcessing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failureVisible, setFailureVisible] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [coinsUsed, setCoinsUsed] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const payForBooking = useCallback(async ({
    sessionId,
    bookingItems,
    bookingPlacedFrom = 'app',
    eventName,
    udCoinsRequested = 0,
  }) => {
    setProcessing(true);
    setTicketQuantity(
      bookingItems.reduce((sum, item) => sum + item.quantity, 0) || 1,
    );
    let bookingId, razorpayOrderId, amount, sdkResponse;
    let paymentSkipped = false;

    try {
      try {
        const bookingPayload = {
          sessionId,
          bookingItems,
          bookingPlacedFrom,
        };
        console.log('[useEventPayment] create booking payload:', bookingPayload);
        const bookingRes = await createEventBookingApi(bookingPayload);
        if (!bookingRes?.success || !bookingRes?.data) {
          throw new Error(bookingRes?.message || 'Failed to place booking.');
        }
        bookingId = bookingRes.data.bookingId ?? bookingRes.data.id;

        const initiateRes = await initiateEventBookingPaymentApi({
          bookingId,
          udCoinsRequested,
        });
        console.log('[useEventPayment] initiate response:', initiateRes);
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

        setCoinsUsed(
          initiateRes.data.udCoinsUsed ??
            initiateRes.data.coinsUsed ??
            initiateRes.data.udCoinsRedeemed ??
            udCoinsRequested,
        );

        paymentSkipped =
          initiateRes.data.paymentRequired === false ||
          initiateRes.status === 'BOOKING_COMPLETE' ||
          amount === 0;

        if (paymentSkipped) {
          setPaidAmount(0);
        } else {
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
        }
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
        console.error(
          '[useEventPayment] Booking/payment failed:',
          err?.description || err?.message,
        );

        setFailureVisible(true);
        return { success: false, failed: true, bookingId };
      }
      const markBookingSuccess = ({ fetchQrCode = true } = {}) => {
        setSuccessVisible(true);

        if (fetchQrCode) {
          getEventTicketQrCodeApi(bookingId)
            .then(res => console.log('[useEventPayment] QR code response:', res))
            .catch(err =>
              console.error('[useEventPayment] QR code fetch failed:', err),
            );
        }

        return { success: true, bookingId };
      };

      try {
        let settleRes;

        if (paymentSkipped) {
          const confirmPayload = {
            bookingId,
            paymentGateway: PAYMENT_GATEWAY,
            transactionId: COIN_PAYMENT_REFERENCE,
            gatewayReference: COIN_PAYMENT_REFERENCE,
          };
          console.log('[useEventPayment] confirm payload:', confirmPayload);

          settleRes = await confirmEventPaymentApi(confirmPayload);
          console.log('[useEventPayment] confirm response:', settleRes);
        } else {
          settleRes = await verifyEventBookingPaymentApi({
            bookingId,
            razorpayOrderId: sdkResponse.razorpay_order_id,
            razorpayPaymentId: sdkResponse.razorpay_payment_id,
            razorpaySignature: sdkResponse.razorpay_signature,
          });
        }

        console.warn('[useEventPayment] settle response:', settleRes);

        const settled =
          settleRes?.success || isPaymentAlreadyCompleted(settleRes);

        if (!settled) {
          console.error(
            '[useEventPayment] settle not confirmed, showing success anyway:',
            settleRes?.message,
          );
        }

        return markBookingSuccess({
          fetchQrCode: paymentSkipped ? settled : true,
        });
      } catch (settleError) {
        console.error('[useEventPayment] settle error:', {
          status: settleError?.status,
          message: settleError?.message,
          data: settleError?.data || settleError?.response?.data,
        });
        return markBookingSuccess({
          fetchQrCode: paymentSkipped
            ? isPaymentAlreadyCompleted(settleError)
            : true,
        });
      }
    } finally {
      setProcessing(false);
    }
  }, [profile?.email, profile?.phone, profile?.phoneNo]);

  const resetPayment = useCallback(() => {
    setSuccessVisible(false);
    setPaidAmount(0);
    setCoinsUsed(0);
  }, []);

  const dismissFailure = useCallback(() => setFailureVisible(false), []);

  return useMemo(
    () => ({
      payForBooking,
      processing,
      successVisible,
      failureVisible,
      paidAmount,
      coinsUsed,
      ticketQuantity,
      resetPayment,
      dismissFailure,
    }),
    [
      payForBooking,
      processing,
      successVisible,
      failureVisible,
      paidAmount,
      coinsUsed,
      ticketQuantity,
      resetPayment,
      dismissFailure,
    ],
  );
};
