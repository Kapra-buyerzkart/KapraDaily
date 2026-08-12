import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_RADIUS, CART_SPACING, wp } from '@/styles/cartTheme';

const MetaChip = ({ icon, label }) => {
  if (!label) return null;

  return (
    <View style={styles.chip}>
      <MaterialCommunityIcons
        name={icon}
        size={wp('3.4%')}
        color={CART_COLORS.textMuted}
      />
      <CartText variant="micro" tone="muted" numberOfLines={1}>
        {label}
      </CartText>
    </View>
  );
};

export default React.memo(MetaChip);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 3,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.well,
  },
});
