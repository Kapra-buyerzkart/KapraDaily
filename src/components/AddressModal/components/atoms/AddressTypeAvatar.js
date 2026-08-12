import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS, wp } from '@/styles/cartTheme';

const ICON_BY_TYPE = {
  home: 'home',
  work: 'briefcase',
  office: 'briefcase',
  hotel: 'bed',
  other: 'location',
};

export const iconForType = type =>
  ICON_BY_TYPE[String(type || '').toLowerCase()] || ICON_BY_TYPE.other;

const AddressTypeAvatar = ({ type, active }) => (
  <IconDisc size={wp('9%')} tone={active ? 'success' : 'neutral'}>
    <Ionicons
      name={iconForType(type)}
      size={wp('4.4%')}
      color={active ? CART_COLORS.successDeep : CART_COLORS.textSecondary}
    />
  </IconDisc>
);

export default React.memo(AddressTypeAvatar);
