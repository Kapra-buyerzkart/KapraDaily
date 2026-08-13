import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  wp,
} from '@/styles/cartTheme';

const CardAction = ({ icon, label, tone = 'secondary', onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={hitSlopTo(wp('9%'))}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
  >
    <MaterialCommunityIcons
      name={icon}
      size={wp('4%')}
      color={tone === 'danger' ? CART_COLORS.danger : CART_COLORS.textSecondary}
    />
    <CartText variant="micro" tone={tone}>
      {label}
    </CartText>
  </Pressable>
);

export default React.memo(CardAction);

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 4,
    borderRadius: CART_RADIUS.xs,
  },
  actionPressed: {
    backgroundColor: CART_COLORS.well,
  },
});
