import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  BEACON_CORE_SIZE,
  BEACON_ICON_NAME,
  BEACON_ICON_SIZE,
  CORE_BOB_DISTANCE,
  CORE_BOB_DURATION,
} from '../../constants';
import { COLORS, SHADOW } from '../../theme';

const BeaconCore = () => {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: CORE_BOB_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: CORE_BOB_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
      bob.setValue(0);
    };
  }, [bob]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.core,
        SHADOW.raised,
        {
          transform: [
            {
              translateY: bob.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -CORE_BOB_DISTANCE],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons
        name={BEACON_ICON_NAME}
        size={BEACON_ICON_SIZE}
        color={COLORS.brand}
      />
    </Animated.View>
  );
};

export default React.memo(BeaconCore);

const styles = StyleSheet.create({
  core: {
    width: BEACON_CORE_SIZE,
    height: BEACON_CORE_SIZE,
    borderRadius: BEACON_CORE_SIZE / 2,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
