import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';

const HomeStatusBar = ({ scrollY, threshold, forceDark }) => {
  const [statusBarStyle, setStatusBarStyle] = useState('light-content');

  useAnimatedReaction(
    () => scrollY.value > threshold,
    (isHeaderLight, prev) => {
      if (isHeaderLight !== prev) {
        runOnJS(setStatusBarStyle)(
          isHeaderLight ? 'dark-content' : 'light-content',
        );
      }
    },
  );

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle={forceDark ? 'dark-content' : statusBarStyle}
    />
  );
};

export default React.memo(HomeStatusBar);
