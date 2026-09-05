import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ProductTile } from '../content';
import { DiscountBadge, ProductImage, StrikePrice } from '../parts';
import {
  CARD_GAP,
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  colWidth,
  fs,
  s,
} from '../theme';

const HeartOutline: React.FC<{ active?: boolean }> = ({ active }) => (
  <Svg width={s(14)} height={s(12)} viewBox="-0.8 -0.8 15.6 13.6" fill="none">
    <Path
      d="M13.6613 2.45916C13.4441 1.97793 13.1309 1.54184 12.7392 1.17532C12.3472 0.807695 11.8851 0.51555 11.3779 0.31477C10.852 0.105731 10.288 -0.0012594 9.71847 1.11852e-05C8.91954 1.11852e-05 8.14005 0.209334 7.46266 0.60472C7.3006 0.699 7.14666 0.802563 7.00082 0.914939C6.85498 0.802563 6.70104 0.699 6.53898 0.60472C5.86159 0.209334 5.0821 1.11852e-05 4.28317 1.11852e-05C3.71362 -0.0012594 3.14965 0.105731 2.62371 0.31477C2.11491 0.51555 1.65442 0.807695 1.2624 1.17532C0.870729 1.54184 0.557527 1.97793 0.340362 2.45916C0.114559 2.95949 0 3.49103 0 4.03789C0 4.55354 0.111323 5.09084 0.332273 5.63855C0.517301 6.09646 0.782452 6.57139 1.12129 7.05064C1.65792 7.80891 2.39605 8.59972 3.3129 9.40095C4.83184 10.7284 6.33594 11.6449 6.39975 11.6821L6.7873 11.9167C6.91427 11.9932 7.08574 11.9932 7.21271 11.9167L7.60026 11.6821C7.66407 11.6438 9.16709 10.7284 10.6871 9.40095C11.604 8.59972 12.3421 7.80891 12.8787 7.05064C13.2176 6.57139 13.4838 6.09646 13.6677 5.63855C13.8887 5.09084 14 4.55354 14 4.03789C14 3.49103 13.8854 2.95949 13.6613 2.45916Z"
      fill={active ? HOME_COLORS.orange : 'none'}
      stroke={active ? HOME_COLORS.orange : HOME_COLORS.muted}
      strokeWidth={0.9}
    />
  </Svg>
);

type Props = {
  items: ProductTile[];
  onPressProduct?: (item: ProductTile) => void;
  onToggleWishlist?: (item: ProductTile) => void;
  wishlisted?: string[];
};

const FeaturedRow: React.FC<Props> = ({
  items,
  onPressProduct,
  onToggleWishlist,
  wishlisted = [],
}) => (
  <View style={styles.wrap}>
    <FlatList
      data={items}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onPressProduct?.(item)}
          style={styles.card}
        >
          <View style={styles.cardTop}>
            <DiscountBadge label={item.discount} style={styles.badge} />
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => onToggleWishlist?.(item)}
              style={styles.heart}
            >
              <HeartOutline active={wishlisted.includes(item.id)} />
            </TouchableOpacity>
            <ProductImage
              source={item.image}
              resizeMode="contain"
              style={styles.productImage}
            />
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.brand} numberOfLines={1}>
              {item.brand}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price} numberOfLines={1}>
              {item.price}
            </Text>
            <StrikePrice value={item.mrp} size={8} />
          </View>
        </TouchableOpacity>
      )}
    />

    {/* <Image
      source={HOME_ART.stripDivider}
      resizeMode="cover"
      style={styles.strip}
    /> */}
  </View>
);

const CARD_W = colWidth(3, CARD_GAP);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  row: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.lg,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_W,
    borderRadius: RADIUS.md,
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.cardBorder,
    overflow: 'hidden',
  },
  cardTop: {
    height: CARD_W * 0.94,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HOME_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACE.lg,
    paddingHorizontal: SPACE.xs,
  },
  badge: {
    position: 'absolute',
    top: SPACE.sm,
    left: SPACE.sm,
    zIndex: 2,
  },
  heart: {
    position: 'absolute',
    top: SPACE.sm,
    right: SPACE.sm,
    zIndex: 2,
  },
  productImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  cardBody: {
    paddingHorizontal: SPACE.md,
    paddingBottom: SPACE.md,
  },
  brand: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.35,
    color: HOME_COLORS.black,
  },
  name: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(9),
    lineHeight: fs(9) * 1.45,
    color: HOME_COLORS.muted,
    marginTop: SPACE.xxs / 2,
  },
  price: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.35,
    color: HOME_COLORS.black,
    marginTop: SPACE.xs,
  },
  strip: {
    width: '100%',
    height: s(41),
    marginTop: SPACE.lg,
  },
});

export default FeaturedRow;
