import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const DOTS = [0, 1, 2];
const DURATION = 900;
const DOT_SIZES = { small: 7, large: 11 };

const resolveDotSize = size => {
  if (typeof size === 'number') {
    return size / 3;
  }
  return DOT_SIZES[size] || DOT_SIZES.small;
};

const BallPulse = ({ color = '#F25000', size = 'small', style }) => {
  const values = useRef(DOTS.map(() => new Animated.Value(0))).current;
  const dotSize = resolveDotSize(size);

  useEffect(() => {
    const animations = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay((DURATION / DOTS.length) * index),
          Animated.timing(value, {
            toValue: 1,
            duration: DURATION / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: DURATION / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay((DURATION / DOTS.length) * (DOTS.length - 1 - index)),
        ]),
      ),
    );

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
      values.forEach(value => value.setValue(0));
    };
  }, [values]);

  return (
    <View style={[styles.row, { height: dotSize * 2.5 }, style]}>
      {values.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              marginHorizontal: dotSize / 3,
              backgroundColor: color,
              opacity: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.35, 1],
              }),
              transform: [
                {
                  scale: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.25],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default React.memo(BallPulse);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
