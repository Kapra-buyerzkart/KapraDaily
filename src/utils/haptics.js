import { Platform, Vibration } from 'react-native';

const PATTERN = {
  selection: 8,
  impact: 12,
  success: 18,
};

let enabled = true;

export const setHapticsEnabled = next => {
  enabled = !!next;
};

const fire = duration => {
  if (!enabled) return;
  try {
    Vibration.vibrate(Platform.OS === 'android' ? duration : undefined);
  } catch (error) {
  }
};

export const selectionTick = () => fire(PATTERN.selection);

export const impactTick = () => fire(PATTERN.impact);

export const successTick = () => fire(PATTERN.success);

export default { selectionTick, impactTick, successTick, setHapticsEnabled };
