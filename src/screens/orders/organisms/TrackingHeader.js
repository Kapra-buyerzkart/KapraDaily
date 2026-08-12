import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  TOUCH_MIN,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';

const COLLAPSE_RANGE = [0, 40];
const BACK_HIT_SLOP = hitSlopTo(wp('9%'));

const TrackingHeader = ({ scrollY, orderNumber, onBack, onHelp }) => {
  const ruleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      COLLAPSE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.header}>
      <AnimatedPressable
        onPress={onBack}
        hitSlop={BACK_HIT_SLOP}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Go back to my orders"
      >
        <Ionicons name="chevron-back" size={wp('5.2%')} color={INK.strong} />
      </AnimatedPressable>

      <View style={styles.titleBlock}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          Order tracking
        </Text>
        {!!orderNumber && (
          <Text
            style={styles.subtitle}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            #{orderNumber}
          </Text>
        )}
      </View>

      <AnimatedPressable
        onPress={onHelp}
        hitSlop={BACK_HIT_SLOP}
        style={styles.help}
        accessibilityRole="button"
        accessibilityLabel="Get help with this order"
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={wp('3.8%')}
          color={INK.base}
        />
        <Text style={styles.helpText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Help
        </Text>
      </AnimatedPressable>

      <Animated.View style={[styles.rule, ruleStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.sm,
    backgroundColor: SURFACE.base,
  },
  back: {
    width: TOUCH_MIN - 8,
    height: TOUCH_MIN - 8,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: SPACE.md,
  },
  title: {
    ...TYPE.heading,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.4,
  },
  subtitle: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: 2,
  },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.md,
    minHeight: TOUCH_MIN - 14,
  },
  helpText: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.base,
    marginLeft: SPACE.xs + 1,
    letterSpacing: 0.2,
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

export default React.memo(TrackingHeader);
