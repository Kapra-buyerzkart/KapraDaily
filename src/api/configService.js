import { get } from './networkUtils';

export const getDeliveryModesApi = async () => {
    return get('deliverymodes');
};

export const getPaymentModesApi = async () => {
    return get('paymentmodes');
};
