import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import OrdersHeader from './OrdersHeader';
import OrdersFilterBar from './OrdersFilterBar';
import { COLORS, HAIRLINE, SHADOW } from '../theme';

const COLLAPSE_RANGE = [0, 40];

const OrdersTopBar = ({
  scrollY,
  subtitle,
  onBack,
  filters,
  active,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();

  const ruleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      COLLAPSE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <OrdersHeader scrollY={scrollY} subtitle={subtitle} onBack={onBack} />
      <OrdersFilterBar filters={filters} active={active} onSelect={onSelect} />
      <Animated.View style={[styles.rule, ruleStyle]} />
    </View>
  );
};

export default React.memo(OrdersTopBar);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.surface,
    zIndex: 5,
    ...SHADOW.card,
  },
  rule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HAIRLINE,
    backgroundColor: COLORS.lineStrong,
  },
});
