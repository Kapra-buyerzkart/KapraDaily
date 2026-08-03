import { Platform, Vibration } from 'react-native';

// Tactile feedback without adding a dependency.
//
// react-native-haptic-feedback would give us the real Taptic Engine patterns,
// but the brief was explicit about not pulling in libraries we don't need, and
// RN's built-in Vibration covers the one thing these call sites actually want:
// a short confirmation that a tap registered.
//
// The durations are deliberately at the bottom of the perceptible range. On
// Android they map to the vibrator directly; on iOS `Vibration.vibrate` ignores
// the duration argument and fires the standard short buzz, which is close
// enough to `impactLight` for add-to-cart confirmation and is why we don't try
// to encode distinct strengths per platform.

const PATTERN = {
  selection: 8,
  impact: 12,
  success: 18,
};

// A single switch so haptics can be silenced app-wide (a settings toggle, or a
// test run) without touching every call site.
let enabled = true;

export const setHapticsEnabled = next => {
  enabled = !!next;
};

const fire = duration => {
  if (!enabled) return;
  try {
    Vibration.vibrate(Platform.OS === 'android' ? duration : undefined);
  } catch (error) {
    // A device with no vibrator, or a denied VIBRATE permission, must never
    // take down the interaction that triggered it.
  }
};

// Light tick — changing a selection (category chip, filter, quantity step).
export const selectionTick = () => fire(PATTERN.selection);

// Slightly firmer — a committing action (add to cart, wishlist on).
export const impactTick = () => fire(PATTERN.impact);

// Confirmation — an action that completed and changed state meaningfully.
export const successTick = () => fire(PATTERN.success);

export default { selectionTick, impactTick, successTick, setHapticsEnabled };
