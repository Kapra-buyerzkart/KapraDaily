import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { StrikePrice, imageSource } from '../../../Home/redesign/parts';
import { mapProductTile } from '../../../Home/redesign/data/mappers';
import type { ProductTile } from '../../../Home/redesign/content';
import { ChevronIcon, HeartOutlineIcon, HeartSolidIcon } from '../icons';
import { money } from '../data/selectors';
import { PDP_COLORS } from '../theme';

type Props = {
  items: any[];
  isWishlisted: (item: any) => boolean;
  onPress: (item: any) => void;
  onToggleWishlist: (item: any) => void;
  onSeeAll?: () => void;
};

const CARD_W = s(208);

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

  const renderItem = ({ item }: { item: ProductTile }) => {
    const wishlisted = isWishlisted(item.raw);
    const mrp = money(item.raw?.unitPrice);
    const price = money(item.raw?.specialPrice || item.raw?.unitPrice);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(item.raw)}
        style={styles.card}
      >
        <View style={styles.cardTop}>
          {item.discount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.discount}</Text>
            </View>
          ) : (
            <View />
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => onToggleWishlist(item.raw)}
          >
            {wishlisted ? (
              <HeartSolidIcon
                width={22}
                height={20}
                color={PDP_COLORS.orange}
              />
            ) : (
              <HeartOutlineIcon width={22} height={20} />
            )}
          </TouchableOpacity>
        </View>

        <Image
          source={imageSource(item.image)}
          resizeMode="contain"
          style={styles.image}
        />

        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{price}</Text>
          {mrp && mrp !== price ? (
            <StrikePrice
              value={`MRP ${mrp}`}
              size={12}
              color={PDP_COLORS.muted}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={onSeeAll ? 0.7 : 1}
        onPress={onSeeAll}
        style={styles.header}
      >
        <Text style={styles.heading}>Similar Products</Text>
        <ChevronIcon width={8} height={14} />
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
    paddingHorizontal: s(12),
    paddingTop: s(20),
  },
  separator: {
    width: s(2),
    backgroundColor: PDP_COLORS.rule,
    marginHorizontal: s(13),
  },
  card: {
    width: CARD_W,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    height: s(23),
    width: s(55),
    borderRadius: s(5),
    backgroundColor: PDP_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(10),
    color: PDP_COLORS.white,
  },
  image: {
    width: '100%',
    height: s(96),
    marginTop: s(12),
  },
  name: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.35,
    color: PDP_COLORS.black,
    marginTop: s(14),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: s(8),
    marginTop: s(10),
  },
  price: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(20),
    lineHeight: fs(20) * 1.25,
    color: PDP_COLORS.black,
  },
});

export default SimilarProducts;
