import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';
import SectionHeader from './SectionHeader';
import useCategoryTileStyles from './useCategoryTileStyles';
import { GUTTER, SPACE } from '@/styles/homeTheme';

const CategoryGrid = ({ categories }) => {
  const tile = useCategoryTileStyles();

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Shop by"
        titleAccent="category"
        subtitle="Everyday essentials, delivered in minutes"
        style={styles.header}
      />
      <View style={tile.grid}>
        {categories.map((item, index) => (
          <CategoryItem
            key={(item.catId || item.id || index).toString()}
            item={item}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: SPACE.sm,
  },
  header: {
    paddingHorizontal: GUTTER,
  },
});

export default React.memo(CategoryGrid);
