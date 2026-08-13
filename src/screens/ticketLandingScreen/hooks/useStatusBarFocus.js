import { useCallback } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const useStatusBarFocus = () => {
  const applyStatusBar = useCallback(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      applyStatusBar();
    }, [applyStatusBar]),
  );

  return applyStatusBar;
};

export default useStatusBarFocus;
