import React from 'react';
import renderer, { act } from 'react-test-renderer';

const HOMEPAGE_PAYLOAD = {
  banners: [],
  featuredCategories: [],
  brands: [
    { bannerId: 1, brandName: 'Prestige', attrValueId: 77, brandImage: 'media/prestige.png' },
    { bannerId: 2, bannerName: 'Butterfly', brandImage: 'media/butterfly.png' },
    { bannerId: 3, brandImage: 'media/nameless.png', linkType: 'category', linkValue: 42 },
  ],
  firstProductBlock: { items: [] },
};

const mockNavigate = jest.fn();

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const {
    View,
    ScrollView,
    Text: RNText,
    Image: RNImage,
  } = require('react-native');
  const passthrough = Component =>
    React2.forwardRef((props, ref) =>
      React2.createElement(Component, { ...props, ref }, props.children),
    );
  const makeEntering = () => {
    const chain = {};
    ['duration', 'delay', 'reduceMotion', 'springify', 'easing', 'withInitialValues'].forEach(
      key => {
        chain[key] = () => chain;
      },
    );
    return chain;
  };
  return {
    __esModule: true,
    default: new Proxy(
      {
        View: passthrough(View),
        ScrollView: passthrough(ScrollView),
        Text: passthrough(RNText),
        Image: passthrough(RNImage),
        createAnimatedComponent: Component => passthrough(Component),
      },
      {
        get: (target, prop) =>
          prop in target ? target[prop] : passthrough(View),
      },
    ),
    View: passthrough(View),
    ScrollView: passthrough(ScrollView),
    makeMutable: value => ({ value }),
    useSharedValue: value => ({ value }),
    useAnimatedScrollHandler: () => () => {},
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    useAnimatedReaction: () => {},
    useDerivedValue: fn => ({ value: typeof fn === 'function' ? undefined : fn }),
    cancelAnimation: () => {},
    withRepeat: value => value,
    withDelay: (_, value) => value,
    withSequence: (...values) => values[0],
    withTiming: value => value,
    withSpring: value => value,
    interpolate: () => 0,
    Extrapolate: { CLAMP: 'clamp' },
    Extrapolation: { CLAMP: 'clamp' },
    runOnJS: fn => fn,
    Easing: {
      out: fn => fn,
      inOut: fn => fn,
      cubic: () => 0,
      bezier: () => () => 0,
      linear: () => 0,
    },
    ReduceMotion: { System: 'system', Never: 'never' },
    ...['FadeIn', 'FadeOut', 'FadeInRight', 'FadeInLeft', 'FadeOutRight', 'FadeOutLeft', 'LinearTransition', 'SlideInRight', 'SlideOutLeft'].reduce(
      (acc, name) => ({ ...acc, [name]: makeEntering() }),
      {},
    ),
    createAnimatedComponent: Component => passthrough(Component),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
  useFocusEffect: () => {},
}));

jest.mock('../src/kshope/api/services/homeService', () => ({
  getHomepageData: jest.fn(() => Promise.resolve(HOMEPAGE_PAYLOAD)),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

jest.mock('react-native-simple-toast', () => ({
  __esModule: true,
  default: { show: jest.fn(), showWithGravity: jest.fn(), SHORT: 0, LONG: 1, BOTTOM: 2 },
}));

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: {} }),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => ({ cartItems: [], addToCart: jest.fn(), updateQuantity: jest.fn() }),
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

const HomeRedesignScreen =
  require('../src/kshope/screens/Home/redesign/HomeRedesignScreen').default;

const pressBrand = async testID => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(HomeRedesignScreen));
  });
  const tile = tree.root.findAll(
    node => node.props?.testID === testID && typeof node.props?.onPress === 'function',
  )[0];
  expect(tile).toBeDefined();
  await act(async () => {
    tile.props.onPress();
  });
};

describe('brands in spotlight navigation', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('searches by brand name even when the brand carries an attrValueId', async () => {
    await pressBrand('brand-tile-1');
    expect(mockNavigate).toHaveBeenCalledWith('KshopeSearch', {
      query: 'Prestige',
      catName: 'Prestige',
    });
  });

  it('searches by name for brands that carry no attrValueId', async () => {
    await pressBrand('brand-tile-2');
    expect(mockNavigate).toHaveBeenCalledWith('KshopeSearch', {
      query: 'Butterfly',
      catName: 'Butterfly',
    });
  });

  it('falls back to the banner link when the brand has no name', async () => {
    await pressBrand('brand-tile-3');
    expect(mockNavigate).toHaveBeenCalledWith('KshopeSearch', {
      catId: 42,
      catName: 'Category',
    });
  });
});
