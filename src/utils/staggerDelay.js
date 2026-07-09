// Caps the stagger at MAX_STAGGER_INDEX so items that mount deep into a long
// list (e.g. scrolled into view, or appended by "load more") still reveal
// promptly instead of waiting seconds for their turn.
const MAX_STAGGER_INDEX = 8;
const STAGGER_STEP_MS = 40;

export const getStaggerDelay = index =>
  Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS;
