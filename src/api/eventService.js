import { get } from './networkUtils';

export const getEventDetailsListApi = async config => {
  return get('eventdetails/list', config);
};

export const getEventDetailsByIdApi = async (eventId, config) => {
  return get(`eventdetails/${eventId}`, config);
};
