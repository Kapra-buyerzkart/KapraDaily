import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { ProductTile } from '../../../Home/redesign/content';
import {
  StrikePrice,
  TokenBadge,
  ProductImage,
} from '../../../Home/redesign/parts';
import {
  CARD_GAP,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  colWidth,
  fs,
  s,
} from '../../../Home/redesign/theme';
import { isOutOfStock } from '../data/selectors';

const Heart: React.FC<{ active?: boolean }> = ({ active }) => (
  <Svg width={s(16)} height={s(14)} viewBox="-0.8 -0.8 15.6 13.6" fill="none">
    <Path
      d="M13.6613 2.45916C13.4441 1.97793 13.1309 1.54184 12.7392 1.17532C12.3472 0.807695 11.8851 0.51555 11.3779 0.31477C10.852 0.105731 10.288 -0.0012594 9.71847 1.11852e-05C8.91954 1.11852e-05 8.14005 0.209334 7.46266 0.60472C7.3006 0.699 7.14666 0.802563 7.00082 0.914939C6.85498 0.802563 6.70104 0.699 6.53898 0.60472C5.86159 0.209334 5.0821 1.11852e-05 4.28317 1.11852e-05C3.71362 -0.0012594 3.14965 0.105731 2.62371 0.31477C2.11491 0.51555 1.65442 0.807695 1.2624 1.17532C0.870729 1.54184 0.557527 1.97793 0.340362 2.45916C0.114559 2.95949 0 3.49103 0 4.03789C0 4.55354 0.111323 5.09084 0.332273 5.63855C0.517301 6.09646 0.782452 6.57139 1.12129 7.05064C1.65792 7.80891 2.39605 8.59972 3.3129 9.40095C4.83184 10.7284 6.33594 11.6449 6.39975 11.6821L6.7873 11.9167C6.91427 11.9932 7.08574 11.9932 7.21271 11.9167L7.60026 11.6821C7.66407 11.6438 9.16709 10.7284 10.6871 9.40095C11.604 8.59972 12.3421 7.80891 12.8787 7.05064C13.2176 6.57139 13.4838 6.09646 13.6677 5.63855C13.8887 5.09084 14 4.55354 14 4.03789C14 3.49103 13.8854 2.95949 13.6613 2.45916Z"
      fill={active ? HOME_COLORS.orange : 'none'}
      stroke={active ? HOME_COLORS.orange : HOME_COLORS.muted}
      strokeWidth={1.1}
    />
  </Svg>
);

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
  const cardWidth = width ?? CARD_W;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={[styles.cardTop, { height: cardWidth * 1.13 }]}>
        <ProductImage source={item.image} style={styles.image} />
        {item.discount ? (
          <View
            style={[
              styles.discountBadge,
              compact && compactStyles.discountBadge,
            ]}
          >
            <Text
              style={[styles.discount, compact && compactStyles.discount]}
              numberOfLines={1}
            >
              {item.discount}
            </Text>
          </View>
        ) : null}
        {outOfStock ? (
          <View style={styles.stockOverlay}>
            <Text style={styles.stockText}>OUT OF STOCK</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.cardBody, compact && compactStyles.cardBody]}>
        <View style={styles.nameRow}>
          <View style={styles.nameBlock}>
            {item.brand ? (
              <Text
                style={[styles.brand, compact && compactStyles.brand]}
                numberOfLines={1}
              >
                {item.brand}
              </Text>
            ) : null}
            <Text
              style={[styles.name, compact && compactStyles.name]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => onToggleWishlist?.(item)}
          >
            <Heart active={wishlisted} />
          </TouchableOpacity>
        </View>

        {item.tokens > 0 ? (
          <TokenBadge
            tokens={item.tokens}
            size={compact ? 8 : 9}
            style={styles.tokenBadge}
          />
        ) : null}

        <View style={[styles.priceRow, compact && compactStyles.priceRow]}>
          <Text
            style={[styles.price, compact && compactStyles.price]}
            numberOfLines={1}
          >
            {item.price}
          </Text>
          {item.mrp ? (
            <StrikePrice
              value={item.mrp}
              size={compact ? 9 : 12}
              color={HOME_COLORS.strike}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const compactStyles = StyleSheet.create({
  cardBody: {
    paddingHorizontal: SPACE.xs,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  brand: {
    fontSize: fs(11),
    lineHeight: fs(11) * 1.3,
  },
  name: {
    fontSize: fs(11),
    lineHeight: fs(11) * 1.3,
  },
  priceRow: {
    marginTop: SPACE.xs,
    gap: SPACE.xxs,
  },
  price: {
    fontSize: fs(12),
    lineHeight: fs(12) * 1.3,
  },
  discount: {
    fontSize: fs(9),
    lineHeight: fs(9) * 1.35,
  },
  discountBadge: {
    top: SPACE.xs,
    left: SPACE.xs,
    paddingHorizontal: s(5),
    paddingVertical: s(2),
  },
});

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    borderRadius: RADIUS.sm,
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.recCardBorder,
    overflow: 'hidden',
    marginBottom: SPACE.lg,
  },
  cardTop: {
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockText: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(10),
    color: HOME_COLORS.black,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: SPACE.xs,
    paddingVertical: SPACE.xxs / 2,
    borderRadius: RADIUS.sm / 2,
    overflow: 'hidden',
  },
  cardBody: {
    paddingHorizontal: SPACE.sm,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACE.xs,
  },
  nameBlock: {
    flex: 1,
  },
  brand: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.3,
    color: HOME_COLORS.black,
  },
  name: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.3,
    color: HOME_COLORS.muted,
  },
  tokenBadge: {
    marginTop: SPACE.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.sm,
    gap: SPACE.xs,
  },
  price: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(16),
    lineHeight: fs(16) * 1.3,
    color: HOME_COLORS.black,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACE.sm,
    left: SPACE.sm,
    paddingHorizontal: s(7),
    paddingVertical: s(3),
    borderRadius: s(999),
    backgroundColor: HOME_COLORS.orange,
  },
  discount: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.35,
    color: HOME_COLORS.white,
  },
});

export default ProductCard;
