import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-reanimated');

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useIsFocused: () => true,
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

  it('renders every section heading from the design', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');

    [
      'Home',
      'Shop By',
      'Category',
      'Best Selling',
      'The Best',
      'Brands In Spotlight',
      'Top Deals For You',
      'More Deals You’ll Love',
      'Recommended',
      'Recently Viewed',
      'More To',
      'Explore',
      'Thank You For Exploring 48 Hrs Deal',
    ].forEach(heading => expect(text).toContain(heading));
  });

  // The Figma header was replaced by the app's existing HomeHeader, which
  // renders its own rotating search placeholder rather than a fixed string.
  it('renders the reused header with its title, address and tabs', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');
    expect(text).toContain('Home');
    expect(text).toContain('Kapra Group, 2nd floor, nandhanam....');
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

  it('renders all six recommended cards', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');
    [
      'boAt Rockerz 450',
      'Safari pentagon',
      'Noise Colorfit Pro 5',
      'Realme Buds T300',
      'Havels 0527',
      'Realme Buds Q100',
    ].forEach(name => expect(text).toContain(name));
  });

  it('renders both explore rows', async () => {
    const text = flatten((await renderScreen()).toJSON()).join('\n');
    ['Smartphones', 'Lights & Lamps', 'Fridge', 'Washing Machine', 'Furniture']
      .forEach(label => expect(text).toContain(label));
    ['Air conditioning', 'Kitchen', 'Television', 'Camera', 'Smartwatch']
      .forEach(label => expect(text).toContain(label));
  });

  it('uses Lexend throughout', () => {
    const { HOME_FONTS } = require('../src/kshope/screens/Home/redesign/theme');
    expect(HOME_FONTS.regular).toBe('Lexend-Regular');
    expect(HOME_FONTS.medium).toBe('Lexend-Medium');
    expect(HOME_FONTS.semiBold).toBe('Lexend-SemiBold');
    expect(HOME_FONTS.bold).toBe('Lexend-Bold');
  });
});
