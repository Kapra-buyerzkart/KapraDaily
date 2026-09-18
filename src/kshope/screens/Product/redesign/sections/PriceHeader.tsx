import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { TokenBadge } from '../../../Home/redesign/parts';
import { PDP_COLORS } from '../theme';

type Props = {
  title: string;
  subtitle: string;
  price: string;
  mrp: string;
  saveLabel: string;
  savingBadge?: string;
  average?: string;
  ratings?: number;
  reviews?: number;
  hasRating?: boolean;
  tokens?: number;
};

const formatPriceWithSlash = (val: string) => {
  if (!val) return '';
  const trimmed = val.trim();
  return trimmed.endsWith('/-') ? trimmed : `${trimmed}/-`;
};

const PriceHeader: React.FC<Props> = ({
  title,
  subtitle,
  price,
  mrp,
  saveLabel,
  savingBadge,
  tokens = 0,
}) => {
  const displaySave = savingBadge || (saveLabel ? `You are saving ${saveLabel}` : '');

  return (
    <View style={styles.wrap}>
      {/* Left column: Title & Subtitle */}
      <View style={styles.titleCol}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {tokens > 0 ? (
          <TokenBadge tokens={tokens} size={11} style={styles.tokenBadge} />
        ) : null}
      </View>

      {/* Vertical Divider */}
      <View style={styles.divider} />

      {/* Right column: Price, MRP & Savings */}
      <View style={styles.priceCol}>
        <View style={styles.priceRow}>
          <Text style={styles.price} numberOfLines={1}>
            {formatPriceWithSlash(price)}
          </Text>
          {mrp ? (
            <Text style={styles.mrp} numberOfLines={1}>
              {formatPriceWithSlash(mrp)}
            </Text>
          ) : null}
        </View>

        {displaySave ? (
          <View style={styles.savingsPill}>
            <Text style={styles.savingsText} numberOfLines={1}>
              {displaySave}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: s(16),
    paddingBottom: s(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PDP_COLORS.rule,
  },
  titleCol: {
    flex: 1.15,
    justifyContent: 'center',
    paddingRight: s(10),
  },
  title: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(21),
    lineHeight: fs(21) * 1.25,
    color: '#1A1A1A',
  },
  subtitle: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.35,
    color: '#777777',
    marginTop: s(4),
  },
  tokenBadge: {
    alignSelf: 'flex-start',
    marginTop: s(6),
  },
  divider: {
    width: 1,
    backgroundColor: '#E5DFD7',
    alignSelf: 'stretch',
    marginRight: s(12),
  },
  priceCol: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    columnGap: s(6),
    rowGap: s(2),
  },
  price: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(17),
    lineHeight: fs(17) * 1.2,
    color: PDP_COLORS.darkGreen,
  },
  mrp: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.2,
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
    textDecorationColor: '#8E8E8E',
  },
  savingsPill: {
    backgroundColor: PDP_COLORS.savingsBg,
    borderRadius: s(3),
    paddingHorizontal: s(6),
    paddingVertical: s(3),
    marginTop: s(5),
  },
  savingsText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.25,
    color: PDP_COLORS.savingsGreen,
  },
});

export default PriceHeader;

