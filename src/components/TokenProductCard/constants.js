import { hitSlopTo } from '@/styles/homeTheme';

export const DEFAULT_TOKEN_VALUE = '1';

export const NO_IMAGE_SOURCE = require('../../assets/images/udenDealNotfound.png');
export const UD_TOKEN_ICON = 'ticket-confirmation-outline';
export const UD_TOKEN_ICON_SIZE = 12;
export const UD_TOKEN_ICON_SIZE_SMALL = 10;

export const ADD_SIZE = 34;
export const ADD_SIZE_SMALL = 30;
export const ADD_OFFSET = 1.25;
export const DOCK_OVERHANG = ADD_SIZE / 3;
export const DOCK_OVERHANG_SMALL = ADD_SIZE_SMALL / 3;
export const DOCK_WIDTH = '66%';

export const HEART_SIZE = 26;

export const ADD_HIT_SLOP = hitSlopTo(ADD_SIZE);
export const COUNTER_HIT_SLOP = { top: 10, bottom: 10, left: 6, right: 6 };
export const WISHLIST_HIT_SLOP = hitSlopTo(HEART_SIZE);

export const NAME_LINES = 2;

export const IMAGE_FADE = { duration: 220 };
export const IMAGE_LOAD_TIMEOUT = 6000;

export const HEART_POP_SPRING = { damping: 8, stiffness: 300, mass: 0.5 };

export const ADD_SQUISH = { duration: 90 };
export const ADD_POP_SPRING = { damping: 9, stiffness: 420, mass: 0.6 };
export const ADD_SQUISH_SCALE = 0.88;
export const COUNTER_FADE = { duration: 160 };
