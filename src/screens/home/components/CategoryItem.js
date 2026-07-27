import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import CONFIG from '../../../globals/config';
import getCategoryPlaceholder from './getCategoryPlaceholder';
import categoryChipStyles from './categoryChipStyles';
import AnimatedPressable from '../../../components/AnimatedPressable';
import { getStaggerDelay } from '../../../utils/staggerDelay';

const CategoryItem = React.memo(({ item, index = 0 }) => {
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);

  // Reset the error latch when the image changes so a recycled chip does not
  // keep showing the placeholder from a previous category.
  useEffect(() => {
    setImageError(false);
  }, [item.image, item.imageUrl]);

  let imageSource;
  if (imageError || (!item.image && !item.imageUrl)) {
    imageSource = getCategoryPlaceholder(item.catName || item.name);
  } else if (item.image) {
    imageSource = item.image;
  } else {
    imageSource = { uri: `${CONFIG.image_base_url}${item.imageUrl}` };
  }

  return (
    <AnimatedPressable
      entering={FadeInUp.delay(getStaggerDelay(index))}
      style={categoryChipStyles.item}
      onPress={() =>
        navigation.navigate('SearchScreen', {
          catId: item.catId || item.id,
          catName: item.catName || item.name,
        })
      }
    >
      <View style={categoryChipStyles.categoryItemContainer}>
        <Image
          source={imageSource}
          style={categoryChipStyles.image}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      </View>

      <Text style={categoryChipStyles.label} numberOfLines={2}>
        {item.catName || item.name}
      </Text>
    </AnimatedPressable>
  );
});

export default CategoryItem;
