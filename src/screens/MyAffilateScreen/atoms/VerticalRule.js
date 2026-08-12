import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, hp } from '@/styles/cartTheme';

const VerticalRule = () => <View style={styles.rule} />;

export default React.memo(VerticalRule);

const styles = StyleSheet.create({
  rule: {
    width: StyleSheet.hairlineWidth,
    height: hp('3.6%'),
    backgroundColor: CART_COLORS.borderStrong,
  },
});
