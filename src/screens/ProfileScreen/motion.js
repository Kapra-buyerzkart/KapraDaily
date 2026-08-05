// The press curve, the sticky rule's fade, the bar's colour resolve and the
// entrance stagger are shared with Edit Profile, so they live in the account
// flow's motion module. Re-exported here so this screen's components keep
// reading their timings from one import.
export {
  PRESS_IN,
  PRESS_OUT,
  BORDER_FADE_RANGE,
  BAR_SOLID_AT,
  entrance,
} from '@/styles/motion';

// Where the bar's "Profile" hands over to the user's name, as fractions of the
// scroll offset at which the identity row's bottom edge reaches the bar (the
// name is fully behind the bar at 1.0). The two ranges don't overlap: a true
// cross-fade dips both texts to ~50% at the same instant, which looks like a
// glitch on a title this short.
//
// Only this screen swaps its title, so unlike everything above these stay here.
export const TITLE_FADE_OUT = [0.25, 0.55];
export const NAME_FADE_IN = [0.6, 0.95];
export const NAME_TRAVEL = 6;
