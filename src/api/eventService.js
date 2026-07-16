import { get, post } from './networkUtils';

export const getEventDetailsListApi = async config => {
  return get('eventdetails/list', config);
};

export const getEventDetailsByIdApi = async (eventId, config) => {
  return get(`eventdetails/${eventId}`, config);
};

export const getPopularListApi = async config => {
  return get('popular/list', config);
};

export const getEventBookingListApi = async (
  { pageNumber = 1, pageSize = 10 } = {},
  config,
) => {
  return post(
    'eventbooking/list',
    { PageNumber: pageNumber, PageSize: pageSize },
    config,
  );
};

export const checkTicketAvailabilityApi = async (ticketCategoryId, quantity, config) => {
  return post('eventdetails/checkavailability', { ticketCategoryId, quantity }, config);
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
