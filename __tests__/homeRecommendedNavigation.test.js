import React from 'react';
import { Text } from 'react-native';
import renderer, { act } from 'react-test-renderer';

const HOMEPAGE_PAYLOAD = {
  banners: [
    {
      placementKey: 'app_home_cat_top_sidebyside_four',
      bannerId: 61,
      title: 'GOAT Deal Kettle',
      imageUrl: 'media/goat1.png',
      linkType: 'product',
      linkValue: 501,
    },
    {
      placementKey: 'app_home_cat_top_sidebyside_four',
      bannerId: 62,
      title: 'GOAT Deal Bulb',
      imageUrl: 'media/goat2.png',
      linkType: 'product',
      linkValue: 999,
    },
  ],
  featuredCategories: [],
  firstProductBlock: {
    items: [
      {
        productId: 501,
        brandName: 'Prestige',
        prName: 'Induction Cooktop',
        specialPrice: 2400,
        unitPrice: 3000,
        featuredImage: 'media/cooktop.png',
      },
    ],
  },
};

const mockNavigate = jest.fn();

jest.mock('react-native-reanimated');

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
}));

jest.mock('../src/kshope/api/services/homeService', () => ({
  getHomepageData: jest.fn(() => Promise.resolve(HOMEPAGE_PAYLOAD)),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: {} }),
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
  if (typeof node === 'string' || typeof node === 'number')
    return [String(node)];
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (node.props) return flatten(node.props.children);
  return [];
};

const pressCardWithText = async label => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(HomeRedesignScreen));
  });
  const card = tree.root
    .findAll(node => typeof node.props?.onPress === 'function')
    .find(node =>
      node
        .findAllByType(Text)
        .some(t => flatten(t.props.children).join(' ').includes(label)),
    );
  expect(card).toBeDefined();
  await act(async () => {
    card.props.onPress();
  });
};

describe('recommended card navigation', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('opens the linked product when the goat banner matches a product block', async () => {
    await pressCardWithText('GOAT Deal Kettle');
    expect(mockNavigate).toHaveBeenCalledWith(
      'KshopeProductDetails',
      expect.objectContaining({ productId: 501 }),
    );
    expect(mockNavigate.mock.calls[0][1].product.prName).toBe('Induction Cooktop');
  });

  it('opens by product id when the goat banner has no matching product block', async () => {
    await pressCardWithText('GOAT Deal Bulb');
    expect(mockNavigate).toHaveBeenCalledWith('KshopeProductDetails', {
      productId: 999,
    });
  });
});
