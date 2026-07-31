import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';

/**
 * Flips the status bar icons to dark once the sticky header background has gone
 * light, so they stay legible against it.
 *
 * This lives in its own leaf component on purpose. The threshold crossing is
 * React state, and while it was declared in HomeScreen it re-rendered the
 * entire home tree — sticky header, every product block, the discovery
 * section — in the middle of an active scroll gesture. Owning the state here
 * means the crossing re-renders one <StatusBar> and nothing else.
 *
 * The reaction still only hops to the JS thread on an actual crossing, not
 * per frame.
 */
const HomeStatusBar = ({ scrollY, threshold }) => {
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
      barStyle={statusBarStyle}
    />
  );
};

export default React.memo(HomeStatusBar);
