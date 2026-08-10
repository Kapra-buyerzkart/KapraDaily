export const homeKeys = {
  homepage: (areaId) => ['home', 'homepage', areaId ?? 'none'],
  generalSettings: () => ['home', 'generalSettings'],
  categoryProducts: (catId, areaId) => ['categoryProducts', catId, areaId ?? 'none'],
};

export const dashboardKeys = {
  dashboard: (custId) => ['dashboard', custId ?? 'guest'],
};

export const buyAgainKeys = {
  list: (custId, areaId) => ['buyAgain', custId ?? 'guest', areaId ?? 'none'],
};

export const searchKeys = {
  suggestions: (term, areaId) => ['search', 'suggestions', term, areaId ?? 'none'],
  categorySearch: (catId, areaId, sortBy, priceMin, priceMax) =>
    ['search', 'categorySearch', catId, areaId ?? 'none', sortBy, priceMin, priceMax],
};

export const productKeys = {
  related: (productId, areaId) => ['product', 'related', productId ?? 'none', areaId ?? 'none'],
};

export const myBookingsKeys = {
  vouchers: () => ['myBookings', 'vouchers'],
  events: () => ['myBookings', 'events'],
  eventDetail: (bookingId) => ['myBookings', 'eventDetail', bookingId ?? 'none'],
};
