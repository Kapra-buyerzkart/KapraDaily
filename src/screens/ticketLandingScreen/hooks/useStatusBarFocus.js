import { useCallback } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Re-applies the translucent light-content status bar whenever the screen
// regains focus (e.g. after a modal that changed the bar style closes).
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
