import { useState, useEffect } from 'react';
import { Animated } from 'react-native';

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
