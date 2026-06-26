import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CONFIG from '../../../globals/config';
import getCategoryPlaceholder from './getCategoryPlaceholder';
import categoryChipStyles from './categoryChipStyles';

const CategoryItem = React.memo(({ item }) => {
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);

  let imageSource;
  if (imageError || (!item.image && !item.imageUrl)) {
    imageSource = getCategoryPlaceholder(item.catName || item.name);
  } else if (item.image) {
    imageSource = item.image;
  } else {
    imageSource = { uri: `${CONFIG.image_base_url}${item.imageUrl}` };
  }

  return (
    <TouchableOpacity
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
    </TouchableOpacity>
  );
});

export default CategoryItem;
