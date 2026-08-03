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
      <View style={styles.categoriesContainer}>
        {SHIMMER_TILES.map(i => (
          <View key={i} style={tile.item}>
            {/* Reuses the real tile's box so the shimmer occupies exactly the
                grid's geometry and nothing shifts when categories arrive. */}
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

const CategoryGrid = ({ categories }) => (
  <View style={styles.section}>
    <GridHeader />
    <View style={styles.categoriesContainer}>
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

const styles = StyleSheet.create({
  // Flat section on the page — spacing and the header's type hierarchy do the
  // separating, not a surface change.
  section: {
    paddingBottom: SPACE.sm,
  },
  header: {
    paddingHorizontal: GUTTER,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // flex-start, not space-between: a final row with 2 or 3 tiles must stay
    // left-aligned under the rows above it rather than spreading to the edges.
    // The cells divide this box exactly (see useCategoryTileStyles), so the
    // grid lines up with the header's gutter instead of drifting left.
    justifyContent: 'flex-start',
    paddingHorizontal: GUTTER,
  },
});

export default React.memo(CategoryGrid);
