import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_CARDS, CATEGORY_CHIPS, Tile } from '../content';
import { SectionTitle } from '../parts';
import { HOME_COLORS, HOME_FONTS, fs, s } from '../theme';

type Props = {
  activeChip: string;
  onChipPress: (id: string) => void;
  onCardPress?: (item: Tile) => void;
};

const ShopByCategory: React.FC<Props> = ({
  activeChip,
  onChipPress,
  onCardPress,
}) => (
  <View style={styles.wrap}>
    <SectionTitle text="Shop By" accent="Category" style={styles.title} />

    <View style={styles.band}>
      <View style={styles.rule} />

      <View style={styles.chipRow}>
        {CATEGORY_CHIPS.map(chip => {
          const isActive = chip.id === activeChip;
          return (
            <View key={chip.id} style={styles.chipItem}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onChipPress(chip.id)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Image
                  source={chip.image}
                  resizeMode="contain"
                  style={styles.chipIcon}
                />
              </TouchableOpacity>
              <Text
                style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                numberOfLines={1}
              >
                {chip.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.rule} />

      <View style={styles.cardRow}>
        {CATEGORY_CARDS.map(card => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.9}
            onPress={() => onCardPress?.(card)}
            style={styles.cardItem}
          >
            <View style={styles.card}>
              <Image
                source={card.image}
                resizeMode="cover"
                style={styles.cardImage}
              />
            </View>
            <Text style={styles.cardLabel} numberOfLines={1}>
              {card.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <View style={styles.ruleThick} />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: s(25),
    marginTop: s(15),
    marginBottom: s(12),
  },
  band: {
    backgroundColor: HOME_COLORS.cream,
    paddingBottom: s(12),
  },
  rule: {
    height: s(4),
    backgroundColor: HOME_COLORS.creamRule,
  },
  ruleThick: {
    height: s(7),
    backgroundColor: HOME_COLORS.creamRule,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(33),
    paddingTop: s(5),
    paddingBottom: s(6),
  },
  chipItem: {
    alignItems: 'center',
    width: s(70),
  },
  chip: {
    width: s(58),
    height: s(50),
    borderRadius: s(10),
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: HOME_COLORS.orange,
  },
  chipIcon: {
    width: s(36),
    height: s(36),
  },
  chipLabel: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.4,
    color: HOME_COLORS.black,
    marginTop: s(4),
  },
  chipLabelActive: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(13),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(11),
    marginTop: s(11),
  },
  cardItem: {
    width: s(126),
    alignItems: 'center',
  },
  card: {
    width: s(126),
    height: s(160),
    borderRadius: s(10),
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.cardBorder,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.3,
    color: HOME_COLORS.black,
    marginTop: s(8),
  },
});

export default ShopByCategory;
