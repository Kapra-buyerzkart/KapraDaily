import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View, ScrollView } = require('react-native');
  const passthrough = Component => React2.forwardRef((props, ref) => React2.createElement(Component, { ...props, ref }, props.children));
  return {
    __esModule: true,
    default: {
      View: passthrough(View),
      ScrollView: passthrough(ScrollView),
      Text: passthrough(require('react-native').Text),
      createAnimatedComponent: passthrough,
    },
    Easing: {
      out: () => {},
      inOut: () => {},
      cubic: 'cubic',
    },
    ReduceMotion: {
      System: 'System',
    },
    FadeInRight: {
      duration: () => ({
        delay: () => ({
          reduceMotion: () => ({}),
        }),
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

jest.mock('../src/kshope/api/services/homeService', () => ({
  getHomepageData: jest.fn(() => Promise.reject(new Error('offline'))),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: null }),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => ({ items: [], addToCart: jest.fn() }),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({ toggleWishlist: jest.fn(), isInWishlist: () => false }),
}));

jest.mock('../src/kshope/screens/Home/HomeSkeleton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
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

const HomeRedesignScreen =
  require('../src/kshope/screens/Home/redesign/HomeRedesignScreen').default;

const flatten = node => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return flatten(node.children);
};

// The homepage request is mocked to fail, so every section falls back to the
// static design content — which is exactly the path these assertions cover.
const renderScreen = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(HomeRedesignScreen));
  });
  return tree;
};

describe('home redesign screen', () => {
  it('renders without crashing', async () => {
    const tree = await renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  it('renders every section heading from the design fallback', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');

    [
      'Shop By',
      'Category',
      'Best Selling',
      'Brands In',
      'Spotlight',
      'Top',
      'Deals',
      'Recommended',
      'For you',
      'Thank You For Exploring 48 Hrs Deal',
    ].forEach(heading => expect(text).toContain(heading));
  });

  it('renders the reused header with its address and tabs', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');
    expect(text).toContain('Select delivery address');
    expect(text).toContain('All');
  });

  it('renders the featured products with prices and discounts', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');
    expect(text).toContain('Impex');
    expect(text).toContain('900 w Iron Box');
    expect(text).toContain('$1,500/-');
    expect(text).toContain('30% OFF');
    expect(text).toContain('Apple');
    expect(text).toContain('Samsung');
  });

  it('uses Lexend throughout', () => {
    const { HOME_FONTS } = require('../src/kshope/screens/Home/redesign/theme');
    expect(HOME_FONTS.regular).toBe('Lexend-Regular');
    expect(HOME_FONTS.medium).toBe('Lexend-Medium');
    expect(HOME_FONTS.semiBold).toBe('Lexend-SemiBold');
    expect(HOME_FONTS.bold).toBe('Lexend-Bold');
  });
});
