export const DEALS48_ROUTES = {
  HOME: 'Deals48Home',
  SEARCH: 'Deals48Search',
  PRODUCT_DETAILS: 'Deals48ProductDetails',
  PRODUCT_CATEGORY: 'Deals48ProductCategory',
  CART: 'Deals48Cart',
  PROFILE: 'Deals48Profile',
  ADD_LOCATION: 'Deals48AddLocation',
  ORDER_SUCCESS: 'Deals48OrderSuccess',
  ORDER_FAILED: 'Deals48OrderFailed',
  ORDER_PENDING: 'Deals48OrderPending',
  MY_ORDERS: 'Deals48MyOrders',
  MY_ORDER_DETAILS: 'Deals48MyOrderDetails',
} as const;

export type Deals48Route = (typeof DEALS48_ROUTES)[keyof typeof DEALS48_ROUTES];
