import React from 'react';
import renderer, { act } from 'react-test-renderer';

const PRODUCT_PAYLOAD = {
  success: true,
  data: {
    product: {
      productId: 501,
      prName: "Blueberry's Gas Stove - Glint 2b",
      unitPrice: 7290,
      specialPrice: 3479,
      stockQty: 12,
    },
    images: [{ imageUrl: 'media/stove1.png' }],
    attributes: [],
    ratingSummary: { avgRating: 0, ratingCount: 0, reviewCount: 0 },
    customerspecific: { cartQty: 0 },
  },
};

// Stable identity: a fresh payload object each call would make the focus
// effect re-set state on every render.
const RELATED_PAYLOAD = { success: true, data: { items: [] } };

var mockWishlistStore = { items: [] };

jest.mock('react-native-simple-toast', () => ({ show: jest.fn(), SHORT: 0 }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn(), push: jest.fn() }),
  useIsFocused: () => true,
  useRoute: () => ({ params: { productId: 501 } }),
  useFocusEffect: effect => {
    const React2 = require('react');
    React2.useEffect(() => effect(), [effect]);
  },
}));

jest.mock('../src/kshope/api/services/productService', () => ({
  getProductDetails: jest.fn(() => Promise.resolve(PRODUCT_PAYLOAD)),
  getRelatedProductsApi: jest.fn(() => Promise.resolve(RELATED_PAYLOAD)),
}));

jest.mock('../src/kshope/api/services/cartService', () => ({
  addToCartApi: jest.fn(() => Promise.resolve({ success: true })),
  updateCartItemApi: jest.fn(() => Promise.resolve({ success: true })),
  removeFromCartApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => ({ cartItems: [], cartSummary: {}, loadCart: jest.fn() }),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({
    toggleWishlist: jest.fn(),
    // Mirrors the real context: ids are compared as strings, so the screen
    // must not depend on whether the store holds a number or a string.
    isInWishlist: itemId =>
      mockWishlistStore.items.some(
        entry => String(entry.productId ?? entry.id) === String(itemId),
      ),
  }),
}));

jest.mock('../src/kshope/components/FloatingCartButton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
});

// Identify which heart glyph rendered, not just what colour it was tinted.
jest.mock('../src/kshope/screens/Product/redesign/icons', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const stub = testID => props =>
    React2.createElement(View, { ...props, testID });
  return {
    BackIcon: stub('back'),
    ShareIcon: stub('share'),
    CartIcon: stub('cart'),
    ChevronIcon: stub('chevron'),
    HeartIcon: stub('heart-outline'),
    HeartOutlineIcon: stub('heart-outline'),
    HeartSolidIcon: stub('heart-solid'),
  };
});

jest.mock('react-native-svg', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const Stub = props => React2.createElement(View, props, props.children);
  return { __esModule: true, default: Stub, Svg: Stub, Path: Stub };
});

const ProductDetailsRedesignScreen =
  require('../src/kshope/screens/Product/redesign/ProductDetailsRedesignScreen')
    .default;

const hasTestID = (node, testID) => {
  if (!node || typeof node !== 'object') return false;
  if (Array.isArray(node)) return node.some(child => hasTestID(child, testID));
  if (node.props?.testID === testID) return true;
  return hasTestID(node.children, testID);
};

const render = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(ProductDetailsRedesignScreen));
  });
  return tree;
};

describe('product details wishlist state', () => {
  afterEach(() => {
    mockWishlistStore.items = [];
  });

  it('renders the solid heart when the product id is stored as a number', async () => {
    mockWishlistStore.items = [{ productId: 501 }];
    const tree = await render();
    expect(hasTestID(tree.toJSON(), 'heart-solid')).toBe(true);
  });

  it('renders the solid heart when the product id is stored as a string', async () => {
    mockWishlistStore.items = [{ productId: '501' }];
    const tree = await render();
    expect(hasTestID(tree.toJSON(), 'heart-solid')).toBe(true);
  });

  it('renders the outline heart when the product is not wishlisted', async () => {
    const tree = await render();
    expect(hasTestID(tree.toJSON(), 'heart-solid')).toBe(false);
    expect(hasTestID(tree.toJSON(), 'heart-outline')).toBe(true);
  });
});
