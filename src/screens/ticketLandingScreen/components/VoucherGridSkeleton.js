import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

// Placeholder grid shown while the vouchers request is in flight, so the list
// area fills in on the same frame as the header/tabs instead of popping in.
const PLACEHOLDER_COUNT = 6;

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.image} />
    <View style={styles.body}>
      <View style={[styles.line, styles.title]} />
      <View style={[styles.line, styles.desc]} />
    </View>
  </View>
);

const VoucherGridSkeleton = ({ count = PLACEHOLDER_COUNT }) => {
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
        <SkeletonCard key={index} />
      ))}
    </Animated.View>
  );
};

const BLOCK = 'rgba(255,255,255,0.09)';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: BLOCK,
  },
  body: {
    padding: 10,
  },
  line: {
    backgroundColor: BLOCK,
    borderRadius: 6,
  },
  title: {
    height: 14,
    width: '75%',
  },
  desc: {
    height: 11,
    width: '50%',
    marginTop: 8,
  },
});

export default React.memo(VoucherGridSkeleton);
