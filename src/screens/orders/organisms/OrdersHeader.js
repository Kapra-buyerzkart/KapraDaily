import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import icons from '@/assets/icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import {
  COLORS,
  GUTTER,
  SPACING,
  TOUCH_MIN,
  hitSlopTo,
  hp,
  wp,
} from '../theme';

const BACK_HIT_SLOP = hitSlopTo(24);
const COLLAPSE_RANGE = [0, 40];

const OrdersHeader = ({ scrollY, subtitle, onBack }) => {
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      COLLAPSE_RANGE,
      [1, 0],
      Extrapolation.CLAMP,
    ),
    height: interpolate(
      scrollY.value,
      COLLAPSE_RANGE,
      [18, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.row}>
      <AnimatedPressable
        onPress={onBack}
        hitSlop={BACK_HIT_SLOP}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </AnimatedPressable>

      <View style={styles.titleBlock}>
        <OrderText variant="title" accessibilityRole="header">
          My orders
        </OrderText>
        <Animated.View style={subtitleStyle}>
          <OrderText variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </OrderText>
        </Animated.View>
      </View>
    </View>
  );
};

export default React.memo(OrdersHeader);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: hp('0.6%'),
  },
  back: {
    width: TOUCH_MIN - 8,
    height: TOUCH_MIN - 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
    tintColor: COLORS.textPrimary,
  },
  titleBlock: {
    flex: 1,
    marginLeft: SPACING.md,
  },
});
