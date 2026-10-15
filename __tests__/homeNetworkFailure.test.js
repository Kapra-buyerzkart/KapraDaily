import React from 'react';
import renderer, { act } from 'react-test-renderer';
import {
  isNetworkInterruption,
  checkInternetConnectivity,
} from '../src/kshope/screens/Home/redesign/network/networkCheck';

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View, ScrollView } = require('react-native');
  const passthrough = Component =>
    React2.forwardRef((props, ref) =>
      React2.createElement(Component, { ...props, ref }, props.children),
    );
  return {
    __esModule: true,
    default: {
      View: passthrough(View),
      ScrollView: passthrough(ScrollView),
      Text: passthrough(require('react-native').Text),
      createAnimatedComponent: passthrough,
    },
    Easing: { out: () => {}, inOut: () => {}, cubic: 'cubic' },
    ReduceMotion: { System: 'System' },
    FadeInRight: {
      duration: () => ({
        delay: () => ({ reduceMotion: () => ({}) }),
      }),
    },
    makeMutable: value => ({ value }),
    useSharedValue: value => ({ value }),
    useAnimatedScrollHandler: () => () => {},
    useAnimatedStyle: () => ({}),
    useAnimatedReaction: () => {},
    interpolate: () => {},
    withTiming: () => {},
    withSpring: () => {},
    withRepeat: () => {},
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useIsFocused: () => true,
  useFocusEffect: jest.fn(),
}));

let mockHomepageResponse = Promise.resolve({
  data: {
    banners: [],
    featuredCategories: [],
    brands: [],
    firstProductBlock: { items: [] },
  },
});

jest.mock('../src/kshope/api/services/homeService', () => ({
  getHomepageData: jest.fn(() => mockHomepageResponse),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: null }),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => ({
    items: [],
    addToCart: jest.fn(),
    fetchAddresses: jest.fn(),
    selectedAddress: null,
  }),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({ toggleWishlist: jest.fn(), isInWishlist: () => false }),
}));

jest.mock('../src/kshope/screens/Home/HomeSkeleton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View, { testID: 'HomeSkeleton' }) };
});

jest.mock('react-native-svg', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const Stub = props => React2.createElement(View, props, props.children);
  return { __esModule: true, default: Stub, Svg: Stub, Path: Stub };
});

jest.mock('react-native-simple-toast', () => ({
  SHORT: 0,
  LONG: 1,
  show: jest.fn(),
}));

const flatten = node => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return flatten(node.children);
};

describe('network interruption classification', () => {
  it('correctly identifies network interruptions from createApiClient and axios', () => {
    // Strings thrown by createApiClient.js
    expect(
      isNetworkInterruption('Network Error. Ensure you are connected to internet.'),
    ).toBe(true);
    expect(isNetworkInterruption('Server is not responding')).toBe(true);

    // Standard axios network error
    expect(isNetworkInterruption({ message: 'Network Error' })).toBe(true);
    expect(isNetworkInterruption({ code: 'ECONNABORTED' })).toBe(true);
    expect(isNetworkInterruption({ code: 'ERR_NETWORK' })).toBe(true);
    expect(isNetworkInterruption({ code: 'ETIMEDOUT' })).toBe(true);
    expect(isNetworkInterruption({ code: 'ENOTFOUND' })).toBe(true);
    expect(isNetworkInterruption({ isAxiosError: true, response: undefined })).toBe(true);
    expect(isNetworkInterruption(new Error('Network request failed'))).toBe(true);
    expect(isNetworkInterruption(new Error('timeout of 20000ms exceeded'))).toBe(true);
  });

  it('distinguishes server errors and authentication errors from network interruptions', () => {
    // 500 Internal server error
    expect(isNetworkInterruption({ status: 500, message: 'Internal Server Error' })).toBe(false);
    expect(isNetworkInterruption({ response: { status: 500 } })).toBe(false);

    // 401 / 403 Authentication failure
    expect(isNetworkInterruption({ status: 401, message: 'Unauthorized' })).toBe(false);
    expect(isNetworkInterruption({ response: { status: 403 } })).toBe(false);

    // 400 Validation error
    expect(isNetworkInterruption({ status: 400, message: 'Bad Request' })).toBe(false);
    expect(isNetworkInterruption({ response: { status: 422 } })).toBe(false);

    // 404 Not found
    expect(isNetworkInterruption({ status: 404, message: 'Not Found' })).toBe(false);

    // Null or undefined
    expect(isNetworkInterruption(null)).toBe(false);
    expect(isNetworkInterruption(undefined)).toBe(false);
  });
});

describe('checkInternetConnectivity probe', () => {
  it('returns true when probe reaches server', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
    const result = await checkInternetConnectivity();
    expect(result).toBe(true);
    global.fetch = originalFetch;
  });

  it('returns false when probe throws a network error', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network request failed'));
    const result = await checkInternetConnectivity();
    expect(result).toBe(false);
    global.fetch = originalFetch;
  });
});

