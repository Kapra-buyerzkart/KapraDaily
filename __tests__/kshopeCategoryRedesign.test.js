import React from 'react';
import renderer, { act } from 'react-test-renderer';

const CATEGORIES = [
  {
    catId: 101,
    catName: 'Home appliance',
    imageUrl: 'media/home.png',
    mobBannerImgUrl: 'media/banner-home.png',
  },
  { catId: 102, catName: 'Kitchen appliance', imageUrl: 'media/kitchen.png' },
  { catId: 103, catName: 'Lamps & Lights', imageUrl: 'media/lamps.png' },
];

const SUB_CATEGORIES = {
  101: [
    { catId: 11, catName: 'Garment Care', imageUrl: 'media/garment.png' },
    { catId: 12, catName: 'Air Coolers', imageUrl: 'media/coolers.png' },
  ],
  102: [{ catId: 21, catName: 'Mixer Grinders', imageUrl: 'media/mixer.png' }],
};

const PRODUCTS = [
  {
    productId: 501,
    brandName: 'Samsung',
    prName: 'Washing Machine',
    specialPrice: 1499,
    unitPrice: 2499,
    featuredImage: 'media/washer.png',
  },
  {
    productId: 502,
    brandName: 'Prestige',
    prName: 'Induction Cooktop',
    specialPrice: 2400,
    unitPrice: 3000,
    featuredImage: 'media/cooktop.png',
  },
];

jest.mock('react-native-reanimated');

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useIsFocused: () => true,
  useRoute: () => ({ params: {} }),
}));

const mockGetCategoriesApi = jest.fn(parentId =>
  Promise.resolve({
    success: true,
    data: {
      items:
        parentId === '1' ? CATEGORIES : SUB_CATEGORIES[Number(parentId)] || [],
    },
  }),
);

jest.mock('../src/kshope/api/services/categoryService', () => ({
  getCategoriesApi: (...args) => mockGetCategoriesApi(...args),
}));

const mockSearchProductsApi = jest.fn(() =>
  Promise.resolve({ success: true, data: { items: PRODUCTS } }),
);

jest.mock('../src/kshope/api/services/productService', () => ({
  searchProductsApi: (...args) => mockSearchProductsApi(...args),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({
    toggleWishlist: jest.fn(),
    isInWishlist: () => false,
    loadWishlist: jest.fn(),
  }),
}));

jest.mock('../src/kshope/context/loaderContext', () => ({
  LoaderContext: require('react').createContext({ showLoader: () => {} }),
}));

jest.mock('../src/kshope/components/FloatingCartButton', () => {
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

const {
  toCategoryTiles,
  toSubCategoryTiles,
  toProductCards,
  ALL_TILE_ID,
} = require('../src/kshope/screens/Category/redesign/data/selectors');

const CategoryRedesignScreen =
  require('../src/kshope/screens/Category/redesign/CategoryRedesignScreen').default;

const flatten = node => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number')
    return [String(node)];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return flatten(node.children);
};

const renderScreen = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(CategoryRedesignScreen));
  });
  return tree;
};

const renderText = async () => flatten((await renderScreen()).toJSON()).join('\n');

describe('category redesign selectors', () => {
  it('maps categories to tiles with label and image', () => {
    const tiles = toCategoryTiles(CATEGORIES);
    expect(tiles.map(t => t.label)).toEqual([
      'Home appliance',
      'Kitchen appliance',
      'Lamps & Lights',
    ]);
    expect(tiles[0].id).toBe('101');
    expect(tiles[0].image.uri).toContain('media/home.png');
  });

  it('prepends an All tile to the subcategory row', () => {
    const tiles = toSubCategoryTiles(SUB_CATEGORIES[101], CATEGORIES[0]);
    expect(tiles[0].id).toBe(ALL_TILE_ID);
    expect(tiles[0].label).toBe('All');
    expect(tiles.map(t => t.label)).toContain('Garment Care');
  });

  it('returns no tiles at all when the category has no subcategories', () => {
    expect(toSubCategoryTiles([], CATEGORIES[0])).toEqual([]);
  });

  it('maps products to cards with price, mrp and discount', () => {
    const cards = toProductCards(PRODUCTS);
    expect(cards[0]).toMatchObject({
      id: '501',
      brand: 'Samsung',
      name: 'Washing Machine',
      price: '₹1499/-',
      mrp: '₹2499/-',
      discount: '40% OFF',
    });
  });
});

describe('category redesign screen', () => {
  beforeEach(() => {
    mockGetCategoriesApi.mockClear();
    mockSearchProductsApi.mockClear();
  });

  it('renders main categories as the top chip row', async () => {
    const text = await renderText();
    expect(text).toContain('Home appliance');
    expect(text).toContain('Kitchen appliance');
    expect(text).toContain('Lamps & Lights');
  });

  it('renders the subcategories of the first category below the chip row', async () => {
    const text = await renderText();
    expect(text).toContain('All');
    expect(text).toContain('Garment Care');
    expect(text).toContain('Air Coolers');
  });

  it('renders the explore by Category heading', async () => {
    const text = await renderText();
    expect(text).toContain('explore by');
    expect(text).toContain('Category');
  });

  it('renders the product grid with brand, name, price and discount', async () => {
    const text = await renderText();
    expect(text).toContain('Samsung');
    expect(text).toContain('Washing Machine');
    expect(text).toContain('₹1499/-');
    expect(text).toContain('₹2499/-');
    expect(text).toContain('40% OFF');
  });

  it('shows the promo banner for the active category', async () => {
    const tree = await renderScreen();
    const uris = [];
    const walk = node => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(walk);
      if (node.props?.source?.uri) uris.push(node.props.source.uri);
      walk(node.children);
    };
    walk(tree.toJSON());
    expect(uris.some(u => u.endsWith('media/banner-home.png'))).toBe(true);
  });

  it('fetches products for the first category once loaded', async () => {
    await renderScreen();
    expect(mockSearchProductsApi).toHaveBeenCalled();
    expect(mockSearchProductsApi.mock.calls[0][0]).toMatchObject({
      catId: 101,
      pincodeAreaId: 10652,
    });
  });

  it('does not render a vertical sidebar', async () => {
    const tree = await renderScreen();
    const text = flatten(tree.toJSON()).join('\n');
    // every category label appears exactly once, in the horizontal row
    expect(text.split('Kitchen appliance').length - 1).toBe(1);
  });
});

