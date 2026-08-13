import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Badge from '@/screens/cart/components/atoms/Badge';
import { CART_COLORS, wp } from '@/styles/cartTheme';

const SelectedTag = ({ label = 'Delivering here' }) => (
  <Badge
    tone="success"
    label={label}
    icon={
      <Ionicons
        name="checkmark-circle"
        size={wp('3.2%')}
        color={CART_COLORS.successDeep}
      />
    }
  />
);

export default React.memo(SelectedTag);
