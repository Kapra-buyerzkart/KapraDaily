// Configuration-driven service list for the Service Switcher modal.
// Add a new service here and it renders automatically — no UI changes needed.

export const SERVICE_TYPES = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
};

export const SERVICES = [
  {
    id: 'partner',
    title: '48hrs Deals',
    description: 'Electronics, kitchen Appliances \n & More',
    type: SERVICE_TYPES.EXTERNAL,
    deeplink: 'udmv://',
    storeUrl: {
      ios: 'https://apps.apple.com/in/app/uden-deal/id6448085736',
      android: 'https://play.google.com/store/apps/details?id=com.kshope',
    },
    icon: 'apps-outline',
    iconColor: '#00BCD4',
    logo: require('../assets/images/modal/48hrDealIcon.png'),
    titleImage: require('../assets/images/modal/48hrImage.png'),
  },
  {
    id: 'movie',
    title: 'Movie Tickets',
    description: 'Movies & Entertainments',
    type: SERVICE_TYPES.INTERNAL,
    route: 'TicketSplashScreen',
    icon: 'film-outline',
    iconColor: '#5B2BE0',
    logo: require('../assets/images/modal/movieIcon.png'),
    titleImage: require('../assets/images/modal/udentcketModal.png'),
  },

  {
    id: 'quickCommerce',
    title: 'D2C',
    description: 'Groceries & daily essentials',
    type: SERVICE_TYPES.INTERNAL,
    route: 'D2cScreen',
    // params: { screen: 'HomeScreen' },
    icon: 'cart-outline',
    iconColor: '#F25000',
    logo: require('../assets/images/modal/d2cicon.png'),
    titleImage: require('../assets/images/modal/D2C.png'),
    // badge: 'Coming Soon',
    comingSoon: false,
  },
];

export const LAST_SELECTED_SERVICE_KEY = 'lastSelectedServiceId';