const findAllByTestID = (tree, id) =>
  tree.root.findAll(node => node.props && node.props.testID === id, {
    deep: true,
  });

const findHostByTestID = (tree, id) =>
  findAllByTestID(tree, id).filter(node => typeof node.type === 'string');

const press = async (tree, testID) => {
  const node = findAllByTestID(tree, testID).find(
    n => typeof n.props.onPress === 'function',
  );
  if (!node) throw new Error(`no pressable with testID ${testID}`);
  await act(async () => {
    node.props.onPress();
  });
};

const propOf = (tree, testID, prop) => {
  const node = findAllByTestID(tree, testID).find(n => n.props[prop] != null);
  return node && node.props[prop];
};

const lastSearchPayload = () =>
  mockSearchProductsApi.mock.calls[mockSearchProductsApi.mock.calls.length - 1][0];

describe('category search and filters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetCategoriesApi.mockClear();
    mockSearchProductsApi.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('searches the full price range by default rather than capping at 5000', async () => {
    await renderScreen();
    expect(lastSearchPayload()).toMatchObject({
      priceMin: 0,
      priceMax: 50000,
      sortBy: 'relevance',
      prName: '',
    });
  });

  it('sends the backend sort value when a sort option is applied', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-filter-button');
    await press(tree, 'filter-option-lowToHigh');
    await press(tree, 'filter-apply');
    expect(lastSearchPayload()).toMatchObject({ sortBy: 'lowToHigh' });
  });

  it('sends the price band bounds when a price band is applied', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-filter-button');
    await press(tree, 'filter-option-500-1000');
    await press(tree, 'filter-apply');
    expect(lastSearchPayload()).toMatchObject({ priceMin: 500, priceMax: 1000 });
  });

  it('keeps the applied selection when the sheet is reopened', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-filter-button');
    await press(tree, 'filter-option-lowToHigh');
    await press(tree, 'filter-apply');
    await press(tree, 'category-filter-button');
    expect(propOf(tree, 'filter-option-lowToHigh', 'accessibilityState')).toMatchObject(
      { selected: true },
    );
  });

  it('resets to the defaults when reset is pressed', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-filter-button');
    await press(tree, 'filter-option-lowToHigh');
    await press(tree, 'filter-apply');
    await press(tree, 'category-filter-button');
    await press(tree, 'filter-reset');
    await press(tree, 'filter-apply');
    expect(lastSearchPayload()).toMatchObject({
      sortBy: 'relevance',
      priceMin: 0,
      priceMax: 50000,
    });
  });

  it('marks the filter button as active only once a filter is applied', async () => {
    const tree = await renderScreen();
    expect(findHostByTestID(tree, 'category-filter-dot')).toHaveLength(0);
    await press(tree, 'category-filter-button');
    await press(tree, 'filter-option-lowToHigh');
    await press(tree, 'filter-apply');
    expect(findHostByTestID(tree, 'category-filter-dot')).toHaveLength(1);
  });

  it('searches by product name and shows a clear button that empties the term', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-search-toggle');
    const onChangeText = propOf(tree, 'category-search-input', 'onChangeText');
    await act(async () => {
      onChangeText('washer');
    });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(lastSearchPayload()).toMatchObject({ prName: 'washer' });

    await press(tree, 'category-search-clear');
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(lastSearchPayload()).toMatchObject({ prName: '' });
  });

  it('clears the search term when a different category is picked', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-search-toggle');
    const onChangeText = propOf(tree, 'category-search-input', 'onChangeText');
    await act(async () => {
      onChangeText('washer');
    });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    await press(tree, 'category-chip-102');
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(lastSearchPayload()).toMatchObject({ catId: 102, prName: '' });
  });

  it('shows how many results the current search matched', async () => {
    const tree = await renderScreen();
    await press(tree, 'category-search-toggle');
    const onChangeText = propOf(tree, 'category-search-input', 'onChangeText');
    await act(async () => {
      onChangeText('washer');
    });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(flatten(tree.toJSON()).join('\n')).toContain('2 results for "washer"');
  });

  it('names the missing term in the empty state', async () => {
    mockSearchProductsApi.mockImplementation(() =>
      Promise.resolve({ success: true, data: { items: [] } }),
    );
    const tree = await renderScreen();
    await press(tree, 'category-search-toggle');
    const onChangeText = propOf(tree, 'category-search-input', 'onChangeText');
    await act(async () => {
      onChangeText('nothing');
    });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(flatten(tree.toJSON()).join('\n')).toContain(
      'No products match "nothing"',
    );
    mockSearchProductsApi.mockImplementation(() =>
      Promise.resolve({ success: true, data: { items: PRODUCTS } }),
    );
  });
});
