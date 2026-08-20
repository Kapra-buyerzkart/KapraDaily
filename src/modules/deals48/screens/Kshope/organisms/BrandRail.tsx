import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { SectionLabel } from '../atoms';
import BrandTile from '../molecules/BrandTile';
import { styles } from '../styles';

interface BrandRailProps {
  brands: any[];
  onSelect: (brand: any) => void;
}

const BrandRail: React.FC<BrandRailProps> = ({ brands, onSelect }) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <BrandTile item={item} onPress={() => onSelect(item)} />
    ),
    [onSelect],
  );

  return (
    <View style={styles.section}>
      <SectionLabel>Top brands</SectionLabel>
      <FlatList
        data={brands}
        renderItem={renderItem}
        keyExtractor={(_, i) => `brand_${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
      />
    </View>
  );
};

export default React.memo(BrandRail);
