import React from 'react';
import renderer from 'react-test-renderer';
import FeaturedRow from '../src/kshope/screens/Home/redesign/sections/FeaturedRow';

jest.mock('@candlefinance/faster-image', () => ({
  prefetch: jest.fn(),
}));

describe('FeaturedRow', () => {
  const dummyItems = [
    {
      id: 'd1',
      brand: 'Brand 1',
      name: 'Deal Product 1',
      price: '₹499',
      mrp: '₹999',
      discount: '50% OFF',
      image: { uri: 'https://example.com/p1.png' },
    },
    {
      id: 'd2',
      brand: 'Brand 2',
      name: 'Deal Product 2',
      price: '₹799',
      mrp: '₹1499',
      discount: '45% OFF',
      image: { uri: 'https://example.com/p2.png' },
    },
  ];

  it('renders correctly with given product items', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <FeaturedRow
          items={dummyItems}
          title="Top Deals"
          accent="48hr special"
          onPressProduct={jest.fn()}
          onToggleWishlist={jest.fn()}
          wishlisted={['d1']}
        />,
      );
    });

    const stringified = JSON.stringify(tree.toJSON());
    expect(stringified).toContain('Top Deals');
    expect(stringified).toContain('Deal Product 1');
    expect(stringified).toContain('Deal Product 2');
    expect(stringified).toContain('50% OFF');
  });
});
