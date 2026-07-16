import { useState, useRef, useCallback, useMemo } from 'react';
import { Animated } from 'react-native';
import { TAB_IDS } from '@/components/events/EventCategoryTabs';

// Owns the active-tab state and the fade/slide transition between tabs.
const useTabNavigation = fetchEventDetailsList => {
  const [activeTab, setActiveTab] = useState(TAB_IDS.POPULAR);
  const tabAnim = useRef(new Animated.Value(1)).current;

  const handleTabChange = useCallback(
    tabId => {
      if (tabId === TAB_IDS.EVENTS) {
        fetchEventDetailsList();
      }
      Animated.timing(tabAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        setActiveTab(tabId);
        Animated.spring(tabAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      });
    },
    [fetchEventDetailsList, tabAnim],
  );

  const handleGoHome = useCallback(
    () => handleTabChange(TAB_IDS.POPULAR),
    [handleTabChange],
  );
  const handleGoToVouchers = useCallback(
    () => handleTabChange(TAB_IDS.VOUCHERS),
    [handleTabChange],
  );
  const handleGoToSports = useCallback(
    () => handleTabChange(TAB_IDS.SPORTS),
    [handleTabChange],
  );

  const tabContentStyle = useMemo(
    () => ({
      opacity: tabAnim,
      transform: [
        {
          translateY: tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    }),
    [tabAnim],
  );

  return {
    activeTab,
    tabContentStyle,
    handleTabChange,
    handleGoHome,
    handleGoToVouchers,
    handleGoToSports,
  };
};

export default useTabNavigation;
