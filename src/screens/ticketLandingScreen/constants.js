import { Dimensions } from 'react-native';
import { hp } from '../../utils/responsive';
import { getArcApexOffset } from './backdropArc';

export const EVENTS_ICON = require('../../assets/events/Group 1000004805.png');
export const POPULAR_ICON = require('../../assets/events/Group 1000004801.png');
export const SPORTS_ICON = require('../../assets/events/Group 1000004803.png');
export const BILLS_ICON = require('../../assets/events/Group 1000004804.png');

export const STICKY_INDICES = [1];

export const LIST_ITEM_TYPES = {
  HEADER: 'header',
  TABS: 'tabs',
  EVENT: 'event',
  EVENTS_LOADING: 'events-loading',
  EVENTS_EMPTY: 'events-empty',
  TAB_CONTENT: 'tab-content',
};

export const EMPTY_COPY = {
  events: {
    title: 'No events found',
    subtitle:
      'There are no events available right now. Please check back later.',
  },
  popular: {
    title: 'No vouchers available',
    subtitle: 'Check back soon for exciting offers and events.',
  },
  popularEvents: {
    title: 'No data available',
    subtitle: 'Check back soon for popular events.',
  },
  sports: {
    title: 'Sports',
    subtitle: 'Book tickets for your favourite sports, coming soon.',
  },
  bills: {
    title: 'Bills & Recharge',
    subtitle: 'Pay bills and recharge with UD Coins, coming soon.',
  },
  holidays: {
    title: 'Holidays',
    subtitle: 'Plan your next getaway with UD Coins, coming soon.',
  },
  travel: {
    title: 'Travel',
    subtitle: 'Book travel with UD Coins, coming soon.',
  },
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export { SCREEN_WIDTH, SCREEN_HEIGHT };

export const STACK_VISIBLE = 3;
export const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
export const STACK_SCALE_STEP = 0.06;
export const STACK_Y_STEP = 16;
export const CARD_WIDTH = SCREEN_WIDTH * 0.72;
export const CARD_HEIGHT = CARD_WIDTH * 0.62;

export const ARROW_PILL_HEIGHT = 48;
export const ARROW_MIN_GAP = 16;
export const UNMEASURED_ARROW_GAP = hp(11);
export const CLAIM_GAP = 28;

// Used for the single frame before the backdrop has been measured; the same
// cover maths as the real thing, just against the window instead of the
// measured box.
export const FALLBACK_ARC_APEX_Y =
  getArcApexOffset(SCREEN_WIDTH, SCREEN_HEIGHT) ?? hp(65);
