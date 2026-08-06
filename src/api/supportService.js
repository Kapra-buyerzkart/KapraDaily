import { get, post } from './networkUtils';

export const getSupportTicketsApi = async () => {
    return get('supportticket/list');
};

export const getTicketDetailsApi = async (id) => {
    return get(`supportticket/${id}`);
};

export const createSupportTicketApi = async (payload) => {
    return post('supportticket/create', payload);
};
