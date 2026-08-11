export const SERVICE_TYPES = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
};

export const SERVICES = [
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
    id: 'quickDelivery',
    title: 'Express Deal',
    description: 'Groceries, essentials and more, \n in minutes',
    type: SERVICE_TYPES.INTERNAL,
    route: 'MainTabs',
    params: { screen: 'Home' },
    icon: 'bag-handle-outline',
    iconColor: '#F25000',
    logo: require('../assets/images/modal/20minIcon.png'),
    titleImage: require('../assets/images/modal/20minModal.png'),
  },
  {
    id: 'partner',
    title: '48hrs Deals',
    description: 'Electronics, kitchen Appliances \n & More',
    type: SERVICE_TYPES.INTERNAL,
    route: 'Deals48',
    icon: 'apps-outline',
    iconColor: '#00BCD4',
    logo: require('../assets/images/modal/48hrDealIcon.png'),
    titleImage: require('../assets/images/modal/48hrImage.png'),
    enabledSettingKey: 'showkshope',
  },
  {
    id: 'quickCommerce',
    title: 'D2C',
    description: 'Groceries & daily essentials',
    type: SERVICE_TYPES.INTERNAL,
    route: 'D2cScreen',
    icon: 'cart-outline',
    iconColor: '#F25000',
    logo: require('../assets/images/modal/d2cicon.png'),
    titleImage: require('../assets/images/modal/D2C.png'),
    comingSoon: false,
  },
];

export const LAST_SELECTED_SERVICE_KEY = 'lastSelectedServiceId';
