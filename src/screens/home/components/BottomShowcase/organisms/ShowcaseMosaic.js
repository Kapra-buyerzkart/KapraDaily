import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MosaicTile } from '../molecules';
import { TILE_GAP, TILE_SHORT, TILE_STAGGER, TILE_TALL } from '../tokens';

const COLUMNS = 2;

const keyFor = (item, index) => String(item?.bannerId || item?.id || index);

const tileHeight = (column, row) =>
  (column + row) % 2 === 0 ? TILE_TALL : TILE_SHORT;

const ShowcaseMosaic = ({ items, onItemPress }) => {
  const columns = useMemo(
    () =>
      items.reduce(
        (acc, item, index) => {
          const column = index % COLUMNS;
          acc[column].push({
            item,
            index,
            height: tileHeight(column, acc[column].length),
          });
          return acc;
        },
        Array.from({ length: COLUMNS }, () => []),
      ),
    [items],
  );

  return (
    <View style={styles.mosaic}>
      {columns.map((tiles, column) => (
        <View
          key={`showcase-column-${column}`}
          style={[styles.column, column % 2 === 1 && styles.columnOffset]}
        >
          {tiles.map(tile => (
            <MosaicTile
              key={keyFor(tile.item, tile.index)}
              item={tile.item}
              index={tile.index}
              height={tile.height}
              onPress={onItemPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mosaic: {
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  column: {
    flex: 1,
    gap: TILE_GAP,
  },
  columnOffset: {
    marginTop: TILE_STAGGER,
  },
});

export default React.memo(ShowcaseMosaic);
