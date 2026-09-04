import { FadeInDown } from 'react-native-reanimated';

export const PRESS_IN = { duration: 75 };
export const PRESS_OUT = { damping: 20, stiffness: 200 };

export const BORDER_FADE_RANGE = [4, 28];
export const BAR_SOLID_AT = 0.55;

export const TITLE_FADE_OUT = [0.25, 0.55];
export const NAME_FADE_IN = [0.6, 0.95];
export const NAME_TRAVEL = 6;

export const BALANCE_COUNT_UP = 900;

const ENTRANCE_TRAVEL = 12;
const ENTRANCE_DURATION = 260;
const STAGGER_STEP = 45;

export const entrance = (index: number) =>
  FadeInDown.duration(ENTRANCE_DURATION)
    .delay(index * STAGGER_STEP)
    .withInitialValues({
      opacity: 0,
      transform: [{ translateY: ENTRANCE_TRAVEL }],
    });
