import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Placeholder rows shown while the bookings request is in flight, so the list
// area fills in on the same frame as the header/tabs instead of popping in.
const PLACEHOLDER_COUNT = 5;

const SkeletonRow = () => (
  <View style={styles.card}>
    <View style={styles.image} />
    <View style={styles.body}>
      <View style={[styles.line, styles.title]} />
      <View style={[styles.line, styles.meta]} />
      <View style={[styles.line, styles.metaShort]} />
      <View style={styles.bottomRow}>
        <View style={[styles.line, styles.detail]} />
        <View style={[styles.line, styles.badge]} />
      </View>
    </View>
  </View>
);

const EventBookingSkeleton = ({ count = PLACEHOLDER_COUNT }) => {
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.8, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </Animated.View>
  );
};

const BLOCK = 'rgba(255,255,255,0.09)';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: BLOCK,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  line: {
    backgroundColor: BLOCK,
    borderRadius: 6,
  },
  title: {
    height: 14,
    width: '70%',
  },
  meta: {
    height: 11,
    width: '55%',
    marginTop: 8,
  },
  metaShort: {
    height: 11,
    width: '40%',
    marginTop: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detail: {
    height: 12,
    width: '45%',
  },
  badge: {
    height: 18,
    width: 64,
    borderRadius: 10,
  },
});

export default React.memo(EventBookingSkeleton);
