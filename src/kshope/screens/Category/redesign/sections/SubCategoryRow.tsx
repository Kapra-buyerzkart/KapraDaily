import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Tile } from '../../../Home/redesign/content';
import { SectionTitle, imageSource } from '../../../Home/redesign/parts';
import {
  CARD_GAP,
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  TITLE_GAP,
  colWidth,
  fs,
} from '../../../Home/redesign/theme';

type Props = {
  items: Tile[];
  activeId: string;
  onPress: (id: string) => void;
};

const SubCategoryRow: React.FC<Props> = ({ items, activeId, onPress }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <SectionTitle text="explore by" accent="Category" style={styles.title} />

      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => {
          const isActive = item.id === activeId;
          return (
            <TouchableOpacity
              testID={`subcategory-chip-${item.id}`}
              activeOpacity={0.9}
              onPress={() => onPress(item.id)}
              style={styles.item}
            >
              <View style={[styles.card, isActive && styles.cardActive]}>
                <Image
                  source={imageSource(item.image)}
                  resizeMode="contain"
                  style={styles.cardImage}
                />
              </View>
              <Text
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const CARD_W = colWidth(4, CARD_GAP);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: GUTTER,
    marginTop: SPACE.md,
    marginBottom: TITLE_GAP,
  },
  row: {
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.md,
    gap: CARD_GAP,
  },
  item: {
    width: CARD_W,
    alignItems: 'center',
  },
  card: {
    width: CARD_W,
    height: CARD_W * 1.19,
    borderRadius: RADIUS.md,
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: HOME_COLORS.orange,
    shadowColor: HOME_COLORS.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.59,
    borderWidth: 2,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '82%',
    height: '72%',
  },
  label: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.4,
    color: '#494949',
    marginTop: SPACE.xs,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: HOME_FONTS.medium,
    color: HOME_COLORS.orange,
  },
});

export default SubCategoryRow;
