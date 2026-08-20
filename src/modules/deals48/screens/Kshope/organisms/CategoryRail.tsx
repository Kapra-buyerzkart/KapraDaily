import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { SectionLabel } from '../atoms';
import CategoryTile from '../molecules/CategoryTile';
import { styles } from '../styles';

interface CategoryRailProps {
  categories: any[];
  onSelect: (cat: any) => void;
}

const CategoryRail: React.FC<CategoryRailProps> = ({
  categories,
  onSelect,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <CategoryTile item={item} onPress={() => onSelect(item)} />
    ),
    [onSelect],
  );

  return (
    <View style={styles.section}>
      <SectionLabel>Shop by category</SectionLabel>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, i) => `cat_${item.catId || i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
      />
    </View>
  );
};

export default React.memo(CategoryRail);
