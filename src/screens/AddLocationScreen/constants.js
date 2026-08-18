import { hp, wp } from './theme';

export const MAP_HEIGHT = hp('48%');
export const SHEET_TOP = hp('38%');

export const PIN_HEIGHT = wp('11%');
export const PIN_SHADOW_HEIGHT = wp('1.5%');

export const DEFAULT_COORDS = { latitude: 10.0205, longitude: 76.3052 };
export const REGION_DELTA = { latitudeDelta: 0.005, longitudeDelta: 0.005 };

export const PIN_ICON = require('../../assets/images/location_four.png');
export const DELIVERY_ICON = require('../../assets/images/del_boy.png');

export const ADDRESS_TYPES = [
  {
    key: 'HOME',
    label: 'Home',
    icon: require('../../assets/images/home_primary_color.png'),
  },
  {
    key: 'OFFICE',
    label: 'Office',
    icon: require('../../assets/images/office_primary_color.png'),
  },
  {
    key: 'OTHER',
    label: 'Other',
    icon: require('../../assets/images/location_five.png'),
  },
];
