import { Dimensions } from 'react-native';
import { Fonts } from '../../theme/fonts';

const DESIGN_WIDTH = 440;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const s = (n: number) => (n / DESIGN_WIDTH) * SCREEN_WIDTH;

const TYPE_RATIO = Math.min(Math.max(SCREEN_WIDTH / DESIGN_WIDTH, 0.92), 1.1);
export const fs = (n: number) => Math.round(n * TYPE_RATIO * 10) / 10;

export const CART_COLORS = {
  background: '#FFFFFF',
  canvas: '#FAFAFA',
  card: '#FFFFFF',
  cardBorder: '#ECEAE5',
  cardBorderSubtle: '#F0ECE6',

  // Kapra Emeralds & Gold
  darkEmerald: '#0C382E',
  deepEmerald: '#082B22',
  emeraldTint: '#E8F2EE',
  gold: '#B68D40',
  goldMetallic: '#C5A869',

  // Banner & Promo Tints
  bannerBg: '#FAF5EE',
  bannerBorder: '#EFE7DB',
  promoStripBg: '#FEF8EA',
  promoStripBorder: '#FCE8B2',
  promoStripText: '#78350F',

  // Content
  textDark: '#1A1A1A',
  textMuted: '#686868',
  textFaint: '#9E9E9E',
  strike: '#8E8E8E',

  // Highlights & Status
  green: '#0E8A44',
  greenBg: '#E9F8EE',
  orange: '#F25000',
  orangeTint: '#FFF4EC',
  heartRed: '#C45A5A',

  // Structure
  divider: '#F0ECE7',
  iconCircle: '#F5F5F3',
  white: '#FFFFFF',
  black: '#000000',
};

export const CART_FONTS = {
  serifRegular: Fonts.cormorantGaramond.regular,
  serifMedium: Fonts.cormorantGaramond.medium,
  serifSemiBold: Fonts.cormorantGaramond.semiBold,
  serifBold: Fonts.cormorantGaramond.bold,
  sansRegular: Fonts.lexend?.regular || Fonts.gilroyRegular,
  sansMedium: Fonts.lexend?.medium || Fonts.gilroyMedium,
  sansBold: Fonts.lexend?.bold || Fonts.gilroyBold,
};

export const CART_PADDING = s(16);
