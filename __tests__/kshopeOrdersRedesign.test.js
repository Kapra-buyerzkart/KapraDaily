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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
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
}));

const MyOrdersRedesignScreen =
  require('../src/kshope/screens/Order/redesign/MyOrdersRedesignScreen').default;
const {
  TRACKER_STEPS,
} = require('../src/kshope/screens/Order/redesign/data/selectors');

const renderScreen = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(<MyOrdersRedesignScreen />);
  });
  await act(async () => {});
  return tree;
};

const hostsWithTestID = (root, testID) =>
  root
    .findAllByProps({ testID })
    .filter(node => typeof node.type === 'string');

const countOf = (root, testID) => hostsWithTestID(root, testID).length;

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
    mockGetMyOrdersApi.mockClear();
  });

  it('shows the newest active order as the hero with a tracker', async () => {
    const tree = await renderScreen();

    const hero = hostsWithTestID(tree.root, 'order-hero')[0];
    const heroTexts = textsOf({ root: hero });
    expect(heroTexts).toContain('Out for Delivery');
    expect(heroTexts).toContain('JBL Bluetooth Headphones');
    expect(countOf(tree.root, 'order-tracker')).toBe(1);

    const trackerTexts = textsOf({
      root: hostsWithTestID(tree.root, 'order-tracker')[0],
    });
    TRACKER_STEPS.forEach(step => expect(trackerTexts).toContain(step));
  });

  it('renders the remaining active orders as cards and the rest under Recent Orders', async () => {
    const tree = await renderScreen();
    const texts = textsOf(tree);

    expect(countOf(tree.root, 'order-card')).toBe(1);
    expect(texts).toContain('Order Placed on, 01 jun 2026');
    expect(texts).toContain('Recent Orders');
    expect(countOf(tree.root, 'recent-order-row')).toBe(2);
  });

  it('partitions orders across the three tabs', async () => {
    const tree = await renderScreen();

    await pressTab(tree, 'delivered');
    expect(countOf(tree.root, 'recent-order-row')).toBe(1);
    expect(textsOf(tree)).toContain('Delivered');
    expect(countOf(tree.root, 'order-hero')).toBe(0);

    await pressTab(tree, 'cancelled');
    expect(countOf(tree.root, 'recent-order-row')).toBe(1);
    expect(textsOf(tree)).toContain('Cancelled');

    await pressTab(tree, 'active');
    expect(countOf(tree.root, 'order-hero')).toBe(1);
  });

  it('navigates to the details screen with the order and its first line item', async () => {
    const tree = await renderScreen();

    await act(async () => {
      tree.root.findByProps({ testID: 'order-hero-details' }).props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('KshopeMyOrderDetails', {
      order: ORDERS[0],
      selectedItem: {
        productName: 'JBL Bluetooth Headphones',
        featuredImage: 'a.png',
        orderId: 1,
        orderNumber: 'ORD-978-098',
      },
    });
  });
});
