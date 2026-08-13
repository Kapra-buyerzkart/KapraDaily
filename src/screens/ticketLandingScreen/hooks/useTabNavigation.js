import { useState, useRef, useCallback, useMemo } from 'react';
import { Animated, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TAB_IDS } from '@/components/events/EventCategoryTabs';

const useTabNavigation = fetchTabData => {
  const [activeTab, setActiveTab] = useState(TAB_IDS.POPULAR);
  const tabAnim = useRef(new Animated.Value(1)).current;
  const inFlightTabs = useRef(new Set()).current;

  const handleTabChange = useCallback(
    tabId => {
      if (!inFlightTabs.has(tabId)) {
        inFlightTabs.add(tabId);
        Promise.resolve(fetchTabData?.(tabId))
          .catch(() => {})
          .finally(() => inFlightTabs.delete(tabId));
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
    [fetchTabData, inFlightTabs, tabAnim],
  );

  const handleGoHome = useCallback(
    () => handleTabChange(TAB_IDS.POPULAR),
    [handleTabChange],
  );

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeTabRef.current !== TAB_IDS.POPULAR) {
          handleGoHome();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [handleGoHome]),
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
