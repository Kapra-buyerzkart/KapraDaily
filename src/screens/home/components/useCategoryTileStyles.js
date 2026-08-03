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

// Selected-tab ring width. Drawn on every tab (transparent when idle) so the
// well's box never changes between states.
export const TAB_RING = 2;

// The two ends of the tab's selected animation, exported so the component can
// hand them straight to interpolateColor without re-deriving the palette.
export const TAB_WELL_IDLE = CATEGORY_WELL;
export const TAB_WELL_ACTIVE = SURFACE.tint;
export const TAB_RING_IDLE = 'rgba(242,80,0,0)';
export const TAB_RING_ACTIVE = ACCENT.primary;
export const TAB_LABEL_IDLE = INK.base;
export const TAB_LABEL_ACTIVE = ACCENT.primary;

// The grid's geometry used to be computed from `Dimensions.get('window')` at
// module load, which is read exactly once for the lifetime of the JS context.
// Every tile then kept that first width forever — so after a rotation, a
// split-screen resize, or on a foldable being unfolded, the cells no longer
// divided the content box and the grid drifted out of alignment with the
// section header above it. Deriving from useWindowDimensions re-runs the math
// whenever the window actually changes.

// StyleSheet.create is not free, and CategoryItem is rendered once per tile.
// Keying a small cache on width means the sheet is built once per distinct
// window size rather than once per tile.
const cache = new Map();

const buildStyles = width => {
  const gutter = Math.round((width * GUTTER_PCT) / 100);
  const contentWidth = width - gutter * 2;
  const cell = Math.floor(contentWidth / COLUMNS);

  // The gap between tiles is subtracted from the cell rather than scaled out of
  // it. Scaling (TILE = 0.8 * CELL) made the gutter grow with the screen, so
  // the tiles shrank away from each other on larger phones; a fixed inset keeps
  // the grid's density constant.
  const tileGap = Math.round(width * 0.024);
  const tile = cell - tileGap;

  // The image is sized to the *well*, not inset inside it, and anchored to the
  // bottom so it runs off the lower edge and gets clipped by the corner radius.
  // A category photo that floats small and centred reads as an icon; one that
  // bleeds past the frame reads as merchandise.
  const image = Math.round(tile * 0.92);

  // The discovery tabs are the grid tile again, not a second category shape:
  // same well, same near-full-bleed image, same label ramp. Only the selected
  // ring is added, and it is drawn *inside* the well so a tab does not change
  // size when it becomes active and shove the rail beside it.
  const tabImage = image - TAB_RING * 2;

  return StyleSheet.create({
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
    // --- Discovery tabs (horizontal strip) ---
    // Same gutter and same inter-tile gap as the grid, so a tab lines up with
    // the column above it instead of starting on its own margin.
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
