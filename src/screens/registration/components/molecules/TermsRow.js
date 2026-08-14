import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CartText from '../../../cart/components/atoms/CartText';
import CheckBox from '../atoms/CheckBox';
import { CART_COLORS, CART_SPACING, hp } from '../../../../styles/cartTheme';

const TermsRow = ({ checked, onToggle, onPressTerms }) => (
  <View style={styles.row}>
    <TouchableOpacity
      onPress={onToggle}
      style={styles.toggle}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="I have read and agree to the terms and conditions"
      accessibilityHint="Double tap to accept or decline the terms and conditions"
    >
      <CheckBox checked={checked} />
      <CartText variant="caption" tone="muted">
        I have read and agree to
      </CartText>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onPressTerms}
      style={styles.link}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 12 }}
      accessibilityRole="link"
      accessibilityLabel="Terms and conditions"
    >
      <CartText variant="captionStrong" tone="brand">
        Terms and conditions
        <CartText style={styles.star}>{' *'}</CartText>
      </CartText>
    </TouchableOpacity>
  </View>
);

export default React.memo(TermsRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: CART_SPACING.xs,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingVertical: hp('0.8%'),
  },
  link: {
    paddingVertical: hp('0.8%'),
  },
  star: {
    color: CART_COLORS.danger,
  },
});
