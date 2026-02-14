import { get } from './networkUtils';

/**
 * Fetches available delivery modes and their associated slots.
 * @returns {Promise<Object>} API response with delivery modes.
 */
export const getDeliveryModesApi = async () => {
    return get('deliverymodes');
};

/**
 * Fetches available payment modes.
 * @returns {Promise<Object>} API response with payment modes.
 */
export const getPaymentModesApi = async () => {
    return get('paymentmodes');
};
