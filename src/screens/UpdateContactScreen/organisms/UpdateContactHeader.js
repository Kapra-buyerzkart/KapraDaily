import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import icons from '@/assets/icons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  hp,
} from '@/styles/cartTheme';

const UpdateContactHeader = ({ isPhone, step, totalSteps, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBack}
      style={styles.backBtn}
      hitSlop={hitSlopTo(24)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Image source={icons.backArrowNew} style={styles.backIcon} />
    </TouchableOpacity>

    <View style={styles.titleBlock}>
      <CartText variant="title" accessibilityRole="header">
        {isPhone ? 'Change Number' : 'Change Email'}
      </CartText>
      <CartText variant="caption" tone="muted">
        {step === 1 ? 'Enter new details' : 'Verify with OTP'}
      </CartText>
    </View>

    <View style={styles.stepChip}>
      <CartText variant="micro" tone="muted">
        Step {step} of {totalSteps}
      </CartText>
    </View>
  </View>
);

export default React.memo(UpdateContactHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: CART_COLORS.card,
    gap: CART_SPACING.sm,
  },
  backBtn: {
    padding: CART_SPACING.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: CART_COLORS.textPrimary,
  },
  titleBlock: {
    flex: 1,
    marginLeft: CART_SPACING.xs,
  },
  stepChip: {
    backgroundColor: CART_COLORS.well,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
});
