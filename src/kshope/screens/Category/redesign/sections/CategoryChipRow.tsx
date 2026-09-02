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
import { imageSource } from '../../../Home/redesign/parts';
import {
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  colWidth,
  fs,
} from '../../../Home/redesign/theme';

type Props = {
  items: Tile[];
  activeId: string | null;
  onPress: (id: string) => void;
};

const CategoryChipRow: React.FC<Props> = ({ items, activeId, onPress }) => (
  <FlatList
    data={items}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.row}
    renderItem={({ item }) => {
      const isActive = item.id === activeId;
      return (
        <View style={styles.item}>
          <TouchableOpacity
            testID={`category-chip-${item.id}`}
            activeOpacity={0.85}
            onPress={() => onPress(item.id)}
            style={[styles.tile, isActive && styles.tileActive]}
          >
            <Image
              source={imageSource(item.image)}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text
            style={[styles.label, isActive && styles.labelActive]}
            numberOfLines={2}
          >
            {item.label}
          </Text>
        </View>
      );
    }}
  />
);

const TILE_W = colWidth(5, SPACE.md);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.md,
    gap: SPACE.md,
  },
  item: {
    width: TILE_W,
    alignItems: 'center',
  },
  tile: {
    width: TILE_W,
    height: TILE_W * 0.93,
    borderRadius: RADIUS.lg,
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileActive: {
    borderColor: HOME_COLORS.orange,
    shadowColor: HOME_COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    borderWidth: 2,
    shadowRadius: 7.4,
    elevation: 3,
  },
  icon: {
    width: '100%',
    height: '100%',
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

export default CategoryChipRow;
