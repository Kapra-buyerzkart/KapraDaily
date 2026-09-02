import React from 'react';
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
    { placementKey: 'app_top_brands', bannerId: 91, imageUrl: 'media/b1.png' },
    { placementKey: 'app_top_brands', bannerId: 92, imageUrl: 'media/b2.png' },
    {
      placementKey: 'app_home_mid_banner',
      bannerId: 11,
      imageUrl: 'media/mid1.png',
      linkType: 'category',
      linkValue: 44,
    },
    {
      placementKey: 'app_home_mid_banner',
      bannerId: 12,
      imageUrl: 'media/mid2.png',
    },
    {
      placementKey: 'app_home_bottom',
      bannerId: 21,
      imageUrl: 'media/bottom1.png',
    },
    {
      placementKey: 'app_home_mid_banner_bottom',
      bannerId: 31,
      imageUrl: 'media/midbot1.png',
    },
  ],
  featuredCategories: [
    { catId: 3, catName: 'Air Coolers', imageUrl: 'media/coolers.png' },
    { catId: 4, catName: 'Mixer Grinders', imageUrl: 'media/mixer.png' },
  ],
  showcaseSlider: [
    { catId: 7, catName: 'Ceiling Fans', imageUrl: 'media/fans.png' },
  ],
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
  secondProductBlock: {
    items: [{ productId: 601, prName: 'Wall Clock', price: 300, mrp: 500 }],
  },
  thirdProductBlock: {
    items: [
      {
        productId: 701,
        prName: 'Steam Iron',
        catName: 'Garment Care',
        price: 1200,
        mrp: 1600,
        imageUrl: 'media/iron.png',
      },
    ],
  },
};

jest.mock('react-native-reanimated');

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useIsFocused: () => true,
}));

jest.mock('../src/kshope/api/services/homeService', () => ({
  getHomepageData: jest.fn(() => Promise.resolve(HOMEPAGE_PAYLOAD)),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: { address: '12 Market Road, Kochi' } }),
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
  return flatten(node.children);
};

const renderText = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(HomeRedesignScreen));
  });
  return flatten(tree.toJSON()).join('\n');
};

describe('home redesign screen with live homepage data', () => {
  it('renders the featured product from firstProductBlock', async () => {
    const text = await renderText();
    expect(text).toContain('Prestige');
    expect(text).toContain('Induction Cooktop');
    expect(text).toContain('₹2400/-');
    expect(text).toContain('20% OFF');
  });

  it('renders the goat deal cards with name, price and discount', async () => {
    const text = await renderText();
    expect(text).toContain('GOAT Deal Kettle');
    expect(text).toContain('₹2400/-');
    expect(text).toContain('₹3000/-');
    expect(text).toContain('20% OFF');
  });

  it('renders api categories in shop-by-category and best selling', async () => {
    const text = await renderText();
    expect(text).toContain('Air Coolers');
    expect(text).toContain('Mixer Grinders');
    expect(text).toContain('Ceiling Fans');
  });

  it('renders the recently viewed row from secondProductBlock', async () => {
    const text = await renderText();
    expect(text).toContain('Wall Clock');
    expect(text).toContain('₹300/-');
  });

  it('shows the profile address in the header', async () => {
    const text = await renderText();
    expect(text).toContain('12 Market Road, Kochi');
  });

  it('drops the static design placeholders once live data arrives', async () => {
    const text = await renderText();
    expect(text).not.toContain('900 w Iron Box');
    expect(text).not.toContain('boAt Rockerz 450');
  });

  it('renders every banner slice from its placement key', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(React.createElement(HomeRedesignScreen));
    });

    const uris = [];
    const walk = node => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(walk);
      const src = node.props?.source;
      if (src?.uri) uris.push(src.uri);
      walk(node.children);
    };
    walk(tree.toJSON());

    ['mid1.png', 'mid2.png', 'bottom1.png', 'midbot1.png'].forEach(name =>
      expect(uris.some(u => u.endsWith(name))).toBe(true),
    );
  });

  it('still renders the section headings from the design', async () => {
    const text = await renderText();
    ['Best Selling', 'Brands In Spotlight', 'Recently Viewed'].forEach(
      heading => expect(text).toContain(heading),
    );
  });
});
