import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import CONFIG from '../../../globals/config';
import getCategoryPlaceholder from './getCategoryPlaceholder';
import useCategoryTileStyles from './useCategoryTileStyles';
import AnimatedPressable from '../../../components/AnimatedPressable';
import CachedImage from '../../../components/CachedImage';
import { getStaggerDelay } from '../../../utils/staggerDelay';
import { selectionTick } from '../../../utils/haptics';
import { MAX_FONT_SCALE, SURFACE, categoryTint } from '@/styles/homeTheme';
import useOpaqueImageWell from '@/hooks/useOpaqueImageWell';

const CategoryItem = React.memo(({ item, index = 0 }) => {
  const navigation = useNavigation();
  const styles = useCategoryTileStyles();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item.image, item.imageUrl]);

  const label = item.catName || item.name;

  let imageSource;
  if (imageError || (!item.image && !item.imageUrl)) {
    imageSource = getCategoryPlaceholder(label);
  } else if (item.image) {
    imageSource = item.image;
  } else {
    imageSource = { uri: `${CONFIG.image_base_url}${item.imageUrl}` };
  }

  const isOpaqueImage = useOpaqueImageWell(imageSource?.uri || null);

  const handlePress = useCallback(() => {
    selectionTick();
    navigation.navigate('SearchScreen', {
      catId: item.catId || item.id,
      catName: label,
    });
  }, [navigation, item.catId, item.id, label]);

  return (
    <AnimatedPressable
      entering={FadeInUp.delay(getStaggerDelay(index))}
      style={styles.item}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${label} category`}
    >
      {}
      <View
        style={[
          styles.categoryItemContainer,
          {
            backgroundColor: isOpaqueImage ? SURFACE.base : categoryTint(index),
          },
        ]}
      >
        <CachedImage
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          onError={() => setImageError(true)}
          accessible={false}
        />
      </View>

      <Text
        style={styles.label}
        numberOfLines={2}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
});

export default CategoryItem;
