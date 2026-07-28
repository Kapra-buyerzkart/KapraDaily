import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Geometry for the collapsing banner. The banner is an overlay pinned above the
// scroll view (not a child of it), so the same numbers drive the static layout
// in styles.js and the scroll interpolation in useCollapsibleBanner — keep them
// here so the two can't drift apart and leave the morph misaligned.

/* Header row */
export const HEADER_H_PADDING = 16;
export const HEADER_PADDING_BOTTOM = 12;
export const BACK_BUTTON_SIZE = 40;
export const BACK_BUTTON_GAP = 6;

/* Expanded banner */
export const BANNER_MARGIN = 20;
export const BANNER_WIDTH = SCREEN_WIDTH - BANNER_MARGIN * 2;
export const BANNER_HEIGHT = 210;
// Half the collapsed size, so the same radius reads as a rounded card when the
// banner is large and as a perfect circle once it has shrunk to AVATAR_SIZE.
export const BANNER_RADIUS = 20;

/* Collapsed banner: a circle the size of the back button, parked to its right */
export const AVATAR_SIZE = BACK_BUTTON_SIZE;
export const AVATAR_LEFT =
  HEADER_H_PADDING + BACK_BUTTON_SIZE + BACK_BUTTON_GAP;
export const AVATAR_GAP = 12;

// How far the user has to scroll before the banner is fully docked in the
// header. Matching the height delta keeps the shrink feeling 1:1 with the drag.
export const COLLAPSE_DISTANCE = BANNER_HEIGHT - AVATAR_SIZE;

// Overscroll range for the stretchy pull-down. Height grows 1:1 with the pull
// so the banner's bottom edge stays glued to the content below it.
export const STRETCH_DISTANCE = 160;
