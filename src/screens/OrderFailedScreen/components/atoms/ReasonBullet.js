import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS } from '@/styles/cartTheme';
import { DISC, ICON } from '../../styles';

const ReasonBullet = ({ icon = 'alert-circle' }) => (
  <IconDisc size={DISC.reason} tone="neutral">
    <Feather name={icon} size={ICON.reason} color={CART_COLORS.textSecondary} />
  </IconDisc>
);

export default React.memo(ReasonBullet);
