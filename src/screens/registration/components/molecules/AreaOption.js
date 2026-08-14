import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CartText from '../../../cart/components/atoms/CartText';
import RadioDot from '../atoms/RadioDot';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
} from '../../../../styles/cartTheme';

const AreaOption = ({ label, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={[styles.row, selected && styles.rowSelected]}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
  >
    <CartText
      variant={selected ? 'labelStrong' : 'label'}
      tone={selected ? 'brand' : 'secondary'}
      style={styles.label}
      numberOfLines={1}
    >
      {label}
    </CartText>
    <RadioDot selected={selected} />
  </TouchableOpacity>
);

export default React.memo(AreaOption);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.3%'),
    borderRadius: CART_RADIUS.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: CART_COLORS.well,
  },
  rowSelected: {
    borderColor: CART_COLORS.primaryEdge,
    backgroundColor: CART_COLORS.primaryTint,
  },
  label: {
    flex: 1,
  },
});
