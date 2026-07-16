import { useState, useCallback } from 'react';
import { Animated } from 'react-native';

// Cross-fades the background image in, then the content on top of it, once
// the hero background image finishes loading.
const useHeroFade = () => {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [imageOpacity] = useState(() => new Animated.Value(0));

  const handleImageLoad = useCallback(() => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  }, [imageOpacity, fadeAnim]);

  return { fadeAnim, imageOpacity, handleImageLoad };
};

export default useHeroFade;
