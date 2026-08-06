import { hitSlopTo } from '@/styles/homeTheme';

export const DEFAULT_TOKEN_VALUE = '1';

export const NO_IMAGE_SOURCE = require('../../assets/images/udenDealNotfound.png');
export const UD_TOKEN_ICON = require('../../assets/icons/tokenud.png');

export const ACTION_H = 30;
export const ACTION_W = 62;
export const ACTION_H_SMALL = 28;
export const ACTION_W_SMALL = 54;

export const ACTION_HIT_SLOP = hitSlopTo(ACTION_H);
export const COUNTER_HIT_SLOP = { top: 10, bottom: 10, left: 6, right: 6 };
export const WISHLIST_HIT_SLOP = hitSlopTo(26);

export const NAME_LINES = 2;

export const IMAGE_FADE = { duration: 220 };

export const HEART_POP_SPRING = { damping: 8, stiffness: 300, mass: 0.5 };

export const ADD_SQUISH = { duration: 90 };
export const ADD_POP_SPRING = { damping: 9, stiffness: 420, mass: 0.6 };
export const ADD_SQUISH_SCALE = 0.88;
export const COUNTER_FADE = { duration: 160 };
