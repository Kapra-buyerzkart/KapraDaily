import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ServiceTile } from '../molecules';
import { GUTTER, SPACING } from '../theme';
import { groupTilesIntoRows } from '../utils';

const ENTER_STEP = 70;

const ServiceGrid = ({ tiles, onSelect }) => {
  const rows = useMemo(() => groupTilesIntoRows(tiles), [tiles]);

  return (
    <View style={styles.grid}>
      {rows.map((row, index) => (
        <Animated.View
          key={row.key}
          entering={FadeInDown.delay(index * ENTER_STEP).duration(360)}
          style={[styles.row, row.span === 'half' && styles.splitRow]}
        >
          {row.items.map(tile => (
            <View
              key={tile.id}
              style={row.span === 'half' ? styles.splitCell : styles.fullCell}
            >
              <ServiceTile {...tile} onSelect={onSelect} />
            </View>
          ))}
        </Animated.View>
      ))}
    </View>
  );
};

export default React.memo(ServiceGrid);

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    paddingHorizontal: GUTTER,
    gap: SPACING.md,
  },
  row: {
    width: '100%',
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: SPACING.md,
  },
  splitCell: {
    flex: 1,
  },
  fullCell: {
    width: '100%',
  },
});
