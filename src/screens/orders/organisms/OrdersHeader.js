import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import icons from '@/assets/icons';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  TOUCH_MIN,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';

const BACK_HIT_SLOP = hitSlopTo(24);
const COLLAPSE_RANGE = [0, 40];

const OrdersHeader = ({ scrollY, subtitle, onBack }) => {
  const ruleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      COLLAPSE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

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
    <View style={styles.header}>
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
          <Text
            style={styles.title}
            accessibilityRole="header"
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            My orders
          </Text>
          <Animated.View style={subtitleStyle}>
            <Text
              style={styles.subtitle}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {subtitle}
            </Text>
          </Animated.View>
        </View>
      </View>

      <Animated.View style={[styles.rule, ruleStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: SURFACE.base,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
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
    tintColor: INK.strong,
  },
  titleBlock: {
    flex: 1,
    marginLeft: SPACE.md,
  },
  title: {
    ...TYPE.title,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.6,
  },
  subtitle: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: 2,
  },
  rule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
});

export default React.memo(OrdersHeader);
