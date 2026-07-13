import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const Pulse = ({ style }) => {
  const progress = useSharedValue(0.3);

  useEffect(() => {
    progress.value = withRepeat(withTiming(0.7, { duration: 900 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return <Reanimated.View style={[styles.block, style, animatedStyle]} />;
};

const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  if (variant === 'hero') {
    return (
      <View style={styles.wrapper}>
        <Pulse style={styles.hero} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {Array.from({ length: count }).map((_, index) => (
        <Pulse key={index} style={styles.card} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  block: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
  },
  hero: {
    width: '100%',
    height: 220,
  },
  card: {
    width: '100%',
    height: 160,
    marginBottom: 16,
  },
});

export default LoadingSkeleton;
