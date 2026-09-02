import React from 'react';
import renderer, { act } from 'react-test-renderer';

const PRODUCTS = [
  {
    productId: 501,
    brandName: 'Samsung',
    prName: 'Washing Machine',
    specialPrice: 1499,
    unitPrice: 2499,
    featuredImage: 'media/washer.png',
  },
];

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSetSearchTerm = jest.fn();
const mockToggleWishlist = jest.fn();

let mockSearchState;

jest.mock('react-native-reanimated');

jest.mock('react-native-safe-area-context', () => {
  const RN = require('react-native');
  return {
    SafeAreaView: RN.View,
    useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify(['blender', 'lamp']))),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/kshope/hooks/useProductSearch', () => ({
  __esModule: true,
  default: () => mockSearchState,
}));

const mockProfile = { pincode: 10652 };

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({ profile: mockProfile }),
}));

const mockCart = { addresses: [], fetchAddresses: jest.fn() };

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => mockCart,
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({
    toggleWishlist: mockToggleWishlist,
    isInWishlist: () => false,
  }),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: () => Promise.resolve(10652),
  KSHOPE_KEYS: { RECENT_SEARCHES: 'kshope_recent_searches' },
}));

const SearchScreen = require('../src/kshope/screens/Search/SearchScreen').default;

const baseState = {
  searchTerm: '',
  setSearchTerm: mockSetSearchTerm,
  suggestions: [],
  loading: false,
  isLoadingMore: false,
  hasMore: false,
  loadMore: jest.fn(),
  resultCount: 0,
};

const renderScreen = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(<SearchScreen />);
  });
  return tree;
};

const byId = (tree, id) => tree.root.findByProps({ testID: id });

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchState = { ...baseState };
});

describe('kshope SearchScreen redesign', () => {
  it('keeps recent search chips wired to setSearchTerm', async () => {
    const tree = await renderScreen();
    await act(async () => {
      byId(tree, 'search-recent-chip-0').props.onPress();
    });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('blender');
  });

  it('keeps the clear button emptying the field', async () => {
    mockSearchState = { ...baseState, searchTerm: 'lamp', resultCount: 0 };
    const tree = await renderScreen();
    await act(async () => {
      byId(tree, 'search-clear-button').props.onPress();
    });
    expect(mockSetSearchTerm).toHaveBeenCalledWith('');
  });

  it('keeps result cards navigating to product details', async () => {
    mockSearchState = {
      ...baseState,
      searchTerm: 'washer',
      suggestions: PRODUCTS,
      resultCount: 1,
    };
    const tree = await renderScreen();
    const card = tree.root.findAllByType(
      require('../src/kshope/screens/Category/redesign/sections/ProductCard')
        .default,
    )[0];
    await act(async () => {
      card.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('KshopeProductDetails', {
      productId: 501,
      product: PRODUCTS[0],
    });
  });

  it('renders result cards at an even fixed width', async () => {
    mockSearchState = {
      ...baseState,
      searchTerm: 'washer',
      suggestions: [PRODUCTS[0], { ...PRODUCTS[0], productId: 502, prName: 'A very long product name that would wrap' }],
      resultCount: 2,
    };
    const tree = await renderScreen();
    const cards = tree.root.findAllByType(
      require('../src/kshope/screens/Category/redesign/sections/ProductCard')
        .default,
    );
    expect(cards).toHaveLength(2);
    expect(cards[0].props.width).toBe(cards[1].props.width);
    expect(cards[0].props.compact).toBe(true);
  });

  it('keeps the back control wired to goBack', async () => {
    const tree = await renderScreen();
    await act(async () => {
      byId(tree, 'search-back-button').props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
