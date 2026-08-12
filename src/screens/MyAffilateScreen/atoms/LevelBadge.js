import React from 'react';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_RADIUS, wp } from '@/styles/cartTheme';

const LevelBadge = ({ label, active }) => (
  <IconDisc
    size={wp('10%')}
    radius={CART_RADIUS.pill}
    tone={active ? 'brand' : 'neutral'}
  >
    <CartText variant="captionStrong" tone={active ? 'primary' : 'faint'}>
      {label}
    </CartText>
  </IconDisc>
);

export default React.memo(LevelBadge);
