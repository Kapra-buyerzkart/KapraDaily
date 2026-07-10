import COLORS from '../../styles/colors';
import { FONTS } from '../../styles/typography';

// Scoped brand palette for the location onboarding experience. Kept local
// rather than merged into the global COLORS since a few brief-specified
// hexes (textPrimary, success, accentLight) deliberately differ from the
// app-wide values and shouldn't bleed into unrelated screens.
export const LOCATION_COLORS = {
  primary: COLORS.primary, // #F25000
  background: COLORS.white, // #FFFFFF
  secondaryBackground: COLORS.gray50, // #FAFAFA
  accentLight: '#FFF4EE',
  border: COLORS.gray200, // #EEEEEE
  textPrimary: '#111111',
  textSecondary: '#707070',
  success: '#2FB344',
};

export const RADII = {
  card: 24,
  sheet: 32,
};

export const LOCATION_FONTS = FONTS.gilroy;
