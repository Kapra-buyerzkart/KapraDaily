import React from 'react';
import renderer, { act } from 'react-test-renderer';

const ORDERS = [
  {
    orderId: 1,
    orderNumber: 'ORD-978-098',
    orderStatusText: 'Out for Delivery',
    orderDate: '2026-06-05',
    grandTotal: 30249,
    items: [{ productName: 'JBL Bluetooth Headphones', featuredImage: 'a.png' }],
  },
  {
    orderId: 2,
    orderNumber: 'ORD-978-099',
    orderStatusText: 'Your Order is Being Shipped',
    orderDate: '2026-06-01',
    grandTotal: 1200,
    items: '[{"productName":"Gas Stove","featuredImage":"b.png"}]',
  },
  {
    orderId: 3,
    orderNumber: 'ORD-978-100',
    orderStatusText: 'Delivered',
    orderDate: '2025-05-18',
    grandTotal: 2899,
    items: [{ productName: 'JBL Speakers', featuredImage: 'c.png' }],
  },
  {
    orderId: 4,
    orderNumber: 'ORD-978-101',
    orderStatusText: 'Cancelled',
    orderDate: '2025-05-18',
    grandTotal: 2899,
    items: [{ productName: 'JBL Speakers', featuredImage: 'c.png' }],
  },
];

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: () => true,
  }),
  useFocusEffect: cb => {
    const ReactRuntime = require('react');
    ReactRuntime.useEffect(() => cb(), [cb]);
  },
}));

const mockGetMyOrdersApi = jest.fn(() =>
  Promise.resolve({ success: true, data: ORDERS }),
);

jest.mock('../src/kshope/api/services/orderService', () => ({
  getMyOrdersApi: (...args) => mockGetMyOrdersApi(...args),
  reorderApi: jest.fn(() => Promise.resolve({ success: true })),
}));

const MyOrdersRedesignScreen =
  require('../src/kshope/screens/Order/redesign/MyOrdersRedesignScreen').default;

const renderScreen = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(<MyOrdersRedesignScreen />);
  });
  await act(async () => {});
  return tree;
};

const textsOf = tree =>
  tree.root
    .findAllByType('Text')
    .map(node => node.children.filter(c => typeof c === 'string').join(''))
    .filter(Boolean);

const pressTab = async (tree, key) => {
  await act(async () => {
    tree.root.findByProps({ testID: `order-tab-${key}` }).props.onPress();
  });
};

describe('MyOrdersRedesignScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    mockGetMyOrdersApi.mockClear();
  });

  it('renders screen title, subtitle, and summary metrics', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts).toContain('My Orders');
    expect(texts).toContain('Your treasures, our care');
    expect(texts).toContain('Total Orders');
    expect(texts).toContain('Active Orders');
    expect(texts).toContain('Delivered');
  });

  it('renders all orders in the list under the default tab', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(texts).toContain('JBL Bluetooth Headphones');
    expect(texts).toContain('Gas Stove');
    expect(texts).toContain('JBL Speakers');

    expect(tree.root.findByProps({ testID: 'order-card-1' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'order-card-2' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'order-card-3' })).toBeTruthy();
    expect(tree.root.findByProps({ testID: 'order-card-4' })).toBeTruthy();
  });

  it('filters orders when switching tabs', async () => {
    const tree = await renderScreen();

    await pressTab(tree, 'delivered');
    let texts = textsOf(tree);
    expect(texts.some(t => t.includes('ORD-978-100'))).toBe(true);
    expect(texts.some(t => t.includes('ORD-978-098'))).toBe(false);
    expect(texts.some(t => t.includes('ORD-978-101'))).toBe(false);

    await pressTab(tree, 'cancelled');
    texts = textsOf(tree);
    expect(texts.some(t => t.includes('ORD-978-101'))).toBe(true);
    expect(texts.some(t => t.includes('ORD-978-098'))).toBe(false);
    expect(texts.some(t => t.includes('ORD-978-100'))).toBe(false);
  });

  it('navigates to details screen with order and selected item when an order card is pressed', async () => {
    const tree = await renderScreen();

    await act(async () => {
      tree.root.findByProps({ testID: 'order-card-1' }).props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('KshopeMyOrderDetails', {
      orderId: 1,
      order: ORDERS[0],
      selectedItem: {
        productName: 'JBL Bluetooth Headphones',
        featuredImage: 'a.png',
        orderId: 1,
        orderNumber: 'ORD-978-098',
      },
    });
  });

  it('navigates back and to search from header buttons', async () => {
    const tree = await renderScreen();

    await act(async () => {
      tree.root.findByProps({ testID: 'orders-back' }).props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);

    await act(async () => {
      tree.root.findByProps({ testID: 'orders-search' }).props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('KshopeSearch');
  });
});
