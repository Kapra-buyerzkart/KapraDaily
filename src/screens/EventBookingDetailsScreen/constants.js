import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HEADER_H_PADDING = 16;
export const HEADER_PADDING_BOTTOM = 12;
export const BACK_BUTTON_SIZE = 40;
export const BACK_BUTTON_GAP = 6;

export const BANNER_MARGIN = 20;
export const BANNER_WIDTH = SCREEN_WIDTH - BANNER_MARGIN * 2;
export const BANNER_HEIGHT = 210;
export const BANNER_RADIUS = 20;

export const AVATAR_SIZE = BACK_BUTTON_SIZE;
export const AVATAR_LEFT =
  HEADER_H_PADDING + BACK_BUTTON_SIZE + BACK_BUTTON_GAP;
export const AVATAR_GAP = 12;

export const COLLAPSE_DISTANCE = BANNER_HEIGHT - AVATAR_SIZE;

export const STRETCH_DISTANCE = 160;
