const mockGet = jest.fn(async () => ({ success: true, data: [] }));
const mockPost = jest.fn(async () => ({ success: true, data: [] }));

jest.mock('../src/kshope/api/client', () => ({
  get: (...args) => mockGet(...args),
  post: (...args) => mockPost(...args),
}));

const products = require('../src/kshope/api/services/productService');
const categories = require('../src/kshope/api/services/categoryService');
const wishlist = require('../src/kshope/api/services/wishlistService');
const home = require('../src/kshope/api/services/homeService');

beforeEach(() => {
  mockGet.mockClear();
  mockPost.mockClear();
});

test('product details requests the product route with the area id', async () => {
  await products.getProductDetails(42, 207);
  expect(mockGet).toHaveBeenCalledWith('product/42', { params: { pincodeAreaId: 207 } });
});

test('related products requests the related route', async () => {
  await products.getRelatedProductsApi(42, 207);
  expect(mockGet.mock.calls[0][0]).toBe('product/42/related');
});

test('search posts to product/search', async () => {
  await products.searchProductsApi({ term: 'shoes' });
  expect(mockPost).toHaveBeenCalledWith('product/search', { term: 'shoes' });
});

test('suggestions degrade to an empty result set instead of throwing', async () => {
  mockGet.mockImplementationOnce(async () => ({ status: 'SERVER_ERROR' }));
  const result = await products.getProductSuggestionsApi('shoes', 207);
  expect(result).toEqual({ success: true, data: [] });
});

test('suggestions swallow a rejected request', async () => {
  mockGet.mockImplementationOnce(async () => { throw new Error('network'); });
  await expect(products.getProductSuggestionsApi('shoes', 207)).resolves.toEqual({ success: true, data: [] });
});

test('categories request the list route', async () => {
  await categories.getCategoriesApi('1');
  expect(mockGet).toHaveBeenCalledWith('categories/list', { params: { parentCatId: '1' } });
});

test('wishlist add posts the product id', async () => {
  await wishlist.addToWishlistApi(42);
  expect(mockPost).toHaveBeenCalledWith('wishlist/add', { productId: 42 });
});

test('wishlist remove posts to the delete route with no body', async () => {
  await wishlist.removeFromWishlistApi(42);
  expect(mockPost).toHaveBeenCalledWith('wishlist/delete/42');
});

test('wishlist list requests the area-scoped list route', async () => {
  await wishlist.getWishlistApi(207);
  expect(mockGet).toHaveBeenCalledWith('wishlist/list', { params: { pincodeAreaId: 207 } });
});

test('getHomepageData requests the homepage route with area id and blocksize', async () => {
  await home.getHomepageData(207, 50);
  expect(mockGet).toHaveBeenCalledWith('homepage', { params: { pincodeAreaId: 207, blocksize: 50 } });
});

test('getCategoryProducts requests the categoryproducts route', async () => {
  await home.getCategoryProducts(9, 207);
  expect(mockGet).toHaveBeenCalledWith('homepage/categoryproducts', { params: { catId: 9, pincodeAreaId: 207 } });
});

test('no browse service imports the host network layer', () => {
  const fs = require('fs');
  const path = require('path');
  ['homeService.ts', 'categoryService.ts', 'productService.ts', 'wishlistService.ts'].forEach(file => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/api/services', file), 'utf8');
    expect(src).not.toMatch(/api\/networkUtils/);
    expect(src).toMatch(/from '\.\.\/client'/);
  });
});
