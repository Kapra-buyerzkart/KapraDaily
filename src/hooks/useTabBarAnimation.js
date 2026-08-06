import { useCallback } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import {
  tabBarVisibility,
  TAB_BAR_ANIM_DURATION,
  updateTabBarVisibilityWorklet,
} from '../animations/tabBarVisibility';

export default function useTabBarAnimation() {
  const scrollAnchor = useSharedValue(0);

  const onScrollWorklet = y => {
    'worklet';
    updateTabBarVisibilityWorklet(y, scrollAnchor);
  };

  useFocusEffect(
    useCallback(() => {
      scrollAnchor.value = 0;
      tabBarVisibility.value = withTiming(1, {
        duration: TAB_BAR_ANIM_DURATION,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return { onScrollWorklet };
}
