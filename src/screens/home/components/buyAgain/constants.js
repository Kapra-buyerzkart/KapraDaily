import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Mirrors TokenProductCard's cardContainer width and horizontal margin so the
// rail scrolls to the same rhythm as every other rail on the home screen.
export const CARD_W = wp('35%');
export const CARD_MARGIN = wp('1%');
export const CARD_STRIDE = CARD_W + CARD_MARGIN * 2;
