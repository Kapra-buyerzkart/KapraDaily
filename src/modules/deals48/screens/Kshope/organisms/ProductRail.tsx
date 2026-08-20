import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SectionLabel } from '../atoms';
import ExploreItem from '../../../components/ExploreItem/ExploreItem';
import ClickForMoreButton from '../../../components/ClickForMoreButton/ClickForMoreButton';
import { GUTTER, styles as shared } from '../styles';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
} from '@/styles/cartTheme';

interface ProductRailProps {
  title: string;
  products: any[];
  moreLabel: string;
  onOpenProduct: (item: any) => void;
  onSeeAll: () => void;
  toggleWishlist: (item: any) => void;
  isInWishlist: (id: any) => boolean;
  keyPrefix: string;
}

const ProductRail: React.FC<ProductRailProps> = ({
  title,
  products,
  moreLabel,
  onOpenProduct,
  onSeeAll,
  toggleWishlist,
  isInWishlist,
  keyPrefix,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ExploreItem
        item={item}
        style={styles.card}
        onPress={() => onOpenProduct(item)}
        toggleWishlist={toggleWishlist}
        isInWishlist={id => isInWishlist(id)}
      />
    ),
    [onOpenProduct, toggleWishlist, isInWishlist],
  );

  return (
    <View style={shared.section}>
      <SectionLabel>{title}</SectionLabel>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${keyPrefix}_${item.productId || i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      />
      <View style={shared.more}>
        <ClickForMoreButton onPress={onSeeAll} title={moreLabel} />
      </View>
    </View>
  );
};

export default React.memo(ProductRail);

const styles = StyleSheet.create({
  rail: {
    paddingHorizontal: GUTTER,
  },
  card: {
    borderRadius: CART_RADIUS.productCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
    ...CART_ELEVATION.card,
  },
});
