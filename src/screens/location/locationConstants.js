export const DEFAULT_AREA = {
  areaName: 'Panampilly Nagar',
  pincodeAreaId: 262,
  pincodeId: 32,
  tags: null,
};

export const FAST_PATH_DELAY_MS = 1000;
export const AUTO_NAVIGATE_TIMEOUT_MS = 10000;
export const MIN_STEP_DURATION_MS = 550;

export const STEPS = {
  GPS: 'GPS',
  FINDING_STORES: 'FINDING_STORES',
  DELIVERY_TIME: 'DELIVERY_TIME',
  PREPARING: 'PREPARING',
  SUCCESS: 'SUCCESS',
};

export const STEP_ORDER = [
  STEPS.GPS,
  STEPS.FINDING_STORES,
  STEPS.DELIVERY_TIME,
  STEPS.PREPARING,
];

export const STEP_LABELS = {
  [STEPS.GPS]: 'Getting GPS Location',
  [STEPS.FINDING_STORES]: 'Finding nearby stores',
  [STEPS.DELIVERY_TIME]: 'Calculating delivery time',
  [STEPS.PREPARING]: 'Preparing your shopping experience',
};

// Marker + ripple animation values, straight from the design brief.
export const MARKER_FLOAT_SCALE_TO = 1.03;
export const MARKER_FLOAT_DURATION = 2200;

export const RIPPLE_OPACITY = 0.18;
export const RIPPLE_SCALE_FROM = 0.8;
export const RIPPLE_SCALE_TO = 2;
export const RIPPLE_DURATION = 2200;

// Shared Skia <Canvas> geometry — LocationMarker and RippleEffect both draw
// into the same canvas, centered on this box, so they must agree on it.
export const MARKER_CANVAS_SIZE = 240;
export const MARKER_CANVAS_CENTER = MARKER_CANVAS_SIZE / 2;
export const MARKER_PIN_HEIGHT = 92;
export const RIPPLE_BASE_RADIUS = 44;

export const TITLE_TEXT = 'Finding nearby stores';
export const TITLE_CHAR_STAGGER_MS = 28;
export const SUCCESS_TITLE_TEXT = 'Nearby stores found!';
export const SUBTITLE_TEXT =
  'Checking your location to show the fastest delivery and nearby stores.';

// Matches the existing Vibration.vibrate(10) convention (CardCarousel.js).
export const SUCCESS_VIBRATION_MS = 10;

// How long the success visual sequence (ring/dots/route) plays before the
// whole screen fades+scales out and navigation fires.
export const SUCCESS_HOLD_MS = 1500;
export const SUCCESS_EXIT_DURATION_MS = 380;
