import React from 'react';
import { View, StyleSheet } from 'react-native';
import useCategoryTileStyles, { COLUMNS } from '../../useCategoryTileStyles';
import { CategoryTileBone, HeadingBones } from '../molecules';
import { SPACING } from '../tokens';

const TILES = Array.from({ length: COLUMNS * 2 }, (_, i) => i);

const CategoryGridSkeleton = () => {
  const tile = useCategoryTileStyles();

  return (
    <View style={styles.section}>
      <HeadingBones eyebrow={false} subtitle />
      <View style={tile.grid}>
        {TILES.map(i => (
          <CategoryTileBone key={i} tile={tile} />
        ))}
      </View>
    </View>
  );
};

export default React.memo(CategoryGridSkeleton);

const styles = StyleSheet.create({
  section: {
    paddingBottom: SPACING.sm,
  },
});
