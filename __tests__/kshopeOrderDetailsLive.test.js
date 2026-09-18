import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: () => true,
    dispatch: jest.fn(),
    push: jest.fn(),
  }),
  useRoute: () => ({
    params: { orderId: '1001' },
  }),
  useFocusEffect: cb => {
    const ReactRuntime = require('react');
    ReactRuntime.useEffect(() => cb(), [cb]);
  },
  CommonActions: {
    reset: jest.fn(),
  },
}));

jest.mock('../src/kshope/context/UserContext', () => ({
  useUser: () => ({
    profile: {
      name: 'Priya Sharma',
      mobile: '9876543210',
      email: 'priya@example.com',
    },
  }),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => ({
    cartCount: 2,
    refreshCart: jest.fn(),
  }),
}));

jest.mock('../src/kshope/context/loaderContext', () => {
  const ReactRuntime = require('react');
  return {
    LoaderContext: ReactRuntime.createContext({
      showLoader: jest.fn(),
    }),
  };
});

const mockOrderDetailsData = {
  header: {
    orderId: 1001,
    orderNumber: '978086',
    orderStatus: 'shipped',
    orderStatusText: 'Arriving Today by 8:00pm',
    orderDate: '2026-06-01T10:00:00Z',
    subtotal: 162899,
    discountTotal: 890,
    totalSavings: 888,
    deliveryCharge: 0,
    taxTotal: 5,
    grandTotal: 162899,
    invoiceNumber: 'INV 2026-27 / 004678',
    canCancel: false,
  },
  items: [
    {
      orderItemId: 501,
      productName: 'Classy Knot Diamond Ring',
      specifications: '14 KT Yellow Gold • 0.66 ct • Size 12',
      unitPrice: 162899,
      lineTotal: 162899,
      mrp: 163778,
      featuredImage: 'ring.png',
    },
    {
      orderItemId: 502,
      productName: 'Vintage Inspired Ring',
      unitPrice: 30249,
      lineTotal: 30249,
      featuredImage: 'vintage.png',
    },
  ],
  shippingAddress: {
    custName: 'Justin Philip',
    phone: '9745879080',
    addLine1: 'Flat 4B, Emerald Towers',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682001',
  },
  payments: [
    {
      paymentMethod: 'Online payment',
      paymentStatus: 'success',
      paymentAmount: 162899,
    },
  ],
};

const mockGetOrderDetailsApi = jest.fn(() =>
  Promise.resolve({ success: true, data: mockOrderDetailsData }),
);

jest.mock('../src/kshope/api/services/orderService', () => ({
  getOrderDetailsApi: (...args) => mockGetOrderDetailsApi(...args),
  cancelOrderApi: jest.fn(() => Promise.resolve({ success: true })),
  reorderApi: jest.fn(() => Promise.resolve({ success: true })),
  returnOrderItemApi: jest.fn(() => Promise.resolve({ success: true })),
  rateOrderApi: jest.fn(() => Promise.resolve({ success: true })),
  rateDeliveryAgentApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('react-native-razorpay', () => ({
  open: jest.fn(),
}));

jest.mock('../src/kshope/hooks/useInvoiceDownload', () => ({
  useInvoiceDownload: () => ({
    downloading: false,
    canDownload: true,
    downloadInvoice: jest.fn(),
  }),
}));

const MyOrderDetailsScreen =
  require('../src/kshope/screens/Order/MyOrderDetailsScreen').default;

const renderScreen = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(<MyOrderDetailsScreen />);
  });
  await act(async () => {});
  return tree;
};

const textsOf = tree =>
  tree.root
    .findAllByType('Text')
    .map(node => node.children.filter(c => typeof c === 'string').join(''))
    .filter(Boolean);

describe('MyOrderDetailsScreen Live API Mapping', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    mockGetOrderDetailsApi.mockClear();
  });

  it('renders primary product details and specs from live API data', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts).toContain('Classy Knot Diamond Ring');
    expect(texts).toContain('14 KT Yellow Gold • 0.66 ct • Size 12');
    expect(texts).toContain('₹1,62,899');
    expect(texts).toContain('₹1,63,778');
    expect(texts.some(t => t.includes('You save ₹879') || t.includes('OFF'))).toBe(true);
  });

  it('renders Order Summary breakdown accurately without dummy fallbacks', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts).toContain('Order Summary');
    expect(texts).toContain('Item Total');
    expect(texts).toContain('FREE');
    expect(texts).toContain('Item discount');
    expect(texts).toContain('- ₹ 890/-');
    expect(texts).toContain('To pay');
    expect(texts.some(t => t.includes('inclusive of GST'))).toBe(true);
    expect(texts.some(t => t.includes('You saved ₹ 888/- on this order'))).toBe(true);
  });

  it('renders Payment details and View invoice cards', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts).toContain('Payment details');
    expect(texts).toContain('Online payment');
    expect(texts).toContain('Paid successfully');
    expect(texts).toContain('View invoice');
    expect(texts.some(t => t.includes('INV 2026-27 / 004678'))).toBe(true);
  });

  it('renders Delivery To card with customer info', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts).toContain('Delivery To');
    expect(texts).toContain('Justin Philip');
    expect(texts).toContain('+91 9745879080');
    expect(texts.some(t => t.includes('Emerald Towers'))).toBe(true);
    expect(texts).toContain('Item price');
  });

  it('renders multi-item group orders dynamically', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts.some(t => t.includes('Group Order Placed on'))).toBe(true);
    expect(texts).toContain('Vintage Inspired Ring');
    expect(texts).toContain('Status');
    expect(texts).toContain('₹ 30,249/-');
  });
});
