import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import CONFIG from '../../../globals/config';
import getCategoryPlaceholder from './getCategoryPlaceholder';
import useCategoryTileStyles from './useCategoryTileStyles';
import AnimatedPressable from '../../../components/AnimatedPressable';
import { getStaggerDelay } from '../../../utils/staggerDelay';
import { selectionTick } from '../../../utils/haptics';
import { MAX_FONT_SCALE, categoryTint } from '@/styles/homeTheme';

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
      {/* The well's tint is per-tile, so it stays out of the cached
          StyleSheet (which is keyed on window width alone) and rides on top. */}
      <View
        style={[
          styles.categoryItemContainer,
          { backgroundColor: categoryTint(index) },
        ]}
      >
        <Image
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
