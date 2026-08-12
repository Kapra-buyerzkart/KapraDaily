import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { CART_GUTTER, CART_SPACING } from '@/styles/cartTheme';
import AreaChip from '../atoms/AreaChip';

const AreaChipsRow = ({ areas, activeArea, onSelect }) => {
  const activeId = activeArea?.pincodeAreaId || activeArea?.id;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {areas.map((area, index) => {
        const areaId = area.pincodeAreaId || area.id;

        return (
          <AreaChip
            key={areaId || index}
            label={area.areaName || area.name || `Area ${index + 1}`}
            selected={activeId === areaId}
            onPress={() => onSelect(area)}
          />
        );
      })}
    </ScrollView>
  );
};

export default React.memo(AreaChipsRow);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: CART_GUTTER,
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
});
