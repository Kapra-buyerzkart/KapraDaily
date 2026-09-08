import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { TokenBadge } from '../../../Home/redesign/parts';
import { PDP_ART } from '../assets';
import { PDP_COLORS } from '../theme';

type Props = {
  title: string;
  subtitle: string;
  price: string;
  mrp: string;
  saveLabel: string;
  average: string;
  ratings: number;
  reviews: number;
  hasRating: boolean;
  tokens: number;
  action?: React.ReactNode;
};

const PriceHeader: React.FC<Props> = ({
  title,
  subtitle,
  price,
  mrp,
  saveLabel,
  average,
  ratings,
  reviews,
  hasRating,
  tokens,
  action,
}) => (
  <View style={styles.wrap}>
    <View style={styles.main}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.priceRow}>
        <Text style={styles.price} numberOfLines={1}>
          {price}
        </Text>
        {mrp ? (
          <Text style={styles.mrp} numberOfLines={1}>{`MRP ${mrp}`}</Text>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <View style={styles.actionMeta}>
          {saveLabel ? (
            <Text style={styles.save} numberOfLines={1}>
              {saveLabel}
            </Text>
          ) : null}
          {tokens > 0 ? (
            <TokenBadge tokens={tokens} size={11} style={styles.tokenBadge} />
          ) : null}
        </View>
        {action}
      </View>
    </View>

    {hasRating ? (
      <View style={styles.ratingCol}>
        <View style={styles.ratingRow}>
          <Image
            source={PDP_ART.ratingStar}
            resizeMode="contain"
            style={styles.star}
          />
          <Text style={styles.average}>{average}</Text>
        </View>
        {ratings > 0 ? (
          <Text style={styles.ratingMeta}>{`${ratings} Rating`}</Text>
        ) : null}
        {reviews > 0 ? (
          <Text style={styles.ratingMeta}>{`${reviews} Reviews`}</Text>
        ) : null}
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: s(26),
    paddingTop: s(24),
  },
  main: {
    flex: 1,
    paddingRight: s(12),
  },
  title: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(20),
    lineHeight: fs(20) * 1.3,
    color: PDP_COLORS.black,
  },
  subtitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.35,
    color: PDP_COLORS.black,
    marginTop: s(10),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: s(10),
    rowGap: s(4),
    marginTop: s(12),
  },
  price: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(32),
    lineHeight: fs(32) * 1.1,
    color: PDP_COLORS.black,
  },
  mrp: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    lineHeight: fs(32) * 1.1,
    color: PDP_COLORS.muted,
    textDecorationLine: 'line-through',
    textDecorationColor: PDP_COLORS.muted,
  },
  save: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.35,
    color: PDP_COLORS.save,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(12),
    marginTop: s(12),
  },
  actionMeta: {
    flex: 1,
    gap: s(8),
    alignItems: 'flex-start',
  },
  tokenBadge: {
    alignSelf: 'flex-start',
  },
  ratingCol: {
    alignItems: 'flex-start',
    paddingTop: s(56),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  star: {
    width: s(20),
    height: s(20),
  },
  average: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(16),
    color: PDP_COLORS.black,
  },
  ratingMeta: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.35,
    color: PDP_COLORS.black,
    marginTop: s(2),
  },
});

export default PriceHeader;
