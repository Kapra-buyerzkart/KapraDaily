import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Tile } from '../content';
import { SectionTitle, imageSource } from '../parts';
import {
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SECTION_GAP,
  SPACE,
  TILE_TINTS,
  TITLE_GAP,
  colWidth,
  fs,
  s,
} from '../theme';

type Props = {
  items: Tile[];
  onPressTile?: (item: Tile) => void;
};

const BestSelling: React.FC<Props> = ({ items, onPressTile }) => (
  <View style={styles.wrap}>
    <SectionTitle text="Best Selling" style={styles.title} />

    <View style={styles.grid}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          onPress={() => onPressTile?.(item)}
          style={styles.cell}
        >
          <View
            style={[
              styles.tile,
              { backgroundColor: TILE_TINTS[index % TILE_TINTS.length] },
            ]}
          >
            <Image
              source={imageSource(item.image)}
              resizeMode="cover"
              style={styles.tileImage}
            />
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.rule} />
  </View>
);

const CELL_W = colWidth(3, SPACE.md);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: GUTTER,
    marginTop: SECTION_GAP,
    paddingBottom: s(10),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GUTTER,
    marginTop: TITLE_GAP,
    columnGap: SPACE.md,
    rowGap: SPACE.lg,
  },
  cell: {
    width: CELL_W,
    alignItems: 'center',
  },
  tile: {
    width: CELL_W,
    height: CELL_W * 0.95,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.tileBorder,
    overflow: 'hidden',
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.35,
    color: HOME_COLORS.black,
    marginTop: SPACE.sm,
    textAlign: 'center',
  },
  rule: {
    height: s(7),
    backgroundColor: HOME_COLORS.creamRule,
    marginTop: SPACE.md,
  },
});

export default BestSelling;
