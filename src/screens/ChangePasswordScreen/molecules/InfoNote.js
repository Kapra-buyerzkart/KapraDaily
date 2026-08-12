import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_RADIUS, CART_SPACING, wp } from '@/styles/cartTheme';

const InfoNote = ({ icon = 'shield-check-outline', children }) => (
  <View style={styles.row}>
    <MaterialCommunityIcons
      name={icon}
      size={wp('3.8%')}
      color={CART_COLORS.textMuted}
      style={styles.icon}
    />
    <CartText variant="micro" tone="muted" style={styles.text}>
      {children}
    </CartText>
  </View>
);

export default React.memo(InfoNote);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: CART_SPACING.sm,
    padding: CART_SPACING.md,
    borderRadius: CART_RADIUS.sm,
    backgroundColor: CART_COLORS.well,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    lineHeight: wp('4.4%'),
  },
});
