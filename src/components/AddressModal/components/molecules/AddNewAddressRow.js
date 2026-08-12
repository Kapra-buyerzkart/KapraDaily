import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const AddNewAddressRow = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Add a new address"
    style={styles.row}
  >
    <IconDisc size={wp('9%')} tone="brand">
      <Ionicons name="add" size={wp('4.6%')} color={CART_COLORS.primary} />
    </IconDisc>

    <View style={styles.copy}>
      <CartText variant="labelStrong">Add a new address</CartText>
      <CartText variant="micro" tone="muted">
        Pin your exact spot for faster delivery
      </CartText>
    </View>

    <Ionicons
      name="chevron-forward"
      size={wp('4%')}
      color={CART_COLORS.textFaint}
    />
  </TouchableOpacity>
);

export default React.memo(AddNewAddressRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: CART_COLORS.borderStrong,
    borderRadius: CART_RADIUS.card,
    paddingVertical: hp('1.3%'),
    paddingHorizontal: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
});
