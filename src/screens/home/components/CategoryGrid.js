import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import CategoryItem from './CategoryItem';
import SectionHeader from './SectionHeader';
import useCategoryTileStyles, { COLUMNS } from './useCategoryTileStyles';
import { GUTTER, SPACE } from '@/styles/homeTheme';

const SHIMMER_TILES = Array.from({ length: COLUMNS * 2 }, (_, i) => i);

const GridHeader = () => (
  <SectionHeader
    title="Shop by"
    titleAccent="category"
    subtitle="Everyday essentials, delivered in minutes"
    style={styles.header}
  />
);

export const CategoryShimmer = () => {
  const tile = useCategoryTileStyles();

  return (
    <View style={styles.section}>
      <GridHeader />
      <View style={tile.grid}>
        {SHIMMER_TILES.map(i => (
          <View key={i} style={tile.item}>
            {}
            <View style={tile.categoryItemContainer}>
              <ShimmerPlaceholder style={tile.shimmerFill} />
            </View>
            <ShimmerPlaceholder style={tile.shimmerLabel} />
          </View>
        ))}
      </View>
    </View>
  );
};

const CategoryGrid = ({ categories }) => {
  const tile = useCategoryTileStyles();

  return (
    <View style={styles.section}>
      <GridHeader />
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
