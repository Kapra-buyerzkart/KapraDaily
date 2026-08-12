import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  HAIRLINE,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  TOUCH_MIN,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';

const VARIANT = {
  primary: { fill: INK.strong, text: INK.onDark, border: INK.strong },
  success: { fill: ACCENT.success, text: INK.onDark, border: ACCENT.success },
  ghost: {
    fill: SURFACE.sunken,
    text: INK.base,
    border: HAIRLINE,
  },
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
        style={[
          styles.action,
          { backgroundColor: palette.fill, borderColor: palette.border },
        ]}
      >
        {!!icon && (
          <Ionicons
            name={icon}
            size={wp('4.2%')}
            color={palette.text}
            style={styles.icon}
          />
        )}
        <Text
          style={[styles.label, { color: palette.text }]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

const TrackingActionBar = ({ actions = [], hint, bottomInset = 0 }) => {
  const visible = actions.filter(Boolean);
  if (!visible.length) return null;

  return (
    <View style={[styles.bar, { paddingBottom: bottomInset + SPACE.md }]}>
      {!!hint && (
        <Text style={styles.hint} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {hint}
        </Text>
      )}
      <View style={styles.row}>
        {visible.map(action => (
          <Action key={action.label} {...action} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    backgroundColor: SURFACE.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  hint: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    textAlign: 'center',
    marginBottom: SPACE.sm,
  },
  row: {
    flexDirection: 'row',
  },
  slot: {
    flex: 1,
    marginHorizontal: SPACE.xs,
  },
  action: {
    minHeight: TOUCH_MIN + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    paddingHorizontal: SPACE.md,
  },
  icon: {
    marginRight: SPACE.sm,
  },
  label: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.2,
  },
});

export default React.memo(TrackingActionBar);
