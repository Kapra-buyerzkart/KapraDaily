import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  wp,
  hp,
} from '@/styles/cartTheme';

const ResendRow = ({ isPhone, canResend, timer, onResend, onEdit }) => (
  <View style={styles.row}>
    {canResend ? (
      <TouchableOpacity
        onPress={onResend}
        activeOpacity={0.7}
        hitSlop={hitSlopTo(20)}
        style={styles.chip}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="refresh"
          size={wp('3.6%')}
          color={CART_COLORS.textSecondary}
        />
        <CartText variant="captionStrong" tone="secondary">
          Resend code
        </CartText>
      </TouchableOpacity>
    ) : (
      <View style={styles.chip}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={wp('3.6%')}
          color={CART_COLORS.textFaint}
        />
        <CartText variant="caption" tone="faint">
          Resend in {timer}s
        </CartText>
      </View>
    )}

    <TouchableOpacity
      onPress={onEdit}
      activeOpacity={0.7}
      hitSlop={hitSlopTo(20)}
      style={styles.chip}
      accessibilityRole="button"
    >
      <MaterialCommunityIcons
        name="pencil-outline"
        size={wp('3.6%')}
        color={CART_COLORS.textSecondary}
      />
      <CartText variant="captionStrong" tone="secondary">
        Edit {isPhone ? 'number' : 'email'}
      </CartText>
    </TouchableOpacity>
  </View>
);

export default React.memo(ResendRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CART_SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    backgroundColor: CART_COLORS.well,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
});
