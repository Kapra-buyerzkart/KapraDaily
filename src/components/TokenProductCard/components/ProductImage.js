import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import CachedImage from '@/components/CachedImage';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import styles from '../styles';
import { IMAGE_FADE } from '../constants';

const ProductImage = ({ imageSource, isPlaceholder, isOutOfStock, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const opacity = useSharedValue(isPlaceholder ? 1 : 0);

  useEffect(() => {
    if (isPlaceholder) {
      setLoaded(true);
      opacity.value = 1;
    } else {
      setLoaded(false);
      opacity.value = 0;
    }
  }, [imageSource, isPlaceholder, opacity]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    opacity.value = withTiming(1, IMAGE_FADE);
  }, [opacity]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.productImageFill,
          isOutOfStock && styles.productImageOutOfStock,
          imageAnimatedStyle,
        ]}
      >
        <CachedImage
          source={imageSource}
          style={styles.productImageInner}
          resizeMode="contain"
          transitionDuration={0}
          onLoad={handleLoad}
          onError={onError}
          accessible={false}
        />
      </Animated.View>

      {!isPlaceholder && !loaded && (
        <ShimmerPlaceholder style={styles.imageShimmer} />
      )}

      {isOutOfStock && (
        <View style={styles.outOfStockOverlay}>
          <View style={styles.outOfStockPill}>
            <Text
              style={styles.outOfStockText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Out of stock
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default React.memo(ProductImage);
