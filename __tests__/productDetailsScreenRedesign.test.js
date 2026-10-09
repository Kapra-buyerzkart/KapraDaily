import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockProduct = {
  productId: 101,
  prName: 'Lays chile lemon flavor',
  unitPrice: 35000,
  specialPrice: 10020,
  discountPercentage: 20,
  stockQty: 50,
  isAvailable: true,
  bTokenValue: 10.6,
  shortDescription: 'Crispy potato chips with zesty chile and lemon seasoning.',
  description: 'Full product details text for Lays chile lemon flavor.',
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-device-info', () => ({
  getVersion: () => '1.0.0',
  getBuildNumber: () => '1',
  getModel: () => 'iPhone',
}));

jest.mock('../src/components/SelectedProducts', () => () => null);
jest.mock('../src/components/LocationModal', () => () => null);
jest.mock('../src/components/StoreUnavailable', () => () => null);

jest.mock('../src/context/appContext', () => {
  const React2 = require('react');
  return {
    AppContext: React2.createContext({
      isStoreUnavailable: false,
      storeUnavailableData: null,
    }),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
  SafeAreaView: ({ children }) => children,
}));

const mockNavigate = jest.fn();
const mockPush = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  createNavigationContainerRef: () => ({
    isReady: () => false,
  }),
  useNavigation: () => ({
    navigate: mockNavigate,
    push: mockPush,
    goBack: mockGoBack,
  }),
  useRoute: () => ({ params: { productId: 101, product: mockProduct } }),
}));

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  SHORT: 0,
}));

jest.mock('react-native-svg', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const Component = props => React2.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: Component,
    Svg: Component,
    Path: Component,
    Circle: Component,
    Rect: Component,
    G: Component,
  };
});

const mockAddToCart = jest.fn();
const mockToggleWishlist = jest.fn();

jest.mock('../src/context/WishlistContext', () => ({
  useWishlist: () => ({
    isInWishlist: () => false,
    toggleWishlist: mockToggleWishlist,
  }),
  useWishlistActions: () => ({
    toggleWishlist: mockToggleWishlist,
  }),
  useIsItemWishlisted: () => false,
  useIsWishlisted: () => false,
}));

jest.mock('../src/context/CartContext', () => ({
  useCart: () => ({
    cartItems: [],
    addToCart: mockAddToCart,
    changeCartItemQuantity: jest.fn(),
    removeFromCart: jest.fn(),
  }),
  useCartActions: () => ({
    addToCart: mockAddToCart,
    changeCartItemQuantity: jest.fn(),
    removeFromCart: jest.fn(),
  }),
  useCartEntry: () => ({ quantity: 0, cartItemId: null }),
}));

jest.mock('../src/hooks/useProductDetails', () => ({
  useProductDetails: () => ({
    loading: false,
    product: mockProduct,
    images: [{ uri: 'https://example.com/lays.png' }],
    attributes: [
      { attrName: 'Brand', attrValue: "Lay's" },
      { attrName: 'Manufacturer', attrValue: 'PepsiCo' },
      { attrName: 'Country of Origin', attrValue: 'India' },
    ],
    productImage: { uri: 'https://example.com/lays.png' },
    productName: 'Lays chile lemon flavor',
    productDescription: 'Crispy potato chips with zesty chile and lemon seasoning.',
    shortDescription: 'Crispy potato chips with zesty chile and lemon seasoning.',
    unitPrice: 35000,
    specialPrice: 10020,
    discountPercentage: 20,
    stockQty: 50,
    isAvailable: true,
    bTokenValue: 10.6,
    productId: 101,
    relatedProducts: [
      {
        productId: 201,
        name: 'Sprite 12 FL OZ (355ml)',
        price: 100,
        mrp: 350,
      },
    ],
    relatedLoading: false,
  }),
}));

const ProductDetailsScreen = require('../src/screens/ProductDetailsScreen').default;

const extractText = node => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(extractText);
  return extractText(node.children);
};

describe('ProductDetailsScreen Redesign', () => {
  it('renders title, price, discount badge, token count, feature specs, and sections', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(React.createElement(ProductDetailsScreen));
    });

    const allText = extractText(tree.toJSON()).join(' ');

    // 1. Title & Discount
    expect(allText).toContain('Lays chile lemon flavor');
    expect(allText).toContain('20% OFF');

    // 2. Price and Token Pill
    expect(allText).toContain('₹10,020/-');
    expect(allText).toContain('10.6 tokens');

    // 3. Three Specification Badges
    expect(allText).toContain("Lay's");
    expect(allText).toContain('PepsiCo');
    expect(allText).toContain('India');

    // 4. CTA Button
    expect(allText).toContain('Add to cart');

    // 5. Product Details Section
    expect(allText).toContain('Product Details');

    // 6. Similar Products Section
    expect(allText).toContain('Similar Products');
    expect(allText).toContain('Fresh deals, exclusive savings & more');

    // 7. SOMETHING SPECIAL Deals & Offers Section
    expect(allText).toContain('SOMETHING SPECIAL');
    expect(allText).toContain('The Pantry Collection');
  });

  it('renders BrandIcon, ManufacturerIcon, and CountryOriginIcon using the imported SVGs', () => {
    const {
      BrandIcon,
      ManufacturerIcon,
      CountryOriginIcon,
    } = require('../src/screens/product/components/ProductDetailIcons');

    let brandTree;
    let boxTree;
    let countriesTree;

    act(() => {
      brandTree = renderer.create(<BrandIcon size={38} />);
      boxTree = renderer.create(<ManufacturerIcon size={38} />);
      countriesTree = renderer.create(<CountryOriginIcon size={38} />);
    });

    expect(brandTree.toJSON()).toBeTruthy();
    expect(boxTree.toJSON()).toBeTruthy();
    expect(countriesTree.toJSON()).toBeTruthy();
  });
});

