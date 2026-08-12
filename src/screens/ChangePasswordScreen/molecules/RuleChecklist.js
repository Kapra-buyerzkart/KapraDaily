import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';

const RuleChecklist = ({ checks }) => (
  <View style={styles.list}>
    {checks.map(check => (
      <View key={check.key} style={styles.row}>
        <MaterialCommunityIcons
          name={check.passed ? 'check-circle' : 'circle-outline'}
          size={wp('3.4%')}
          color={check.passed ? CART_COLORS.success : CART_COLORS.textFaint}
        />
        <CartText
          variant={check.passed ? 'captionStrong' : 'caption'}
          tone={check.passed ? 'success' : 'muted'}
        >
          {check.label}
        </CartText>
      </View>
    ))}
  </View>
);

export default React.memo(RuleChecklist);

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CART_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
});
