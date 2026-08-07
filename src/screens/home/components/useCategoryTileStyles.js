import { StyleSheet, useWindowDimensions } from 'react-native';
import { FONTS } from '../../../styles/typography';
import {
  ACCENT,
  INK,
  RADIUS,
  CATEGORY_WELL,
  GUTTER_PCT,
  SPACE,
  SURFACE,
  TYPE,
} from '@/styles/homeTheme';

export const COLUMNS = 4;

export const TAB_RING = 2;

export const TAB_WELL_IDLE = CATEGORY_WELL;
export const TAB_WELL_ACTIVE = SURFACE.tint;
export const TAB_RING_IDLE = 'rgba(242,80,0,0)';
export const TAB_RING_ACTIVE = ACCENT.primary;
export const TAB_LABEL_IDLE = INK.base;
export const TAB_LABEL_ACTIVE = ACCENT.primary;

const cache = new Map();

const buildStyles = width => {
  const gutter = Math.round((width * GUTTER_PCT) / 100);
  const contentWidth = width - gutter * 2;
  const cell = Math.floor(contentWidth / COLUMNS);

  const tileGap = Math.round(width * 0.024);
  const tile = cell - tileGap;

  const image = Math.round(tile * 0.92);

  const tabImage = image - TAB_RING * 2;

  const sheet = StyleSheet.create({
    item: {
      width: cell,
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
    tabRow: {
      flexDirection: 'row',
      paddingHorizontal: gutter,
      paddingBottom: SPACE.md,
      gap: tileGap,
    },
    tabItem: {
      width: tile,
      alignItems: 'center',
    },
    tabWell: {
      width: tile,
      height: tile,
      borderRadius: RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderWidth: TAB_RING,
      overflow: 'hidden',
    },
    tabImage: {
      width: tabImage,
      height: tabImage,
    },
    tabLabel: {
      ...TYPE.micro,
      marginTop: SPACE.sm,
      height: TYPE.micro.lineHeight * 2,
      includeFontPadding: false,
      textAlignVertical: 'center',
      textAlign: 'center',
      fontFamily: FONTS.gilroy.semiBold,
    },
    shimmerFill: {
      width: '100%',
      height: '100%',
    },
    shimmerTabWell: {
      width: tile,
      height: tile,
      borderRadius: RADIUS.lg,
    },
    shimmerLabel: {
      marginTop: SPACE.sm,
      width: '64%',
      height: TYPE.micro.lineHeight,
      borderRadius: 4,
    },
  });

  // Geometry the tab row is laid out with, so callers can anchor an indicator
  // to a tab without measuring it on the fly.
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
