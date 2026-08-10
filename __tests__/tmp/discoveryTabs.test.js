import React from 'react';
import renderer, { act } from 'react-test-renderer';
import CategoryDiscoverySection from '../../src/screens/home/components/CategoryDiscoverySection';

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('../../src/utils/haptics', () => ({ selectionTick: jest.fn() }));

const cats = [
  { catId: 1, catName: 'All Items' },
  { catId: 2, catName: 'Zepto Cafe' },
  { catId: 3, catName: 'Snacks & Drinks' },
];

test('renders folder tabs', () => {
  let tree;
  act(() => {
    tree = renderer.create(
      <CategoryDiscoverySection
        isHomeLoading={false}
        categoryDiscovery={{}}
        shouldShow
        discoveryCategories={cats}
        selectedDiscoveryCategory={cats[0]}
        onSelectCategory={() => {}}
        isDiscoveryLoading={false}
        discoveryProducts={[]}
        navigation={{ navigate: () => {} }}
      />,
    );
  });
  const labels = tree.root.findAllByType('Text').map(n => n.props.children);
  expect(JSON.stringify(labels)).toContain('Zepto Cafe');
});
