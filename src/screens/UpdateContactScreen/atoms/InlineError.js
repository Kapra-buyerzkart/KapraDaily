import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';

const InlineError = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={wp('3.4%')}
        color={CART_COLORS.danger}
      />
      <CartText variant="caption" tone="danger" style={styles.text}>
        {message}
      </CartText>
    </View>
  );
};

export default React.memo(InlineError);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    marginTop: CART_SPACING.sm,
  },
  text: {
    flexShrink: 1,
  },
});
