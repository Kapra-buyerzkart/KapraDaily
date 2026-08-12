import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_COLORS, CART_RADIUS, wp } from '@/styles/cartTheme';

const SheetGrabber = () => <View style={styles.grabber} />;

export default React.memo(SheetGrabber);

const styles = StyleSheet.create({
  grabber: {
    alignSelf: 'center',
    width: wp('10%'),
    height: 4,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.borderStrong,
  },
});
