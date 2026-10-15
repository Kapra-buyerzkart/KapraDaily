import React from 'react';
import renderer from 'react-test-renderer';
import FlashDealsSection from '../src/screens/home/components/modern/FlashDealsSection';

jest.mock('@/components/AnimatedPressable', () => 'AnimatedPressable');
jest.mock('@/components/CachedImage', () => 'CachedImage');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');

describe('FlashDealsSection', () => {
  const dummyItems = [
    {
      productId: 'p1',
      name: 'Product 1',
      subtitle: 'Sub 1',
      price: '199',
      mrp: '299',
      image: 'https://example.com/p1.png',
    },
    {
      productId: 'p2',
      name: 'Product 2',
      subtitle: 'Sub 2',
      price: '299',
      mrp: '399',
      image: 'https://example.com/p2.png',
    },
  ];

  it('renders correctly with given products', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <FlashDealsSection items={dummyItems} title="50% OFF" navigation={{ navigate: jest.fn() }} />,
      );
    });

    const stringified = JSON.stringify(tree.toJSON());
    expect(stringified).toContain('Flash loot sale');
    expect(stringified).toContain('50% OFF');
    expect(stringified).toContain('Product 1');
    expect(stringified).toContain('Product 2');
    expect(stringified).toContain('Offer ends in');

    renderer.act(() => {
      tree.unmount();
    });
  });

  it('returns null when items is empty', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <FlashDealsSection items={[]} title="50% OFF" navigation={{ navigate: jest.fn() }} />,
      );
    });
    expect(tree.toJSON()).toBeNull();
  });
});
