import { FadeInDown } from 'react-native-reanimated';

// Motion shared across the account flow — Profile and Edit Profile are one
// journey, so a press on a chip in one has to feel like a press on a chip in
// the other. These constants lived in ProfileScreen/motion.js until Edit
// Profile needed them too; they moved up here rather than being copied, because
// two copies of a 75ms press curve is exactly how two screens start to drift.

// The press curve, lifted from Home's search bar (`handleSearchPressIn` /
// `handleSearchPressOut`): a quick linear press *in* so the touch registers
// immediately, and a spring *out* so the release has some life to it.
export const PRESS_IN = { duration: 75 };
export const PRESS_OUT = { damping: 20, stiffness: 200 };

// A sticky bar's rule fades in across these two scroll offsets — the same
// clamped opacity ramp Home uses for its sticky border, over a short distance
// because these pages have no collapsing banner to travel through.
export const BORDER_FADE_RANGE = [4, 28];

// The scroll fraction at which a bar painted the hero's colour has finished
// resolving to white. It lands before anything else the bar animates, so a
// title never sits on a half-mixed background.
export const BAR_SOLID_AT = 0.55;

// Entrance stagger. These screens arrive on a navigation push that is already
// moving, so the blocks travel 12pt rather than Reanimated's default 25 and the
// whole sequence is over inside ~450ms; anything longer competes with the push
// and reads as the page loading slowly rather than assembling.
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
