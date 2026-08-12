import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import CartText from './CartText';
import { CART_SPACING, wp } from '../../../../styles/cartTheme';

const SectionHeading = ({ title, subtitle, icon, right, style }) => (
  <View style={[styles.row, style]}>
    {icon ? <Image source={icon} style={styles.icon} /> : null}
    <View style={styles.copy}>
      <CartText variant="heading">{title}</CartText>
      {subtitle ? (
        <CartText variant="caption" tone="muted" style={styles.subtitle}>
          {subtitle}
        </CartText>
      ) : null}
    </View>
    {right}
  </View>
);

export default React.memo(SectionHeading);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  icon: {
    width: wp('4.6%'),
    height: wp('4.6%'),
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
});
