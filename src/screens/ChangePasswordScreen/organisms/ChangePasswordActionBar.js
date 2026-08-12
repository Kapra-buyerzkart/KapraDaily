import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '@/styles/cartTheme';

const ChangePasswordActionBar = ({ enabled, label, hint, onPress }) => (
  <SafeAreaView edges={['bottom']} style={styles.footer}>
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.btn, !enabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={enabled ? undefined : hint}
    >
      <MaterialCommunityIcons
        name={enabled ? 'lock-check-outline' : 'lock-outline'}
        size={wp('4%')}
        color={enabled ? CART_COLORS.onPrimary : CART_COLORS.textFaint}
      />
      <CartText
        variant="cta"
        tone={enabled ? 'onDark' : 'faint'}
        numberOfLines={1}
      >
        {enabled ? label : hint}
      </CartText>
    </TouchableOpacity>
  </SafeAreaView>
);

export default React.memo(ChangePasswordActionBar);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: CART_COLORS.card,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.md,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
    ...CART_ELEVATION.bar,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.primary,
    borderRadius: CART_RADIUS.button,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.6%'),
    marginBottom: CART_SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: CART_COLORS.primary,
        shadowOpacity: 0.22,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 1 },
    }),
  },
  btnDisabled: {
    backgroundColor: CART_COLORS.well,
    shadowOpacity: 0,
    elevation: 0,
  },
});
