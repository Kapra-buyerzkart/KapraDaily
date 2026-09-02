import React from 'react';
import renderer, { act } from 'react-test-renderer';

const WISHLIST_PAYLOAD = {
  success: true,
  data: { items: [{ productId: 501, prName: 'Gas Stove' }] },
};

jest.mock('../src/kshope/api/services/wishlistService', () => ({
  getWishlistApi: jest.fn(() => Promise.resolve(WISHLIST_PAYLOAD)),
  addToWishlistApi: jest.fn(() => Promise.resolve({ success: true })),
  removeFromWishlistApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

const {
  WishlistProvider,
  useWishlist,
} = require('../src/kshope/context/WishlistContext');

let api = null;

const Probe = () => {
  api = useWishlist();
  return null;
};

const mount = async () => {
  await act(async () => {
    renderer.create(
      React.createElement(WishlistProvider, null, React.createElement(Probe)),
    );
  });
};

describe('wishlist id matching', () => {
  beforeEach(async () => {
    api = null;
    await mount();
  });

  it('matches an api-stored numeric id against a string lookup', () => {
    expect(api.isInWishlist(501)).toBe(true);
    expect(api.isInWishlist('501')).toBe(true);
  });

  it('does not match a different id', () => {
    expect(api.isInWishlist('502')).toBe(false);
  });

  it('removes an entry looked up with the other id type', async () => {
    await act(async () => {
      await api.removeFromWishlist('501');
    });
    expect(api.isInWishlist(501)).toBe(false);
  });

  it('does not add a duplicate when the id types differ', async () => {
    await act(async () => {
      await api.addToWishlist({ productId: '501', prName: 'Gas Stove' });
    });
    expect(api.wishlistItems).toHaveLength(1);
  });
});
