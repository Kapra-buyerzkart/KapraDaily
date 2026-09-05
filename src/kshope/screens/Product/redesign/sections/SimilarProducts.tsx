import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HOME_FONTS, SPACE, fs, s } from '../../../Home/redesign/theme';
import { mapProductTile } from '../../../Home/redesign/data/mappers';
import type { ProductTile } from '../../../Home/redesign/content';
import ProductCard from '../../../Category/redesign/sections/ProductCard';
import { PDP_COLORS } from '../theme';

type Props = {
  items: any[];
  isWishlisted: (item: any) => boolean;
  onPress: (item: any) => void;
  onToggleWishlist: (item: any) => void;
  onSeeAll?: () => void;
};

const CARD_W = s(168);

const Separator: React.FC = () => <View style={styles.separator} />;

const SimilarProducts: React.FC<Props> = ({
  items,
  isWishlisted,
  onPress,
  onToggleWishlist,
  onSeeAll,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const tiles = items.map(mapProductTile);

  const renderItem = ({ item }: { item: ProductTile }) => (
    <ProductCard
      item={item}
      width={CARD_W}
      compact
      wishlisted={isWishlisted(item.raw)}
      onPress={tile => onPress(tile.raw)}
      onToggleWishlist={tile => onToggleWishlist(tile.raw)}
    />
  );

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={onSeeAll ? 0.7 : 1}
        onPress={onSeeAll}
        style={styles.header}
      >
        <Text style={styles.heading}>Similar Products</Text>
      </TouchableOpacity>

      <FlatList
        horizontal
        data={tiles}
        keyExtractor={tile => tile.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: s(38),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(26),
  },
  heading: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(20),
    lineHeight: fs(20) * 1.3,
    color: PDP_COLORS.black,
  },
  list: {
    paddingHorizontal: s(26),
    paddingTop: s(20),
  },
  separator: {
    width: SPACE.md,
  },
});

export default SimilarProducts;
