export const DEALS48_ROUTES = {
  HOME: 'Deals48Home',
  SEARCH: 'Deals48Search',
  PRODUCT_DETAILS: 'Deals48ProductDetails',
  PRODUCT_CATEGORY: 'Deals48ProductCategory',
  CART: 'Deals48Cart',
  PROFILE: 'Deals48Profile',
} as const;

export type Deals48Route = (typeof DEALS48_ROUTES)[keyof typeof DEALS48_ROUTES];
