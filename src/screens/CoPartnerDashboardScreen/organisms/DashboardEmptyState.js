import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  hp,
  wp,
} from '@/styles/cartTheme';

const DashboardEmptyState = ({ onGoBack }) => (
  <View style={styles.wrap}>
    <Image source={icons.copartnerDash} style={styles.art} />

    <CartText variant="heading">No data found</CartText>
    <CartText variant="caption" tone="muted" style={styles.copy}>
      You aren’t a registered Co-Partner yet.
    </CartText>

    <TouchableOpacity
      style={styles.btn}
      hitSlop={hitSlopTo(20)}
      onPress={onGoBack}
      activeOpacity={0.9}
      accessibilityRole="button"
    >
      <CartText variant="labelStrong" tone="secondary">
        Go back
      </CartText>
    </TouchableOpacity>
  </View>
);

export default React.memo(DashboardEmptyState);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('10%'),
    paddingBottom: hp('8%'),
    gap: CART_SPACING.xs,
  },
  art: {
    resizeMode: 'contain',
    marginBottom: CART_SPACING.md,
  },
  copy: {
    textAlign: 'center',
  },
  btn: {
    marginTop: CART_SPACING.xxl,
    paddingHorizontal: CART_SPACING.xxl,
    paddingVertical: hp('1.4%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.well,
  },
});
