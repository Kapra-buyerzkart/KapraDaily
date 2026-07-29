import { get, post } from './networkUtils';
import logger from '../utils/logger';

export const getEventDetailsListApi = async config => {
  return get('eventdetails/list', config);
};

//APi used in eventDetailsScreen

export const getEventDetailsByIdApi = async (eventId, config) => {
  return get(`eventdetails/${eventId}`, config);
};

export const getPopularListApi = async config => {
  return get('popular/list', config);
};

export const getPopularCategoriesApi = async config => {
  return get('popular/categories', config);
};

export const getEventBookingListApi = async (
  { pageNumber = 1, pageSize = 10 } = {},
  config,
) => {
  return get('eventbooking/list', {
    ...config,
    params: { PageNumber: pageNumber, PageSize: pageSize, ...config?.params },
  });
};

export const getEventBookingByIdApi = async (bookingId, config) => {
  return get(`eventbooking/booking/${bookingId}`, config);
};

export const checkTicketAvailabilityApi = async (
  ticketCategoryId,
  quantity,
  config,
) => {
  return post(
    'eventdetails/checkavailability',
    { ticketCategoryId, quantity },
    config,
  );
};

export const createEventBookingApi = async (
  { sessionId, bookingItems, bookingPlacedFrom },
  config,
) => {
  return post(
    'eventbooking/create',
    { sessionId, bookingItems, bookingPlacedFrom },
    config,
  );
};

export const initiateEventBookingPaymentApi = async (
  { bookingId, udCoinsRequested = 0 },
  config,
) => {
  const payload = {
    bookingId,
    udCoinsRequested,
    udcoinsrequested: udCoinsRequested,
  };

  const res = await post('eventbooking/initiate', payload, config);

  return res;
};

export const verifyEventBookingPaymentApi = async (
  { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature },
  config,
) => {
  return post(
    'eventbooking/verify',
    { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature },
    config,
  );
};

export const confirmEventPaymentApi = async (
  { bookingId, paymentGateway, transactionId, gatewayReference },
  config,
) => {
  return post(
    'eventpayment/confirm',
    { bookingId, paymentGateway, transactionId, gatewayReference },
    config,
  );
};

export const getEventTicketQrCodeApi = async (ticketId, config) => {
  return get(`eventticket/qrcode/${ticketId}`, config);
};

export const validateEventTicketApi = async (
  { qRCode, checkedInBy, deviceInfo, remarks },
  config,
) => {
  return post(
    'eventticket/validate',
    { qRCode, checkedInBy, deviceInfo, remarks },
    config,
  );
};

export const failEventPaymentApi = async (
  { bookingId, paymentGateway, transactionId, gatewayReference, remarks },
  config,
) => {
  return post(
    'eventpayment/failed',
    { bookingId, paymentGateway, transactionId, gatewayReference, remarks },
    config,
  );
};
