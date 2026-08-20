import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SectionLabel } from '../atoms';
import MediaTile from '../molecules/MediaTile';
import { CARD_W, GUTTER, styles as shared } from '../styles';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_SPACING,
  hp,
} from '@/styles/cartTheme';

const TILE_W = (CARD_W - CART_SPACING.md) / 2;

interface GoatDealsGridProps {
  deals: any[];
  onPress: (deal: any) => void;
}

const GoatDealsGrid: React.FC<GoatDealsGridProps> = ({ deals, onPress }) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <MediaTile
        source={item.imageUrl || item.ImageUrl}
        onPress={() => onPress(item)}
        style={styles.tile}
        resizeMode="contain"
        a11y="Deal"
      />
    ),
    [onPress],
  );

  return (
    <View style={shared.section}>
      <SectionLabel>Goat deals</SectionLabel>
      <FlatList
        data={deals}
        renderItem={renderItem}
        keyExtractor={(item, i) =>
          item.bannerId?.toString() || item.id?.toString() || i.toString()
        }
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

export default React.memo(GoatDealsGrid);

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.md,
  },
  row: {
    gap: CART_SPACING.md,
  },
  tile: {
    width: TILE_W,
    height: hp('16%'),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
    ...CART_ELEVATION.card,
  },
});
