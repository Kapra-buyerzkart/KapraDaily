import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useIsFocused: () => true,
}));

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

const renderScreen = () => {
  let tree;
  act(() => {
    tree = renderer.create(React.createElement(HomeRedesignScreen));
  });
  return tree;
};

describe('home redesign screen', () => {
  it('renders without crashing', () => {
    const tree = renderScreen();
    expect(tree.toJSON()).toBeTruthy();
  });

  it('renders every section heading from the design', () => {
    const text = flatten(renderScreen().toJSON()).join('\n');

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

  it('renders the header search placeholder and address', () => {
    const text = flatten(renderScreen().toJSON()).join('\n');
    expect(text).toContain("Search For 'Cookware'");
    expect(text).toContain('Kapra Group, 2nd floor, nandhanam....');
  });

  it('renders the featured products with prices and discounts', () => {
    const text = flatten(renderScreen().toJSON()).join('\n');
    expect(text).toContain('Impex');
    expect(text).toContain('900 w Iron Box');
    expect(text).toContain('$1,500/-');
    expect(text).toContain('30% OFF');
    expect(text).toContain('Apple');
    expect(text).toContain('Samsung');
  });

  it('renders all six recommended cards', () => {
    const text = flatten(renderScreen().toJSON()).join('\n');
    [
      'boAt Rockerz 450',
      'Safari pentagon',
      'Noise Colorfit Pro 5',
      'Realme Buds T300',
      'Havels 0527',
      'Realme Buds Q100',
    ].forEach(name => expect(text).toContain(name));
  });

  it('renders both explore rows', () => {
    const text = flatten(renderScreen().toJSON()).join('\n');
    ['Smartphones', 'Lights & Lamps', 'Fridge', 'Washing Machine', 'Furniture']
      .forEach(label => expect(text).toContain(label));
    ['Air conditioning', 'Kitchen', 'Television', 'Camera', 'Smartwatch']
      .forEach(label => expect(text).toContain(label));
  });

  it('uses Poppins throughout, since the design specifies it', () => {
    const { HOME_FONTS } = require('../src/kshope/screens/Home/redesign/theme');
    expect(HOME_FONTS.regular).toBe('Poppins-Regular');
    expect(HOME_FONTS.medium).toBe('Poppins-Medium');
    expect(HOME_FONTS.semiBold).toBe('Poppins-SemiBold');
  });
});
