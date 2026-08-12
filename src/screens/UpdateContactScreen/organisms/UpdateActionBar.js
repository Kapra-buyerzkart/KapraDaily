import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '@/styles/cartTheme';

const UpdateActionBar = ({ enabled, label, hint, onPress }) => (
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
      <CartText
        variant="cta"
        tone={enabled ? 'onDark' : 'faint'}
        numberOfLines={1}
      >
        {enabled ? label : hint}
      </CartText>
      {enabled && (
        <AntDesign
          name="arrowright"
          size={wp('4%')}
          color={CART_COLORS.onPrimary}
        />
      )}
    </TouchableOpacity>
  </SafeAreaView>
);

export default React.memo(UpdateActionBar);

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
