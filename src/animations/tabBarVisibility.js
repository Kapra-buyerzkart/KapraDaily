import { Platform } from 'react-native';
import { makeMutable, withTiming } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const tabBarVisibility = makeMutable(1);

export const TAB_BAR_ANIM_DURATION = 250;
export const SCROLL_HIDE_THRESHOLD = 4;
export const TAB_BAR_EXTRA_HIDDEN_OFFSET = 20;

export function getTabBarHeight(insetsBottom) {
  return Platform.OS === 'android' ? hp('7%') + insetsBottom : hp('8%');
}

export function getTabBarClearance(insetsBottom) {
  return getTabBarHeight(insetsBottom);
}

export function updateTabBarVisibilityWorklet(y, scrollAnchor, atEnd) {
  'worklet';

  if (y <= 0 || atEnd) {
    scrollAnchor.value = y <= 0 ? 0 : y;
    if (tabBarVisibility.value !== 1) {
      tabBarVisibility.value = withTiming(1, {
        duration: TAB_BAR_ANIM_DURATION,
      });
    }
    return;
  }

  const diff = y - scrollAnchor.value;

  if (diff > SCROLL_HIDE_THRESHOLD) {
    scrollAnchor.value = y;
    if (tabBarVisibility.value !== 0) {
      tabBarVisibility.value = withTiming(0, {
        duration: TAB_BAR_ANIM_DURATION,
      });
    }
  } else if (diff < -SCROLL_HIDE_THRESHOLD) {
    scrollAnchor.value = y;
    if (tabBarVisibility.value !== 1) {
      tabBarVisibility.value = withTiming(1, {
        duration: TAB_BAR_ANIM_DURATION,
      });
    }
  }
}