describe('Home screen network failure & retry handling', () => {
  const HomeRedesignScreen =
    require('../src/kshope/screens/Home/redesign/HomeRedesignScreen').default;

  const renderScreen = async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(React.createElement(HomeRedesignScreen));
    });
    return tree;
  };

  it('displays real API data and does not show interruption sheet when online', async () => {
    const { getHomepageData } = require('../src/kshope/api/services/homeService');
    getHomepageData.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          firstProductBlock: {
            items: [
              {
                productId: 101,
                productName: 'Real Induction Cooktop',
                specialPrice: 2499,
                unitPrice: 3999,
                discountPercent: 37,
                featuredImage: 'media/cooktop.jpg',
              },
            ],
          },
          banners: [],
          featuredCategories: [],
        },
      }),
    );

    const tree = await renderScreen();
    const text = flatten(tree.toJSON()).join('\n');

    expect(text).toContain('Real Induction Cooktop');
    expect(text).toContain('₹2499/-');
    expect(text).not.toContain('Internet connection interrupted');
    expect(text).not.toContain('900 w Iron Box');
    expect(text).not.toContain('$1,500/-');
  });

  it('shows Gorhom Bottom Sheet on network interruption and suppresses fake fallback products', async () => {
    const { getHomepageData } = require('../src/kshope/api/services/homeService');
    getHomepageData.mockImplementationOnce(() =>
      Promise.reject(new Error('Network Error. Ensure you are connected to internet.')),
    );

    const tree = await renderScreen();
    const text = flatten(tree.toJSON()).join('\n');

    // Interruption sheet is displayed
    expect(text).toContain('Internet connection interrupted');
    expect(text).toContain("We're having trouble connecting");
    expect(text).toContain('Retry');

    // Fabricated items are NOT displayed
    expect(text).not.toContain('900 w Iron Box');
    expect(text).not.toContain('iphone 17 pro max');
    expect(text).not.toContain('$1,30,000/-');
    expect(text).not.toContain('Washing Machine');
  });

  it('preserves legitimate empty state when API returns empty valid response', async () => {
    const { getHomepageData } = require('../src/kshope/api/services/homeService');
    getHomepageData.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          firstProductBlock: { items: [] },
          secondProductBlock: { items: [] },
          thirdProductBlock: { items: [] },
          featuredCategories: [],
          brands: [],
          banners: [],
        },
      }),
    );

    const tree = await renderScreen();
    const text = flatten(tree.toJSON()).join('\n');

    // Does NOT trigger interruption sheet
    expect(text).not.toContain('Internet connection interrupted');
    // Does NOT render fake products
    expect(text).not.toContain('900 w Iron Box');
  });

  it('retry while offline keeps sheet open and prevents redundant API request', async () => {
    const { getHomepageData } = require('../src/kshope/api/services/homeService');
    getHomepageData.mockClear();

    // Simulate initial failure
    getHomepageData.mockImplementationOnce(() =>
      Promise.reject(
        new Error('Network Error. Ensure you are connected to internet.'),
      ),
    );

    const {
      useHomeData,
    } = require('../src/kshope/screens/Home/redesign/data/useHomeData');
    let hookResult;
    const TestComponent = () => {
      hookResult = useHomeData();
      return null;
    };

    await act(async () => {
      renderer.create(React.createElement(TestComponent));
    });

    expect(hookResult.networkError).toBe(true);

    // Mock probe to return false (still offline)
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network request failed'));

    getHomepageData.mockClear();

    await act(async () => {
      await hookResult.retry();
    });

    // Should NOT have called getHomepageData since device is offline
    expect(getHomepageData).not.toHaveBeenCalled();
    // Sheet remains open
    expect(hookResult.networkError).toBe(true);
    expect(hookResult.retryErrorMessage).toBe(
      "We're having trouble connecting. Please check your internet connection and try again.",
    );

    global.fetch = originalFetch;
  });

  it('retry when internet restored successfully recovers real data and clears error', async () => {
    const { getHomepageData } = require('../src/kshope/api/services/homeService');
    getHomepageData.mockClear();

    // Initial failure
    getHomepageData.mockImplementationOnce(() =>
      Promise.reject(
        new Error('Network Error. Ensure you are connected to internet.'),
      ),
    );

    const {
      useHomeData,
    } = require('../src/kshope/screens/Home/redesign/data/useHomeData');
    let hookResult;
    const TestComponent = () => {
      hookResult = useHomeData();
      return null;
    };

    await act(async () => {
      renderer.create(React.createElement(TestComponent));
    });

    expect(hookResult.networkError).toBe(true);

    // Mock probe to return true (online)
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });

    // Mock successful retry API response
    getHomepageData.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          firstProductBlock: {
            items: [
              {
                productId: 999,
                productName: 'Recovered Real Product',
                specialPrice: 1999,
                unitPrice: 2999,
                discountPercent: 33,
                featuredImage: 'media/product999.png',
              },
            ],
          },
          banners: [],
          featuredCategories: [],
        },
      }),
    );

    await act(async () => {
      await hookResult.retry();
    });

    // Successfully called API
    expect(getHomepageData).toHaveBeenCalled();
    // Network error cleared and sheet dismissed
    expect(hookResult.networkError).toBe(false);
    expect(hookResult.retryErrorMessage).toBeNull();
    // Real data restored
    expect(hookResult.sections.featured.length).toBe(1);
    expect(hookResult.sections.featured[0].name).toBe('Recovered Real Product');
    expect(hookResult.sections.featured[0].price).toBe('₹1999/-');

    global.fetch = originalFetch;
  });
});
