import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CART_COLORS } from '@/styles/cartTheme';
import { METER_FADE } from '../constants';

const MeterSegment = ({ filled, ink }) => {
  const target = filled ? ink : CART_COLORS.border;
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(target, METER_FADE),
  }));

  return <Animated.View style={[styles.segment, animatedStyle]} />;
};

export default React.memo(MeterSegment);

const styles = StyleSheet.create({
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
