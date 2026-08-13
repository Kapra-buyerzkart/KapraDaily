import { StyleSheet, useWindowDimensions } from 'react-native';
import { FONTS } from '../../../styles/typography';
import {
  INK,
  RADIUS,
  CATEGORY_WELL,
  GUTTER_PCT,
  SPACE,
  TYPE,
} from '@/styles/homeTheme';

export const COLUMNS = 4;

const cache = new Map();

const buildStyles = width => {
  const gutter = Math.round((width * GUTTER_PCT) / 100);
  const contentWidth = width - gutter * 2;

  const tileGap = Math.round(width * 0.024);
  const tile = Math.floor((contentWidth - tileGap * (COLUMNS - 1)) / COLUMNS);

  const image = Math.round(tile * 0.92);

  const sheet = StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: gutter,
      columnGap: tileGap,
    },
    item: {
      width: tile,
      alignItems: 'center',
      marginBottom: SPACE.base,
    },
    categoryItemContainer: {
      width: tile,
      height: tile,
      borderRadius: RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: CATEGORY_WELL,
      overflow: 'hidden',
    },
    image: {
      width: image,
      height: image,
    },
    label: {
      ...TYPE.micro,
      marginTop: SPACE.sm,
      height: TYPE.micro.lineHeight * 2,
      includeFontPadding: false,
      textAlignVertical: 'center',
      textAlign: 'center',
      color: INK.base,
      fontFamily: FONTS.gilroy.semiBold,
    },
  });

  sheet.metrics = { gutter, tile, tileGap, stride: tile + tileGap, width };

  return sheet;
};

const useCategoryTileStyles = () => {
  const { width } = useWindowDimensions();
  let styles = cache.get(width);
  if (!styles) {
    styles = buildStyles(width);
    cache.set(width, styles);
  }
  return styles;
};

export default useCategoryTileStyles;
