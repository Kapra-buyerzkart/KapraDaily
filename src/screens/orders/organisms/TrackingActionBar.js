import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import {
  COLORS,
  GUTTER,
  RADIUS,
  SHADOW,
  SPACING,
  TOUCH_MIN,
  wp,
} from '../theme';

const VARIANT = {
  primary: { fill: COLORS.ink, fg: COLORS.onDark },
  success: { fill: COLORS.success, fg: COLORS.onDark },
  ghost: { fill: COLORS.well, fg: COLORS.ink },
};

const Action = ({ label, icon, variant = 'primary', highlight, onPress }) => {
  const palette = VARIANT[variant] || VARIANT.primary;
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!highlight) {
      cancelAnimation(pulse);
      pulse.value = 0;
      return undefined;
    }
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [highlight, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value * 0.35,
  }));

  return (
    <Animated.View style={[styles.slot, pulseStyle]}>
      <AnimatedPressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.action, { backgroundColor: palette.fill }]}
      >
        {!!icon && (
          <Ionicons name={icon} size={wp('4.2%')} color={palette.fg} />
        )}
        <OrderText variant="cta" tone={palette.fg} numberOfLines={1}>
          {label}
        </OrderText>
      </AnimatedPressable>
    </Animated.View>
  );
};

const TrackingActionBar = ({ actions = [], hint, bottomInset = 0 }) => {
  const visible = actions.filter(Boolean);
  if (!visible.length) return null;

  return (
    <View style={[styles.bar, { paddingBottom: bottomInset + SPACING.md }]}>
      {!!hint && (
        <OrderText variant="caption" tone="muted" style={styles.hint}>
          {hint}
        </OrderText>
      )}
      <View style={styles.row}>
        {visible.map(action => (
          <Action key={action.label} {...action} />
        ))}
      </View>
    </View>
  );
};

export default React.memo(TrackingActionBar);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.md,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    ...SHADOW.bar,
  },
  hint: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  slot: {
    flex: 1,
  },
  action: {
    minHeight: TOUCH_MIN + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.button,
    paddingHorizontal: SPACING.md,
  },
});
