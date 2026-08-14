import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { RING_PERIOD } from '../../constants';
import { COLORS } from '../../theme';

const PulseRing = ({
  size,
  delay = 0,
  duration = RING_PERIOD,
  color = COLORS.ring,
  minScale = 0.32,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );

    const startId = setTimeout(() => loop.start(), delay);

    return () => {
      clearTimeout(startId);
      loop.stop();
      progress.setValue(0);
    };
  }, [progress, delay, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          opacity: progress.interpolate({
            inputRange: [0, 0.15, 1],
            outputRange: [0, 0.55, 0],
          }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [minScale, 1],
              }),
            },
          ],
        },
      ]}
    />
  );
};

export default React.memo(PulseRing);

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
});
