import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartText from '../../../cart/components/atoms/CartText';
import IconDisc from '../../../cart/components/atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../../styles/cartTheme';

const PhoneEditChip = ({ phone, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={styles.chip}
    accessibilityRole="button"
    accessibilityLabel={`Registered mobile number +91 ${phone}. Change number`}
  >
    <IconDisc size={wp('7.6%')} tone="neutral" radius={CART_RADIUS.pill}>
      <Ionicons
        name="call-outline"
        size={wp('3.8%')}
        color={CART_COLORS.textSecondary}
      />
    </IconDisc>

    <View style={styles.copy}>
      <CartText variant="micro" tone="muted">
        MOBILE NUMBER
      </CartText>
      <CartText variant="labelStrong" numberOfLines={1}>
        +91 {phone}
      </CartText>
    </View>

    <View style={styles.editChip}>
      <Ionicons
        name="create-outline"
        size={wp('3.2%')}
        color={CART_COLORS.primary}
      />
      <CartText variant="micro" tone="brand">
        Edit
      </CartText>
    </View>
  </TouchableOpacity>
);

export default React.memo(PhoneEditChip);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.9%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.well,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: hp('0.4%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.primaryTint,
  },
});
