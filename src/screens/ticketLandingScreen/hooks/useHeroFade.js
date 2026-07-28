import { useState, useEffect } from 'react';
import { Animated } from 'react-native';

// Fades the content in on mount. The screen paints a flat background colour now
// (no hero image to wait on), so the fade starts as soon as we render.
const useHeroFade = () => {
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return { fadeAnim };
};

export default useHeroFade;
