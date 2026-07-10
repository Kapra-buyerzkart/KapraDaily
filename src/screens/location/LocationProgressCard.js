import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { getStaggerDelay } from '../../utils/staggerDelay';
import { LOCATION_COLORS, LOCATION_FONTS, RADII } from './locationTheme';
import { STEP_LABELS, STEP_ORDER } from './locationConstants';

const CHECK_SPRING = { damping: 12, stiffness: 180 };

const ProgressRow = memo(({ label, isCompleted, isCurrent, index }) => {
  const pulseOpacity = useSharedValue(1);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (isCurrent) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      );
    }
  }, [isCurrent, pulseOpacity]);

  useEffect(() => {
    checkScale.value = withSpring(isCompleted ? 1 : 0, CHECK_SPRING);
  }, [isCompleted, checkScale]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(getStaggerDelay(index)).springify().damping(16)}
      style={styles.row}
    >
      <View style={styles.bulletWrap}>
        <View style={styles.pendingDot} />
        {isCurrent && (
          <Animated.View style={[styles.pulseDot, pulseStyle]} />
        )}
        <Animated.View style={[styles.checkCircle, checkStyle]}>
          <Svg width={10} height={8} viewBox="0 0 10 8">
            <Path
              d="M1 4L3.5 6.5L9 1"
              stroke={LOCATION_COLORS.background}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      </View>
      <Text
        style={[
          styles.label,
          isCurrent && styles.labelCurrent,
          isCompleted && styles.labelCompleted,
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
});

const LocationProgressCard = ({ step, completedSteps }) => (
  <View style={styles.card}>
    {STEP_ORDER.map((stepKey, index) => (
      <ProgressRow
        key={stepKey}
        label={STEP_LABELS[stepKey]}
        isCompleted={completedSteps.includes(stepKey)}
        isCurrent={step === stepKey}
        index={index}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: LOCATION_COLORS.background,
    borderRadius: RADII.card,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  bulletWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LOCATION_COLORS.border,
  },
  pulseDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: LOCATION_COLORS.primary,
  },
  checkCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: LOCATION_COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 14,
    color: LOCATION_COLORS.textSecondary,
  },
  labelCurrent: {
    fontFamily: LOCATION_FONTS.semiBold,
    color: LOCATION_COLORS.textPrimary,
  },
  labelCompleted: {
    color: LOCATION_COLORS.textSecondary,
  },
});

export default memo(LocationProgressCard);
