// Every route this module owns is prefixed.
//
// This is not cosmetic. React Navigation resolves an unknown route name by
// bubbling it up to the parent navigator, and the host app already has screens
// called `ProductDetailsScreen`, `SearchScreen` and `Cart`. Without a prefix, a
// tap inside 48hrs would quietly land on KapraDaily's equivalent screen and ask
// core.kapradaily.com for an id that only exists in kshopecore — a wrong-data
// bug with no error to point at.
export const DEALS48_ROUTES = {
  HOME: 'Deals48Home',
  SEARCH: 'Deals48Search',
  PRODUCT_DETAILS: 'Deals48ProductDetails',
  PRODUCT_CATEGORY: 'Deals48ProductCategory',
  CART: 'Deals48Cart',
  PROFILE: 'Deals48Profile',
} as const;

export type Deals48Route = (typeof DEALS48_ROUTES)[keyof typeof DEALS48_ROUTES];
