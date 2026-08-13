import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CART_COLORS, hitSlopTo, wp } from '@/styles/cartTheme';

const RevealToggle = ({ revealed, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    hitSlop={hitSlopTo(20)}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
  >
    <MaterialCommunityIcons
      name={revealed ? 'eye-off-outline' : 'eye-outline'}
      size={wp('4.4%')}
      color={active ? CART_COLORS.textSecondary : CART_COLORS.textFaint}
    />
  </TouchableOpacity>
);

export default React.memo(RevealToggle);
