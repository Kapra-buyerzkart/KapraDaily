import React from 'react';
import { View, StyleSheet } from 'react-native';
import CartText from './CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
} from '../../../../styles/cartTheme';

const TONE_STYLES = {
  success: { bg: CART_COLORS.successTint, fg: 'success' },
  brand: { bg: CART_COLORS.primaryTint, fg: 'brand' },
  neutral: { bg: CART_COLORS.well, fg: 'muted' },
  danger: { bg: CART_COLORS.dangerTint, fg: 'danger' },
  solidSuccess: { bg: CART_COLORS.success, fg: 'onDark' },
  solidBrand: { bg: CART_COLORS.primary, fg: 'onDark' },
  solidInk: { bg: CART_COLORS.textPrimary, fg: 'onDark' },
};

const Badge = ({ tone = 'neutral', label, icon, style, children }) => {
  const palette = TONE_STYLES[tone] || TONE_STYLES.neutral;

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      {icon}
      {label ? (
        <CartText variant="micro" tone={palette.fg} numberOfLines={1}>
          {label}
        </CartText>
      ) : (
        children
      )}
    </View>
  );
};

export default React.memo(Badge);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 3,
    borderRadius: CART_RADIUS.pill,
  },
});
