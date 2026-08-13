import { FadeOut, LinearTransition } from 'react-native-reanimated';

export { BORDER_FADE_RANGE, entrance } from '@/styles/motion';

export const CARD_EXIT = FadeOut.duration(160);

export const CARD_LAYOUT = LinearTransition.springify()
  .damping(20)
  .stiffness(180);
