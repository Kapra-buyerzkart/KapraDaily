import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import {
  CART_COLORS,
  CART_SPACING,
  hitSlopTo,
  wp,
  hp,
} from '@/styles/cartTheme';

const ChangePasswordHeader = ({ onBack }) => (
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
        Change Password
      </CartText>
      <CartText variant="caption" tone="muted">
        Keep your account secure
      </CartText>
    </View>

    <IconDisc size={wp('9%')} tone="neutral">
      <MaterialCommunityIcons
        name="shield-lock-outline"
        size={wp('4.4%')}
        color={CART_COLORS.textSecondary}
      />
    </IconDisc>
  </View>
);

export default React.memo(ChangePasswordHeader);

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
});
