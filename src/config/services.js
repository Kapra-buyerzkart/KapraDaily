// Configuration-driven service list for the Service Switcher modal.
// Add a new service here and it renders automatically — no UI changes needed.

export const SERVICE_TYPES = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
};

export const SERVICES = [
  {
    id: 'quickCommerce',
    title: 'Quick Commerce',
    description: 'Groceries & daily essentials',
    type: SERVICE_TYPES.INTERNAL,
    route: 'Home',
    params: { screen: 'HomeScreen' },
    icon: 'cart-outline',
    iconColor: '#F25000',
  },
  {
    id: 'movie',
    title: 'Movie Tickets',
    description: 'Book movie tickets instantly',
    type: SERVICE_TYPES.INTERNAL,
    route: 'TicketSplashScreen',
    icon: 'film-outline',
    iconColor: '#5B2BE0',
  },
  {
    id: 'partner',
    title: 'Partner App',
    description: 'Open external application',
    type: SERVICE_TYPES.EXTERNAL,
    deeplink: 'udmv://',
    storeUrl: {
      ios: 'https://apps.apple.com/in/app/uden-deal/id6448085736',
      android: 'https://play.google.com/store/apps/details?id=com.kshope',
    },
    icon: 'apps-outline',
    iconColor: '#00BCD4',
  },
];

export const LAST_SELECTED_SERVICE_KEY = 'lastSelectedServiceId';
