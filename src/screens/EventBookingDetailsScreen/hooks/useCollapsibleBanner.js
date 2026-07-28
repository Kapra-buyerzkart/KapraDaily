import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { getHeaderPaddingTop } from '@/utils/headerLayout';
import {
  AVATAR_LEFT,
  AVATAR_SIZE,
  BACK_BUTTON_SIZE,
  BANNER_HEIGHT,
  BANNER_MARGIN,
  BANNER_WIDTH,
  COLLAPSE_DISTANCE,
  HEADER_PADDING_BOTTOM,
  STRETCH_DISTANCE,
} from '../constants';

// The banner starts as a rounded card at the top of the page and, as the user
// scrolls, shrinks and slides up into the header until it's a circle sitting
// next to the back button, where it stays pinned. The event name fades in
// beside it at the same moment.
//
// The banner lives outside the ScrollView (absolutely positioned over it) so it
// can survive past the top of the scroll area; the scroll content just reserves
// BANNER_HEIGHT of padding where the banner visually sits.
const useCollapsibleBanner = insets => {
  const headerTop = getHeaderPaddingTop(insets);
  const headerHeight = headerTop + BACK_BUTTON_SIZE + HEADER_PADDING_BOTTOM;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const bannerStyle = useAnimatedStyle(() => {
    const collapse = [0, COLLAPSE_DISTANCE];
    return {
      top: interpolate(
        scrollY.value,
        collapse,
        [headerHeight, headerTop],
        Extrapolation.CLAMP,
      ),
      left: interpolate(
        scrollY.value,
        collapse,
        [BANNER_MARGIN, AVATAR_LEFT],
        Extrapolation.CLAMP,
      ),
      width: interpolate(
        scrollY.value,
        collapse,
        [BANNER_WIDTH, AVATAR_SIZE],
        Extrapolation.CLAMP,
      ),
      height: interpolate(
        scrollY.value,
        [-STRETCH_DISTANCE, 0, COLLAPSE_DISTANCE],
        [BANNER_HEIGHT + STRETCH_DISTANCE, BANNER_HEIGHT, AVATAR_SIZE],
        Extrapolation.CLAMP,
      ),
    };
  });

  // Title only earns its place once the banner is nearly docked, otherwise it
  // competes with the large title still sitting in the page body.
  const headerTitleStyle = useAnimatedStyle(() => {
    const range = [COLLAPSE_DISTANCE * 0.55, COLLAPSE_DISTANCE];
    return {
      opacity: interpolate(scrollY.value, range, [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            scrollY.value,
            range,
            [12, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  // Hairline under the header, so the docked row reads as a separate surface
  // from the content sliding beneath it.
  const headerDividerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.6, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return {
    headerTop,
    scrollHandler,
    bannerStyle,
    headerTitleStyle,
    headerDividerStyle,
  };
};

export default useCollapsibleBanner;
