import { WINDOW_HEIGHT, WINDOW_WIDTH } from './theme';

export const SEARCH_ICON = require('../../assets/icons/search.png');
export const CLOSE_ICON = require('../../assets/icons/close.png');
export const ADDRESS_ICON = require('../../assets/icons/address.png');
export const TICK_ICON = require('../../assets/icons/tick.png');
export const BACKGROUND_IMAGE = require('../../assets/images/location-background.png');

export const BEACON_SIZE = Math.min(WINDOW_WIDTH * 0.62, WINDOW_HEIGHT * 0.32);
export const BEACON_CORE_SIZE = BEACON_SIZE * 0.42;
export const BEACON_ICON_NAME = 'location-sharp';
export const BEACON_ICON_SIZE = Math.round(BEACON_CORE_SIZE * 0.52);
export const ADDRESS_PIN_SIZE = Math.round(WINDOW_WIDTH * 0.16);

export const RING_PERIOD = 2400;
export const RING_DELAYS = [0, RING_PERIOD / 3, (RING_PERIOD / 3) * 2];

export const CORE_BOB_DURATION = 1400;
export const CORE_BOB_DISTANCE = 6;

export const LOCATING_TITLE = 'Finding your location';
export const LOCATING_SUBTITLE = 'Hang tight, we are pinpointing your area';

export const ICON_BUTTON_SIZE = WINDOW_HEIGHT * 0.05;
export const ICON_GLYPH_SIZE = WINDOW_WIDTH * 0.05;
