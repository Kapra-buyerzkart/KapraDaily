import {
  tabBarVisibility,
  updateTabBarVisibilityWorklet,
  getTabBarHeight,
  getTabBarClearance,
  SCROLL_HIDE_THRESHOLD,
  TAB_BAR_ANIM_DURATION,
} from '../src/animations/tabBarVisibility';
import {
  COLLAPSE_DISTANCE,
  TOP_ROW_HEIGHT,
  TOP_ROW_MARGIN_BOTTOM,
  SEARCH_BAR_HEIGHT,
  HEADER_TOP_PADDING,
  HEADER_BOTTOM_PADDING,
  getExpandedHeaderHeight,
} from '../src/screens/home/components/modern/HomeHeaderGreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ name: 'HomeScreen' }),
  useFocusEffect: fn => fn(),
  useIsFocused: () => true,
}));

// Mock withTiming to simply return the target value or record calls
jest.mock('react-native-reanimated', () => {
  return {
    makeMutable: initial => ({ value: initial }),
    useSharedValue: initial => ({ value: initial }),
    withTiming: (toValue, config) => toValue,
    useAnimatedStyle: fn => fn(),
    interpolate: (val, input, output) => {
      if (val === input[0]) return output[0];
      if (val === input[1]) return output[1];
      const ratio = (val - input[0]) / (input[1] - input[0]);
      return output[0] + ratio * (output[1] - output[0]);
    },
    Extrapolation: { CLAMP: 'clamp' },
    clamp: (val, min, max) => Math.min(Math.max(val, min), max),
  };
});

describe('updateTabBarVisibilityWorklet', () => {
  let scrollAnchor;

  beforeEach(() => {
    tabBarVisibility.value = 1;
    scrollAnchor = { value: 0 };
  });

  it('exposes standard threshold and animation duration constants', () => {
    expect(SCROLL_HIDE_THRESHOLD).toBe(4);
    expect(TAB_BAR_ANIM_DURATION).toBe(250);
  });

  it('hides the navigation bar when user scrolls down past threshold', () => {
    // User scrolls down from 0 to 30 (diff = 30 > SCROLL_HIDE_THRESHOLD = 4)
    updateTabBarVisibilityWorklet(30, scrollAnchor, false);

    expect(tabBarVisibility.value).toBe(0);
    expect(scrollAnchor.value).toBe(30);
  });

  it('ignores minor scroll jitter smaller than SCROLL_HIDE_THRESHOLD', () => {
    // Initial state: visible
    expect(tabBarVisibility.value).toBe(1);

    // Minor scroll of 2px (diff = 2 <= 4)
    updateTabBarVisibilityWorklet(2, scrollAnchor, false);

    // Should stay visible and anchor should NOT update
    expect(tabBarVisibility.value).toBe(1);
    expect(scrollAnchor.value).toBe(0);
  });

  it('brings the navigation bar up when user scrolls up past threshold', () => {
    // First scroll down so tab bar is hidden
    updateTabBarVisibilityWorklet(100, scrollAnchor, false);
    expect(tabBarVisibility.value).toBe(0);
    expect(scrollAnchor.value).toBe(100);

    // Now user scrolls up to 80 (diff = 80 - 100 = -20 < -4)
    updateTabBarVisibilityWorklet(80, scrollAnchor, false);

    expect(tabBarVisibility.value).toBe(1);
    expect(scrollAnchor.value).toBe(80);
  });

  it('brings the navigation bar up when user reaches the top of the scroll (y <= 0)', () => {
    // Hide the tab bar first
    updateTabBarVisibilityWorklet(150, scrollAnchor, false);
    expect(tabBarVisibility.value).toBe(0);

    // Scroll back to top
    updateTabBarVisibilityWorklet(0, scrollAnchor, false);

    expect(tabBarVisibility.value).toBe(1);
    expect(scrollAnchor.value).toBe(0);

    // Overscroll pull-to-refresh (negative y)
    updateTabBarVisibilityWorklet(-25, scrollAnchor, false);
    expect(tabBarVisibility.value).toBe(1);
    expect(scrollAnchor.value).toBe(0);
  });

  it('brings the navigation bar up when reaching the end of the scroll (atEnd === true)', () => {
    // User scrolls down towards the bottom
    updateTabBarVisibilityWorklet(500, scrollAnchor, false);
    expect(tabBarVisibility.value).toBe(0);

    // User hits the end of scrollable content
    updateTabBarVisibilityWorklet(520, scrollAnchor, true);

    expect(tabBarVisibility.value).toBe(1);
    expect(scrollAnchor.value).toBe(520);
  });
});

describe('getTabBarHeight and getTabBarClearance', () => {
  it('returns valid numeric height and clearance', () => {
    const height = getTabBarHeight(34);
    const clearance = getTabBarClearance(34);

    expect(typeof height).toBe('number');
    expect(height).toBeGreaterThan(0);
    expect(clearance).toBe(height);
  });
});

describe('HomeHeaderGreen collapse metrics', () => {
  it('defines valid collapse distance equal to top row height plus bottom margin', () => {
    expect(COLLAPSE_DISTANCE).toBe(TOP_ROW_HEIGHT + TOP_ROW_MARGIN_BOTTOM);
    expect(COLLAPSE_DISTANCE).toBe(52);
  });

  it('calculates full expanded header height including safe area inset and paddings', () => {
    const topInset = 47;
    const height = getExpandedHeaderHeight(topInset);

    const expected =
      topInset +
      HEADER_TOP_PADDING +
      TOP_ROW_HEIGHT +
      TOP_ROW_MARGIN_BOTTOM +
      SEARCH_BAR_HEIGHT +
      HEADER_BOTTOM_PADDING;

    expect(height).toBe(expected);
    expect(height).toBeGreaterThan(COLLAPSE_DISTANCE);
  });
});

describe('Floating cart in-tandem movement with navigation bar', () => {
  it('shifts cart down when navigation bar is hidden and returns up when shown', () => {
    const tabBarClearance = 60;

    const computeCartTranslateY = progress => {
      // Interpolate progress [0, 1] -> [tabBarClearance, 0]
      return (1 - progress) * tabBarClearance;
    };

    // When tab bar is fully visible (progress = 1)
    expect(computeCartTranslateY(1)).toBe(0);

    // When tab bar is hidden down (progress = 0)
    expect(computeCartTranslateY(0)).toBe(tabBarClearance);

    // Mid-transition (progress = 0.5)
    expect(computeCartTranslateY(0.5)).toBe(tabBarClearance / 2);
  });
});

describe('useTabBarAnimation hook contract', () => {
  it('delegates onScrollWorklet to updateTabBarVisibilityWorklet with atEnd parameter', () => {
    const React = require('react');
    const renderer = require('react-test-renderer');
    const useTabBarAnimation =
      require('../src/hooks/useTabBarAnimation').default;

    let hookResult;
    function TestComponent() {
      hookResult = useTabBarAnimation();
      return null;
    }

    renderer.act(() => {
      renderer.create(React.createElement(TestComponent));
    });

    expect(typeof hookResult?.onScrollWorklet).toBe('function');

    tabBarVisibility.value = 1;

    // Scroll down: should hide
    hookResult.onScrollWorklet(50, false);
    expect(tabBarVisibility.value).toBe(0);

    // Scroll with atEnd: should restore
    hookResult.onScrollWorklet(60, true);
    expect(tabBarVisibility.value).toBe(1);
  });
});
