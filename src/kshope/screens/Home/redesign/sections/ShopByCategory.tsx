import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Tile } from '../content';
import { SectionTitle, imageSource } from '../parts';
import {
  CARD_GAP,
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SECTION_GAP,
  SPACE,
  TITLE_GAP,
  colWidth,
  fs,
  s,
} from '../theme';

type Props = {
  chips: Tile[];
  cards: Tile[];
  activeChip: string;
  onChipPress: (id: string) => void;
  onCardPress?: (item: Tile) => void;
};

const ShopByCategory: React.FC<Props> = ({
  chips,
  cards,
  activeChip,
  onChipPress,
  onCardPress,
}) => (
  <View style={styles.wrap}>
    <SectionTitle text="Shop By" accent="Category" style={styles.title} />

    <View style={styles.band}>
      <View style={styles.rule} />

      <FlatList
        data={chips}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={chip => chip.id}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item: chip }) => {
          const isActive = chip.id === activeChip;
          return (
            <View style={styles.chipItem}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onChipPress(chip.id)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Image
                  source={imageSource(chip.image)}
                  resizeMode="contain"
                  style={styles.chipIcon}
                />
              </TouchableOpacity>
              <Text
                style={[styles.chipLabel, isActive && styles.chipLabelActive]}
                numberOfLines={2}
              >
                {chip.label}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.rule} />

      <FlatList
        key={activeChip}
        data={cards}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={card => card.id}
        contentContainerStyle={styles.cardRow}
        renderItem={({ item: card }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onCardPress?.(card)}
            style={styles.cardItem}
          >
            <View style={styles.card}>
              <Image
                source={imageSource(card.image)}
                resizeMode="cover"
                style={styles.cardImage}
              />
            </View>
            <Text style={styles.cardLabel} numberOfLines={2}>
              {card.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>

    <View style={styles.ruleThick} />
  </View>
);

const CHIP_GAP = SPACE.lg;
const CHIP_W = colWidth(4, CHIP_GAP);
const CARD_W = colWidth(2.6, CARD_GAP);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: GUTTER,
    marginTop: SECTION_GAP,
    marginBottom: TITLE_GAP,
  },
  band: {
    backgroundColor: HOME_COLORS.cream,
    paddingBottom: SPACE.xl,
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
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.lg,
    paddingBottom: SPACE.lg,
    gap: CHIP_GAP,
  },
  chipItem: {
    alignItems: 'center',
    width: CHIP_W,
  },
  chip: {
    width: CHIP_W,
    height: CHIP_W,
    padding: s(4),
    borderRadius: RADIUS.md,
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
    width: '100%',
    height: '100%',
  },
  chipLabel: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.4,
    color: HOME_COLORS.black,
    marginTop: SPACE.xs,
    textAlign: 'center',
    minHeight: fs(12) * 1.4 * 2,
  },
  chipLabelActive: {
    fontFamily: HOME_FONTS.medium,
  },
  cardRow: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.lg,
    paddingBottom: SPACE.sm,
    gap: CARD_GAP,
  },
  cardItem: {
    width: CARD_W,
    alignItems: 'center',
  },
  card: {
    width: CARD_W,
    height: CARD_W * 1.27,
    borderRadius: RADIUS.md,
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
    fontSize: fs(13),
    lineHeight: fs(13) * 1.35,
    color: HOME_COLORS.black,
    marginTop: SPACE.sm,
    textAlign: 'center',
    minHeight: fs(13) * 1.35 * 2,
  },
});

export default ShopByCategory;
