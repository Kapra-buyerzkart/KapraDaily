import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ProductTile } from '../../../Home/redesign/content';
import { Fonts } from '../../../../theme/fonts';
import { pt } from '../../../../theme/tokens';
import {
  CARD_GAP,
  SPACE,
  colWidth,
  s,
} from '../../../Home/redesign/theme';
import { isOutOfStock } from '../data/selectors';

type Props = {
  item: ProductTile;
  wishlisted?: boolean;
  width?: number;
  compact?: boolean;
  onPress?: (item: ProductTile) => void;
  onToggleWishlist?: (item: ProductTile) => void;
};

export const CARD_W = colWidth(2, CARD_GAP);

const ProductCard: React.FC<Props> = ({
  item,
  wishlisted,
  width,
  compact,
  onPress,
  onToggleWishlist,
}) => {
  const outOfStock = isOutOfStock(item.raw);
  const cardWidth = width ?? (compact ? CARD_W * 0.88 : CARD_W);
  const imageSource =
    typeof item.image === 'string' ? { uri: item.image } : item.image;

  return (
    <TouchableOpacity
      testID={`product-card-${item.id}`}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
      style={[styles.card, { width: cardWidth }]}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, { height: cardWidth * 0.92 }]}>
        {imageSource ? (
          <Image source={imageSource} resizeMode="cover" style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="diamond-outline" size={s(28)} color="#C5A869" />
          </View>
        )}

        {outOfStock ? (
          <View style={styles.stockOverlay}>
            <Text style={styles.stockText}>OUT OF STOCK</Text>
          </View>
        ) : null}
      </View>

      {/* Card Info Below Image */}
      <View style={styles.body}>
        {/* Line 1: Title + Heart */}
        <View style={styles.titleRow}>
          <View style={styles.nameBlock}>
            {item.brand ? (
              <Text style={styles.brand} numberOfLines={1}>
                {item.brand}
              </Text>
            ) : null}
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <TouchableOpacity
            testID={`product-heart-${item.id}`}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => onToggleWishlist?.(item)}
            style={styles.heartButton}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={s(16)}
              color={wishlisted ? '#C45A5A' : '#1A1A1A'}
            />
          </TouchableOpacity>
        </View>

        {/* Line 2: Specification Subtitle */}
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}

        {/* Line 3: Price + MRP + Discount */}
        <View style={styles.priceRow}>
          <Text style={styles.price} numberOfLines={1}>
            {item.price || '₹ —'}
          </Text>
          {item.mrp ? (
            <Text style={styles.mrp} numberOfLines={1}>
              {item.mrp}
            </Text>
          ) : null}
          {item.discount ? (
            <Text style={styles.discount} numberOfLines={1}>
              {item.discount}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACE.lg,
  },
  imageContainer: {
    width: '100%',
    borderRadius: s(14),
    backgroundColor: '#FAF7F2',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(9.5),
    color: '#0C382E',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACE.xs,
    paddingVertical: s(2),
    borderRadius: s(4),
  },
  body: {
    paddingTop: s(8),
    paddingHorizontal: s(4),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameBlock: {
    flex: 1,
    marginRight: s(6),
  },
  brand: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(13),
    color: '#1A1A1A',
    lineHeight: pt(17),
  },
  name: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(15),
    lineHeight: pt(19),
    color: '#1A1A1A',
  },
  heartButton: {
    padding: s(2),
  },
  subtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9.5),
    lineHeight: pt(14),
    color: '#767676',
    marginTop: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: s(3),
    rowGap: s(1),
  },
  price: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(12.5),
    lineHeight: pt(17),
    color: '#1A1A1A',
  },
  mrp: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9.5),
    lineHeight: pt(13),
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(9.5),
    lineHeight: pt(13),
    color: '#0C382E',
  },
});

export default ProductCard;
