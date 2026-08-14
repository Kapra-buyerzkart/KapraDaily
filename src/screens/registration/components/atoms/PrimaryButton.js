import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BallPulse from '../../../../components/BallPulse';
import CartText from '../../../cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../../styles/cartTheme';

const PrimaryButton = ({ label, onPress, loading = false, style }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    disabled={loading}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ busy: loading, disabled: loading }}
    style={[styles.button, loading && styles.busy, style]}
  >
    {loading ? (
      <BallPulse color={CART_COLORS.onPrimary} />
    ) : (
      <>
        <CartText variant="cta" tone="onDark">
          {label}
        </CartText>
        <AntDesign
          name="arrowright"
          size={wp('4%')}
          color={CART_COLORS.onPrimary}
        />
      </>
    )}
  </TouchableOpacity>
);

export default React.memo(PrimaryButton);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.primary,
    borderRadius: CART_RADIUS.button,
    paddingVertical: hp('1.85%'),
    paddingHorizontal: CART_SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: CART_COLORS.primary,
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 1 },
    }),
  },
  busy: {
    opacity: 0.85,
  },
});
