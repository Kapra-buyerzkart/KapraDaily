import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_ART } from '../assets';
import { FOOTER_NOTE, Tile } from '../content';
import { SectionTitle, imageSource } from '../parts';
import {
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  SCREEN_WIDTH,
  SECTION_GAP,
  SPACE,
  TITLE_GAP,
  colWidth,
  fs,
  s,
} from '../theme';

type Props = {
  rowOne: Tile[];
  rowTwo: Tile[];
  onPressTile?: (item: Tile) => void;
};

const ExploreRow: React.FC<{
  items: Tile[];
  onPressTile?: (item: Tile) => void;
}> = ({ items, onPressTile }) => (
  <View style={styles.row}>
    {items.map(item => (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.85}
        onPress={() => onPressTile?.(item)}
        style={styles.cell}
      >
        <Image
          source={imageSource(item.image)}
          resizeMode="contain"
          style={styles.icon}
        />
        <Text style={styles.label} numberOfLines={1}>
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const MoreToExplore: React.FC<Props> = ({ rowOne, rowTwo, onPressTile }) => (
  <View style={styles.wrap}>
    <SectionTitle text="More To" accent="Explore" style={styles.title} />

    <ExploreRow items={rowOne} onPressTile={onPressTile} />
    <ExploreRow items={rowTwo} onPressTile={onPressTile} />

    <View style={styles.footer}>
      <View style={styles.footerRule} />
      <View style={styles.footerNote}>
        <Image
          source={HOME_ART.iconHeartFilled}
          resizeMode="contain"
          style={styles.footerHeart}
        />
        <Text style={styles.footerText}>{FOOTER_NOTE}</Text>
      </View>

      <Image
        source={HOME_ART.exploreFooterArt}
        resizeMode="cover"
        style={styles.footerArt}
      />
    </View>
  </View>
);

const CELL_W = colWidth(5, SPACE.sm);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: GUTTER,
    marginTop: SECTION_GAP,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    marginTop: TITLE_GAP,
    columnGap: SPACE.sm,
  },
  cell: {
    width: CELL_W,
    alignItems: 'center',
  },
  icon: {
    width: CELL_W * 0.78,
    height: CELL_W * 0.78,
  },
  label: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.4,
    color: HOME_COLORS.black,
    marginTop: SPACE.xs,
    textAlign: 'center',
  },
  footer: {
    marginTop: SECTION_GAP,
  },
  footerArt: {
    width: SCREEN_WIDTH,
    height: s(120),
  },
  footerRule: {
    height: s(7),
    backgroundColor: HOME_COLORS.creamRule,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACE.lg,
  },
  footerHeart: {
    width: s(20),
    height: s(20),
    marginRight: SPACE.xs,
  },
  footerText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.45,
    color: HOME_COLORS.muted,
  },
});

export default MoreToExplore;
