const MAX_STAGGER_INDEX = 8;
const STAGGER_STEP_MS = 40;

export const getStaggerDelay = index =>
  Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS;
