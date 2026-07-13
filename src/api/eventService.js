import { get } from './networkUtils';

const EVENT_PLACEHOLDER = require('../assets/images/movieTicket/voucher.png');
export const DUMMY_EVENTS = [
  {
    eventId: 'dummy-1',
    title: 'Vineeth Sreenivasan Concert',
    denomination: 394,
    brand: 'Sun, Jul 12',
    image: EVENT_PLACEHOLDER,
  },
  {
    eventId: 'dummy-2',
    title: 'Sunburn Arena Live',
    denomination: 799,
    brand: 'Sat, Jul 18',
    image: EVENT_PLACEHOLDER,
  },
  {
    eventId: 'dummy-3',
    title: 'Comedy Night Standup',
    denomination: 299,
    brand: 'Fri, Jul 24',
    image: EVENT_PLACEHOLDER,
  },
];

export const getEventDetailsListApi = async config => {
  return get('eventdetails/list', config);
};

export const getEventDetailsByIdApi = async (eventId, config) => {
  return get(`eventdetails/${eventId}`, config);
};
