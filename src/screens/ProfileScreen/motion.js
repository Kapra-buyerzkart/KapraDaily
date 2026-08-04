import { FadeInDown } from 'react-native-reanimated';

// Every motion constant this screen uses, in one place, so the chip, the
// shortcut tiles, the rows and the entrance cannot each pick their own timing.

// The press curve, lifted from Home's search bar (`handleSearchPressIn` /
// `handleSearchPressOut`): a quick linear press *in* so the touch registers
// immediately, and a spring *out* so the release has some life to it.
export const PRESS_IN = { duration: 75 };
export const PRESS_OUT = { damping: 20, stiffness: 200 };

// The bar's rule fades in across these two scroll offsets — the same clamped
// opacity ramp Home uses for its sticky border, just over a shorter distance
// because there is no collapsing banner to travel through.
export const BORDER_FADE_RANGE = [4, 28];

// Where the bar's "Profile" hands over to the user's name, as fractions of the
// identity block's height (the block is fully behind the bar at 1.0). The two
// ranges don't overlap: a true cross-fade dips both texts to ~50% at the same
// instant, which looks like a glitch on a title this short.
export const TITLE_FADE_OUT = [0.25, 0.55];
export const NAME_FADE_IN = [0.6, 0.95];
export const NAME_TRAVEL = 6;

// Entrance stagger. The screen arrives on a navigation push that is already
// moving, so the blocks travel 12pt rather than Reanimated's default 25 and the
// whole sequence is over inside ~400ms; anything longer competes with the push
// and reads as the page loading slowly rather than assembling.
const ENTRANCE_TRAVEL = 12;
const ENTRANCE_DURATION = 260;
const STAGGER_STEP = 55;

export const entrance = index =>
  FadeInDown.duration(ENTRANCE_DURATION)
    .delay(index * STAGGER_STEP)
    .withInitialValues({
      opacity: 0,
      transform: [{ translateY: ENTRANCE_TRAVEL }],
    });
