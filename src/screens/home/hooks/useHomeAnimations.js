import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  clamp,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useTabBarAnimation from '../../../hooks/useTabBarAnimation';
import {
  tabBarVisibility,
  getTabBarClearance,
} from '../../../animations/tabBarVisibility';

// Every scroll-driven style on the home screen, in one place.
//
// These were nine `useAnimatedStyle` blocks inline in HomeScreen's body, which
// is most of what made that file 771 lines and made the actual data flow hard
// to find. Nothing here reads component state — they all read shared values —
// so pulling them into a hook changes no behaviour: the animations still run on
// the UI thread and still don't re-render the screen.
//
// Nothing in here writes a prop that Yoga reads. The collapse used to animate
// `height`/`minHeight`/`marginTop`, which forced a layout pass every scroll
// frame — and because the header was a flex sibling of the scroll view, that
// pass re-laid-out the entire home content tree underneath it. The header is an
// absolutely-positioned overlay with a fixed box now, and the collapse is a
// `translateY` on the whole thing.

// The search bar's resting geometry. Only the corner radius still animates, and
// borderRadius is a paint prop, not a layout one.
const SEARCH_MARGIN_START = hp('2%');
const SEARCH_MARGIN_END = hp('0.8%');
const SEARCH_HEIGHT = hp('5.4%');
const SEARCH_RADIUS_START = wp('5.5%');
const SEARCH_RADIUS_END = wp('4.5%');

const ETA_FADE_FRACTION = 0.65;

const BORDER_FADE_FRACTION = 0.35;

const BANNER_ASPECT = 2.2;
const BANNER_MIN_HEIGHT = Math.round(wp('100%') / BANNER_ASPECT);

const BANNER_PARALLAX = 28;

const HEADER_INFO_ESTIMATE = hp('8%');

export const estimateHeaderMetrics = (top, hasBanner) => {
  const searchY = top + HEADER_INFO_ESTIMATE + SEARCH_MARGIN_START;
  const contentHeight = searchY + SEARCH_HEIGHT + hp('1%');
  return {
    height: hasBanner
      ? Math.max(BANNER_MIN_HEIGHT, contentHeight)
      : contentHeight,
    searchY,
  };
};

const useHomeAnimations = ({ top, bottom, headerMetrics }) => {
  const scrollY = useSharedValue(0);
  const searchPressScale = useSharedValue(1);

  const tabBarClearance = getTabBarClearance(bottom);
  const floatingBottomOffset = hp('0.2%') + tabBarClearance;
  const collapseDistance = Math.max(
    0,
    headerMetrics.searchY - (top + SEARCH_MARGIN_END),
  );

  const { onScrollWorklet } = useTabBarAnimation();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      onScrollWorklet(y);
    },
  });

  const cartAnimatedStyle = useAnimatedStyle(() => {
    const progress = clamp(tabBarVisibility.value, 0, 1);
    return {
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [tabBarClearance, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  const headerCollapseStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -clamp(scrollY.value, 0, collapseDistance) }],
  }));

  const etaAnimStyle = useAnimatedStyle(() => {
    const fadeEnd = collapseDistance * ETA_FADE_FRACTION;
    if (fadeEnd <= 0) return { opacity: 1 };
    return {
      opacity: interpolate(
        scrollY.value,
        [0, fadeEnd],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, fadeEnd],
            [0, -40],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, fadeEnd],
            [1, 0.9],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const searchWrapperAnimStyle = useAnimatedStyle(() => {
    const progress =
      collapseDistance > 0 ? clamp(scrollY.value / collapseDistance, 0, 1) : 0;
    return {
      borderRadius: interpolate(
        progress,
        [0, 1],
        [SEARCH_RADIUS_START, SEARCH_RADIUS_END],
      ),
      transform: [{ scale: searchPressScale.value }],
    };
  });

  const bannerSheetStyle = useAnimatedStyle(() => {
    if (collapseDistance <= 0) return { opacity: 0 };
    return {
      opacity: interpolate(
        scrollY.value,
        [0, collapseDistance * ETA_FADE_FRACTION, collapseDistance],
        [0, 0.18, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  const bannerParallaxStyle = useAnimatedStyle(() => {
    const progress =
      collapseDistance > 0 ? clamp(scrollY.value / collapseDistance, 0, 1) : 0;
    return {
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [0, -BANNER_PARALLAX * 0.7],
          ),
        },
        { scale: interpolate(progress, [0, 1], [1, 1.05]) },
      ],
    };
  });

  const bannerScrimStyle = useAnimatedStyle(() => {
    if (collapseDistance <= 0) return { opacity: 1 };
    return {
      opacity: interpolate(
        scrollY.value,
        [0, collapseDistance * 0.7],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    };
  });

  const fallbackHeaderBgStyle = useAnimatedStyle(() => {
    const progress =
      collapseDistance > 0 ? clamp(scrollY.value / collapseDistance, 0, 1) : 0;
    return {
      backgroundColor: interpolateColor(
        progress,
        [0, 1],
        ['#F25000', '#FFFFFF'],
      ),
    };
  });

  const stickyBorderAnimStyle = useAnimatedStyle(() => {
    if (collapseDistance <= 0) return { opacity: 0 };
    return {
      opacity: interpolate(
        scrollY.value,
        [collapseDistance * BORDER_FADE_FRACTION, collapseDistance],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  // Stable identities — both are handed to the (memoised) StickyHeader.
  const handleSearchPressIn = useCallback(() => {
    searchPressScale.value = withTiming(0.98, { duration: 75 });
  }, [searchPressScale]);

  const handleSearchPressOut = useCallback(() => {
    searchPressScale.value = withSpring(1, { damping: 20, stiffness: 200 });
  }, [searchPressScale]);

  return {
    scrollY,
    collapseDistance,
    scrollHandler,
    floatingBottomOffset,
    cartAnimatedStyle,
    headerCollapseStyle,
    etaAnimStyle,
    searchWrapperAnimStyle,
    bannerSheetStyle,
    bannerParallaxStyle,
    bannerScrimStyle,
    fallbackHeaderBgStyle,
    stickyBorderAnimStyle,
    handleSearchPressIn,
    handleSearchPressOut,
  };
};

export default useHomeAnimations;
export {
  BANNER_MIN_HEIGHT,
  BANNER_PARALLAX,
  SEARCH_MARGIN_START,
  SEARCH_HEIGHT,
};
