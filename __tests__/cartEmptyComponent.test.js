import React from 'react';
import renderer from 'react-test-renderer';
import CartEmptyComponent from '../src/components/CartEmptyComponent';
import KshopeCartEmptyComponent from '../src/kshope/components/CartEmptyComponent';
import CartHeader from '../src/screens/cart/components/CartHeader';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 0, left: 0, right: 0 }),
}));

describe('CartEmptyComponent', () => {
  it('renders main CartEmptyComponent with header, title, subtitle and no_CART image', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(<CartEmptyComponent itemCount={0} />);
    });
    const json = JSON.stringify(tree.toJSON());

    // Header checks
    expect(json).toContain('My cart');
    expect(json).toContain('0 items added to your cart');
    // Ensure "Clear all" is NOT rendered when empty
    expect(json).not.toContain('Clear all');

    // Body content checks
    expect(json).toContain('Your cart is empty');
    expect(json).toContain('Add groceries and essentials to get them delivered fast');
    // Ensure "Shop Now" is NOT rendered by default to match screenshot
    expect(json).not.toContain('Shop Now');
  });

  it('renders Kshope CartEmptyComponent with title, subtitle and no_CART image', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(<KshopeCartEmptyComponent />);
    });
    const json = JSON.stringify(tree.toJSON());

    expect(json).toContain('Your cart is empty');
    expect(json).toContain('Add groceries and essentials to get them delivered fast');
    // Ensure "Oops!" is removed
    expect(json).not.toContain('Oops!');
    // Ensure "Shop Now" is NOT rendered by default to match screenshot
    expect(json).not.toContain('Shop Now');
  });

  it('CartHeader displays Clear all only when itemCount > 0', () => {
    let emptyHeader;
    renderer.act(() => {
      emptyHeader = renderer.create(<CartHeader itemCount={0} />);
    });
    expect(JSON.stringify(emptyHeader.toJSON())).not.toContain('Clear all');
    expect(JSON.stringify(emptyHeader.toJSON())).toContain('0 items added to your cart');

    let activeHeader;
    renderer.act(() => {
      activeHeader = renderer.create(<CartHeader itemCount={3} />);
    });
    expect(JSON.stringify(activeHeader.toJSON())).toContain('Clear all');
    expect(JSON.stringify(activeHeader.toJSON())).toContain('3 items added to your cart');
  });

  it('supports showShopNow prop when requested', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(<CartEmptyComponent showShopNow={true} />);
    });
    const json = JSON.stringify(tree.toJSON());

    expect(json).toContain('Shop Now');
  });
});
