import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import {
  COLORS,
  GUTTER,
  HAIRLINE,
  RADIUS,
  SHADOW,
  SPACING,
  TOUCH_MIN,
  hitSlopTo,
  hp,
  wp,
} from '../theme';

const COLLAPSE_RANGE = [0, 40];
const HIT_SLOP = hitSlopTo(24);

const TrackingHeader = ({ scrollY, orderNumber, onBack, onHelp }) => {
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
      <View style={styles.row}>
        <AnimatedPressable
          onPress={onBack}
          hitSlop={HIT_SLOP}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Go back to my orders"
        >
          <Image source={icons.backArrowNew} style={styles.backIcon} />
        </AnimatedPressable>

        <View style={styles.titleBlock}>
          <OrderText variant="title" accessibilityRole="header">
            Order details
          </OrderText>
          {!!orderNumber && (
            <OrderText variant="caption" tone="muted" numberOfLines={1}>
              #{orderNumber}
            </OrderText>
          )}
        </View>

        <AnimatedPressable
          onPress={onHelp}
          hitSlop={HIT_SLOP}
          style={styles.help}
          accessibilityRole="button"
          accessibilityLabel="Get help with this order"
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={wp('3.8%')}
            color={COLORS.textSecondary}
          />
          <OrderText variant="captionStrong" tone="secondary">
            Help
          </OrderText>
        </AnimatedPressable>
      </View>

      <Animated.View style={[styles.rule, ruleStyle]} />
    </View>
  );
};

export default React.memo(TrackingHeader);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: COLORS.surface,
    zIndex: 5,
    ...SHADOW.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: GUTTER,
    paddingTop: hp('0.6%'),
    paddingBottom: SPACING.md,
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
  },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 1,
    minHeight: TOUCH_MIN - 14,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.well,
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
