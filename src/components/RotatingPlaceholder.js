import React, { memo, useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  withRepeat,
  withTiming,
  cancelAnimation,
  interpolate,
  Extrapolation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const HOLD_DURATION = 2200;
const EXIT_DURATION = 350;
const ENTER_DURATION = 450;
const CYCLE_DURATION = HOLD_DURATION + EXIT_DURATION + ENTER_DURATION;
const SLIDE_OFFSET = 14;

const HOLD_FRACTION = HOLD_DURATION / CYCLE_DURATION;
const EXIT_FRACTION = (HOLD_DURATION + EXIT_DURATION) / CYCLE_DURATION;

const RotatingPlaceholder = ({
  examples,
  isPaused = false,
  prefix = '',
  suffix = '',
  style,
  numberOfLines = 1,
}) => {
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  // The loop drives a UI-thread mapper every frame; keeping it alive on an
  // unfocused screen steals budget from whatever is actually scrolling.
  const isFocused = useIsFocused();
  const paused = isPaused || !isFocused;

  const advanceIndex = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % examples.length);
  }, [examples.length]);

  useEffect(() => {
    if (paused) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 150 });
      return;
    }

    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: CYCLE_DURATION, easing: Easing.linear }),
      -1,
      false,
    );

    return () => cancelAnimation(progress);
  }, [paused, progress]);

  useAnimatedReaction(
    () => progress.value > EXIT_FRACTION,
    (isEntering, wasEntering) => {
      if (isEntering && wasEntering === false) {
        runOnJS(advanceIndex)();
      }
    },
    [advanceIndex],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;

    if (p <= HOLD_FRACTION) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    if (p <= EXIT_FRACTION) {
      const t = (p - HOLD_FRACTION) / (EXIT_FRACTION - HOLD_FRACTION);
      return {
        opacity: interpolate(t, [0, 1], [1, 0], Extrapolation.CLAMP),
        transform: [
          {
            translateY: interpolate(
              t,
              [0, 1],
              [0, -SLIDE_OFFSET],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    }

    const t = (p - EXIT_FRACTION) / (1 - EXIT_FRACTION);
    return {
      opacity: interpolate(t, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(
            t,
            [0, 1],
            [SLIDE_OFFSET, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={{ flexDirection: 'row' }}>
      {prefix ? (
        <Animated.Text
          style={style}
          numberOfLines={numberOfLines}
          pointerEvents="none"
        >
          {prefix}
        </Animated.Text>
      ) : null}
      <Animated.Text
        style={[style, animatedStyle]}
        numberOfLines={numberOfLines}
        pointerEvents="none"
      >
        {suffix}
        {examples[currentIndex]}
        {suffix}
      </Animated.Text>
    </View>
  );
};

export default memo(RotatingPlaceholder);
