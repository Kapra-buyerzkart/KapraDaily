import { FadeInDown } from 'react-native-reanimated';

export const PRESS_IN = { duration: 75 };
export const PRESS_OUT = { damping: 20, stiffness: 200 };

export const BORDER_FADE_RANGE = [4, 28];

export const BAR_SOLID_AT = 0.55;

const ENTRANCE_TRAVEL = 12;
const ENTRANCE_DURATION = 260;
const STAGGER_STEP = 45;

export const entrance = index =>
  FadeInDown.duration(ENTRANCE_DURATION)
    .delay(index * STAGGER_STEP)
    .withInitialValues({
      opacity: 0,
      transform: [{ translateY: ENTRANCE_TRAVEL }],
    });
