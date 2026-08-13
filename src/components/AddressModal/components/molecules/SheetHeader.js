import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  wp,
} from '@/styles/cartTheme';

const SheetHeader = ({ title, subtitle, onClose }) => (
  <View style={styles.row}>
    <View style={styles.copy}>
      <CartText variant="heading" accessibilityRole="header">
        {title}
      </CartText>
      {subtitle ? (
        <CartText variant="micro" tone="muted">
          {subtitle}
        </CartText>
      ) : null}
    </View>

    <TouchableOpacity
      onPress={onClose}
      hitSlop={hitSlopTo(wp('8%'))}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <IconDisc size={wp('8%')} tone="neutral" radius={CART_RADIUS.pill}>
        <MaterialCommunityIcons
          name="close"
          size={wp('4.2%')}
          color={CART_COLORS.textSecondary}
        />
      </IconDisc>
    </TouchableOpacity>
  </View>
);

export default React.memo(SheetHeader);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
});
