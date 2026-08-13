import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { BRAND_LOGO } from '../constants';
import { LOGO_RATIO, SPACING, wp } from '../theme';

const BrandMark = ({ style }) => (
  <Animated.View
    entering={FadeInDown.duration(360)}
    style={[styles.block, style]}
  >
    <View style={styles.logoWrap}>
      <Image source={BRAND_LOGO} style={styles.logo} resizeMode="contain" />
    </View>
  </Animated.View>
);

export default React.memo(BrandMark);

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  logoWrap: {
    width: wp('62%'),
    aspectRatio: LOGO_RATIO,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
