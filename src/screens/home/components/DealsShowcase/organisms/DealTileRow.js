import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DealTile } from '../molecules';
import { TILE_GAP } from '../tokens';

const keyFor = (item, index) => String(item?.bannerId || item?.id || index);

const DealTileRow = ({ items, offerFor, onItemPress }) => (
  <View style={styles.row}>
    {items.map((item, index) => (
      <DealTile
        key={keyFor(item, index)}
        item={item}
        index={index}
        offer={offerFor(item)}
        onPress={onItemPress}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: TILE_GAP,
  },
});

export default React.memo(DealTileRow);
