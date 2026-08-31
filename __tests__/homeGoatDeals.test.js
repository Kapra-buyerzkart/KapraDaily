import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useIsFocused: () => true,
}));

jest.mock('react-native-svg', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const Stub = props => React2.createElement(View, props, props.children);
  return { __esModule: true, default: Stub, Svg: Stub, Path: Stub };
});

jest.mock('react-native-linear-gradient', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return props => React2.createElement(View, props, props.children);
});

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: {
      View: props => React2.createElement(View, props, props.children),
      ScrollView: props =>
        React2.createElement(ScrollView, props, props.children),
    },
    useSharedValue: v => ({ value: v }),
    withTiming: v => v,
    withRepeat: v => v,
    withSequence: v => v,
    Easing: { inOut: () => () => 0, ease: () => 0, linear: () => 0 },
    useAnimatedScrollHandler: () => () => {},
    useAnimatedStyle: () => ({}),
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: { firstName: 'Tester' } }),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({ toggleWishlist: jest.fn(), isInWishlist: () => false }),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(async () => 10652),
}));

const mockGetHomepageData = jest.fn();
jest.mock('../src/kshope/api/services/homeService', () => ({
  getHomepageData: (...args) => mockGetHomepageData(...args),
}));

jest.mock('../src/kshope/components/HomeHeader', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React2.createElement(View),
    HEADER_BG: 1,
  };
});

jest.mock('../src/kshope/screens/Home/HomeSkeleton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
});

jest.mock('../src/kshope/components/ExploreItem', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
});

jest.mock('../src/kshope/components/ClickForMoreButton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
});

jest.mock('../src/kshope/components/FloatingCartButton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
});

const HomeScreen = require('../src/kshope/screens/Home/HomeScreen').default;

const goatBanner = (id, title, extra = {}) => ({
  bannerId: id,
  placementKey: 'app_home_cat_top_sidebyside_four',
  title,
  imageUrl: `/banners/goat_${id}.png`,
  linkType: 'product',
  linkValue: `${900 + id}`,
  ...extra,
});

const renderHome = async homeData => {
  mockGetHomepageData.mockResolvedValue({ data: homeData, ...homeData });
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(HomeScreen));
  });
  return tree;
};

const flatten = node => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') {
    return [String(node)];
  }
  if (Array.isArray(node)) return node.flatMap(flatten);
  return flatten(node.children);
};

const pressableAncestor = node => {
  let current = node.parent;
  while (current) {
    if (typeof current.props.onPress === 'function') return current;
    current = current.parent;
  }
  return null;
};

const cardFor = (tree, name) =>
  pressableAncestor(tree.root.findByProps({ children: name }));

const seeAllArrow = tree => {
  const silent = tree.root
    .findAll(n => typeof n.props.onPress === 'function' && !n.props.disabled)
    .filter(
      n => n.findAll(x => typeof x.props.children === 'string').length === 0,
    );
  const handlers = new Set(silent.map(n => n.props.onPress));
  expect(handlers.size).toBe(1);
  return silent[0];
};

describe('recommended grid fed by GOAT deals', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders a card per GOAT deal banner, capped at six', async () => {
    const banners = [];
    for (let i = 1; i <= 8; i++) banners.push(goatBanner(i, `Goat ${i}`));
    const tree = await renderHome({ banners });
    const text = flatten(tree.toJSON()).join('\n');

    expect(text).toContain('Goat 1');
    expect(text).toContain('Goat 6');
    expect(text).not.toContain('Goat 7');
  });

  it('ignores banners from other placements', async () => {
    const tree = await renderHome({
      banners: [
        goatBanner(1, 'Goat one'),
        {
          bannerId: 2,
          placementKey: 'app_home_mid_banner',
          title: 'Mid banner',
          imageUrl: '/banners/mid.png',
        },
      ],
    });
    const text = flatten(tree.toJSON()).join('\n');
    expect(text).toContain('Goat one');
    expect(text).not.toContain('Mid banner');
  });

  it('takes GOAT deals over the third product block', async () => {
    const tree = await renderHome({
      banners: [goatBanner(1, 'Goat one')],
      thirdProductBlock: {
        title: 'Recommended',
        items: [{ productId: 51, prName: 'Block product', price: 100 }],
      },
    });
    const text = flatten(tree.toJSON()).join('\n');
    expect(text).toContain('Goat one');
    expect(text).not.toContain('Block product');
  });

  it('falls back to the third product block when no GOAT deals ship', async () => {
    const tree = await renderHome({
      banners: [],
      thirdProductBlock: {
        title: 'Recommended',
        items: [
          { productId: 51, prName: 'Block product', price: 100, unitPrice: 200 },
        ],
      },
    });
    const text = flatten(tree.toJSON()).join('\n');
    expect(text).toContain('Block product');
    expect(text).toContain('₹100/-');
    expect(text).toContain('50% OFF');
  });

  it('shows a price only when the banner carries one', async () => {
    const tree = await renderHome({
      banners: [
        goatBanner(1, 'No price'),
        goatBanner(2, 'With price', { price: 999, unitPrice: 1998 }),
      ],
    });
    const text = flatten(tree.toJSON()).join('\n');
    expect(text).toContain('₹999/-');
    expect(text).toContain('50% OFF');
    expect(text).not.toContain('₹0/-');
  });

  it('opens the product a GOAT banner links to', async () => {
    const tree = await renderHome({ banners: [goatBanner(1, 'Goat one')] });

    act(() => {
      cardFor(tree, 'Goat one').props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('KshopeProductDetails', {
      productId: '901',
    });
  });

  it('sends the see-all arrow to the category a GOAT banner links to', async () => {
    const tree = await renderHome({
      banners: [
        goatBanner(1, 'Goat one'),
        goatBanner(2, 'Goat two', { linkType: 'category', linkValue: '77' }),
      ],
    });

    act(() => {
      seeAllArrow(tree).props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('KshopeSearch', {
      catId: '77',
      catName: 'Category',
    });
  });
});
