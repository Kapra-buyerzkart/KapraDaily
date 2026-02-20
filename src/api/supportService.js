import { get, post } from './networkUtils';

/**
 * Get all support tickets for the user
 */
export const getSupportTicketsApi = async () => {
    return get('supportticket/list');
};

/**
 * Get details for a specific support ticket
 * @param {number|string} id - The ticket ID
 */
export const getTicketDetailsApi = async (id) => {
    return get(`supportticket/${id}`);
};

/**
 * Create a support ticket
 * @param {Object} payload - { title, message, priority, orderId }
 */
export const createSupportTicketApi = async (payload) => {
    return post('supportticket/create', payload);
};
