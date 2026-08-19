import { get } from '../networkUtils';

export const getDeliveryModesApi = async (): Promise<any> => {
    return get('deliverymodes');
};

export const getPaymentModesApi = async (): Promise<any> => {
    return get('paymentmodes');
};
