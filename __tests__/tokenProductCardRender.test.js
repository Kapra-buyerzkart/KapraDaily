import React from 'react';
import renderer, { act } from 'react-test-renderer';
import TokenProductCard from '../src/components/TokenProductCard';

const mockAddToCart = jest.fn();
const mockChangeQty = jest.fn();
const mockToggleWishlist = jest.fn();

jest.mock('@/context/CartContext', () => ({
  useCartActions: () => ({
    addToCart: mockAddToCart,
    changeCartItemQuantity: mockChangeQty,
  }),
  useCartEntry: () => ({ quantity: 0, cartItemId: undefined }),
}));

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  SHORT: 0,
}));

jest.mock('@/context/WishlistContext', () => ({
  useWishlistActions: () => ({
    toggleWishlist: mockToggleWishlist,
  }),
  useIsWishlisted: () => false,
}));

jest.mock('react-native-reanimated', () => {
  const React2 = require('react');
  const { View, Text: RNText, Image: RNImage } = require('react-native');
  const passthrough = Component =>
    React2.forwardRef((props, ref) =>
      React2.createElement(Component, { ...props, ref }, props.children),
    );
  return {
    __esModule: true,
    default: new Proxy(
      {
        View: passthrough(View),
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
    Text: passthrough(RNText),
    makeMutable: value => ({ value }),
    useSharedValue: value => ({ value }),
    useAnimatedStyle: () => ({}),
    withSequence: (...v) => v[0],
    withSpring: v => v,
    withTiming: v => v,
  };
});

jest.mock('@/components/AnimatedPressable', () => {
  const React2 = require('react');
  const { TouchableOpacity } = require('react-native');
  return React2.forwardRef((props, ref) =>
    React2.createElement(TouchableOpacity, { ...props, ref }, props.children),
  );
});

jest.mock('@/components/CachedImage', () => 'CachedImage');
jest.mock('@/components/ShimmerPlaceholder', () => 'ShimmerPlaceholder');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/Entypo', () => 'Entypo');

describe('TokenProductCard Redesign', () => {
  const sampleProduct = {
    productId: 'prod-101',
    name: 'Lays chile lemon',
    subtitle: 'officia deserunt',
    price: 20,
    mrp: 35,
    offer: '20% OFF',
    featuredImage: 'media/lays.png',
  };

  it('renders UD Coins pill, wishlist button, title, subtitle, price with /- suffix, discount, and Add to cart button', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <TokenProductCard item={sampleProduct} />
      );
    });

    const root = tree.root;

    // UD Coins text
    const coinBadge = root.findAll(node => node.props?.children === 'UD Coins');
    expect(coinBadge.length).toBeGreaterThan(0);

    // Title
    const title = root.findAll(node => node.props?.children === 'Lays chile lemon');
    expect(title.length).toBeGreaterThan(0);

    // Subtitle
    const subtitle = root.findAll(node => node.props?.children === 'officia deserunt');
    expect(subtitle.length).toBeGreaterThan(0);

    // Price with /- suffix
    const priceText = root.findAll(node => node.props?.children && String(node.props.children).includes('₹20/-'));
    expect(priceText.length).toBeGreaterThan(0);

    // MRP with /- suffix
    const mrpText = root.findAll(node => node.props?.children && String(node.props.children).includes('₹ 35/-'));
    expect(mrpText.length).toBeGreaterThan(0);

    // Discount badge
    const discountText = root.findAll(node => node.props?.children === '20% OFF');
    expect(discountText.length).toBeGreaterThan(0);

    // Add to cart button
    const addButton = root.findByProps({ accessibilityLabel: 'Add Lays chile lemon to cart' });
    expect(addButton).toBeDefined();

    const addText = root.findAll(node => node.props?.children === 'Add to cart');
    expect(addText.length).toBeGreaterThan(0);
  });

  it('renders correctly with long titles, decimal prices, and 3-column mode without crashing', () => {
    const longProduct = {
      productId: 'prod-102',
      name: 'Britannia Good Day Cashew Cookies Rich Butter Delight',
      price: 137.5,
      mrp: 275,
      featuredImage: 'media/goodday.png',
    };

    let tree;
    act(() => {
      tree = renderer.create(
        <TokenProductCard item={longProduct} isThreeColumn={true} />
      );
    });

    const root = tree.root;

    // Title should render with 2 numberOfLines
    const title = root.findAll(
      node =>
        node.props?.children ===
        'Britannia Good Day Cashew Cookies Rich Butter Delight',
    );
    expect(title.length).toBeGreaterThan(0);
    expect(title[0].props.numberOfLines).toBe(2);

    // Decimal price
    const priceText = root.findAll(
      node => node.props?.children === '₹137.50/-',
    );
    expect(priceText.length).toBeGreaterThan(0);

    // MRP
    const mrpText = root.findAll(
      node => node.props?.children === '₹ 275/-',
    );
    expect(mrpText.length).toBeGreaterThan(0);

    // Calculated 50% OFF discount
    const discountText = root.findAll(
      node => node.props?.children === '50% OFF',
    );
    expect(discountText.length).toBeGreaterThan(0);
  });
});
