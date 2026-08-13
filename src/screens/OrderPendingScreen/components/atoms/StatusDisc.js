import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS } from '@/styles/cartTheme';
import { DISC, ICON, styles } from '../../styles';

const StatusDisc = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.94 + progress.value * 0.06 }],
    opacity: 0.4 + progress.value * 0.6,
  }));

  return (
    <IconDisc
      size={DISC.status}
      tone="brand"
      radius={DISC.status / 2}
      style={styles.statusDisc}
    >
      <Animated.View style={[styles.statusRing, ringStyle]} />
      <MaterialCommunityIcons
        name="timer-sand"
        size={ICON.status}
        color={CART_COLORS.primary}
      />
    </IconDisc>
  );
};

export default React.memo(StatusDisc);
