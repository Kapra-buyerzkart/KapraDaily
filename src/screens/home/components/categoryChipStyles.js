import { Dimensions, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../../styles/typography';
import { INK, RADIUS, SURFACE, GUTTER } from '../homeTheme';

// The category grid's tile + label cell.
//
// The column math is derived rather than hand-tuned, and derived in *dp*, not
// in percentages. wp() rounds each percentage to the nearest whole pixel, so on
// Android's fractional densities (2.75, 3.5, …) four rounded cells could add up
// to slightly more than the rounded content box — enough for flexWrap to push
// the fourth tile onto its own row and break the grid into 3 + 1. Measuring the
// content box once and flooring the column width guarantees COLUMNS cells
// always fit, on every density.
export const COLUMNS = 4;
const CONTENT_WIDTH = Dimensions.get('window').width - GUTTER * 2;
export const CELL = Math.floor(CONTENT_WIDTH / COLUMNS);

const TILE = Math.round(CELL * 0.8);
const IMAGE = Math.round(TILE * 0.76);
const LABEL_FONT = wp('2.9%');
const LABEL_LINE = Math.round(wp('3.7%'));

const categoryChipStyles = StyleSheet.create({
  item: {
    width: CELL,
    alignItems: 'center',
    marginBottom: hp('1.8%'),
  },
  categoryItemContainer: {
    width: TILE,
    height: TILE,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.sunken,
    overflow: 'hidden',
  },
  image: {
    width: IMAGE,
    height: IMAGE,
  },
  label: {
    marginTop: hp('0.9%'),
    fontSize: LABEL_FONT,
    lineHeight: LABEL_LINE,
    // Reserve both lines whether or not the name wraps. Without this a row
    // holding one two-line name sat taller than its neighbours, so the next
    // row started at a ragged offset and the grid lost its baseline.
    height: LABEL_LINE * 2,
    // Android pads text with the font's own ascent/descent on top of
    // lineHeight, which overflows the fixed two-line box and clips the second
    // line. Dropping that padding makes the box measure the same as on iOS.
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: INK.base,
    fontFamily: FONTS.gilroy.semiBold,
  },
});

export default categoryChipStyles;
