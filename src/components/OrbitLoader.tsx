import React, {useEffect, useMemo, useState} from 'react';
import {
  AccessibilityInfo,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const TAU = Math.PI * 2;

type OrbitLoaderProps = {
  items: ImageSourcePropType[];
  size?: number;
  itemSize?: number;
  duration?: number;
  tilt?: number;
  minScale?: number;
  maxScale?: number;
  center?: React.ReactNode;
  style?: ViewStyle;
};

type OrbitItemProps = {
  source: ImageSourcePropType;
  phase: number;
  radius: number;
  itemSize: number;
  tilt: number;
  minScale: number;
  maxScale: number;
  progress: SharedValue<number>;
};

const OrbitItem = ({
  source,
  phase,
  radius,
  itemSize,
  tilt,
  minScale,
  maxScale,
  progress,
}: OrbitItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const angle = (progress.value + phase) * TAU - Math.PI / 2;
    const nearness = (Math.sin(angle) + 1) / 2;

    return {
      transform: [
        {translateX: Math.cos(angle) * radius},
        {translateY: Math.sin(angle) * radius * (1 - tilt)},
        {scale: minScale + nearness * (maxScale - minScale)},
      ],
      opacity: 0.55 + nearness * 0.45,
      zIndex: nearness > 0.5 ? 2 : 0,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.item,
        {
          width: itemSize,
          height: itemSize,
          marginLeft: -itemSize / 2,
          marginTop: -itemSize / 2,
        },
        animatedStyle,
      ]}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
};

export const OrbitLoader = ({
  items,
  size = 148,
  itemSize = 36,
  duration = 3200,
  tilt = 0.42,
  minScale = 0.62,
  maxScale = 1,
  center,
  style,
}: OrbitLoaderProps) => {
  const progress = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {duration, easing: Easing.linear}),
      -1,
      false,
    );
    return () => cancelAnimation(progress);
  }, [duration, progress, reduceMotion]);

  const radius = (size - itemSize) / 2;
  const phases = useMemo(
    () => items.map((_, index) => index / items.length),
    [items],
  );

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[styles.container, {width: size, height: size}, style]}>
      {center ? <View style={styles.center}>{center}</View> : null}
      {items.map((source, index) => (
        <OrbitItem
          key={index}
          source={source}
          phase={phases[index]}
          radius={radius}
          itemSize={itemSize}
          tilt={tilt}
          minScale={minScale}
          maxScale={maxScale}
          progress={progress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    zIndex: 1,
  },
  item: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
