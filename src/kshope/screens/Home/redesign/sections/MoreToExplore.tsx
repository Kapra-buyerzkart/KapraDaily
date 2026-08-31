import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_ART } from '../assets';
import {
  EXPLORE_ROW_ONE,
  EXPLORE_ROW_TWO,
  FOOTER_NOTE,
  Tile,
} from '../content';
import { SectionTitle } from '../parts';
import { HOME_COLORS, HOME_FONTS, fs, s } from '../theme';

type Props = {
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
          source={item.image}
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

const MoreToExplore: React.FC<Props> = ({ onPressTile }) => (
  <View style={styles.wrap}>
    <SectionTitle text="More To" accent="Explore" style={styles.title} />

    <ExploreRow items={EXPLORE_ROW_ONE} onPressTile={onPressTile} />
    <ExploreRow items={EXPLORE_ROW_TWO} onPressTile={onPressTile} />

    <View style={styles.footer}>
      <Image
        source={HOME_ART.exploreFooterArt}
        resizeMode="contain"
        style={styles.footerArt}
      />
      <View style={styles.footerRule} />
      <View style={styles.footerNote}>
        <Image
          source={HOME_ART.iconHeartFilled}
          resizeMode="contain"
          style={styles.footerHeart}
        />
        <Text style={styles.footerText}>{FOOTER_NOTE}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: s(19),
    marginTop: s(24),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    marginTop: s(18),
  },
  cell: {
    width: s(80),
    alignItems: 'center',
  },
  icon: {
    width: s(69),
    height: s(69),
  },
  label: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.35,
    color: HOME_COLORS.black,
    marginTop: s(6),
    textAlign: 'center',
  },
  footer: {
    marginTop: s(20),
  },
  footerArt: {
    width: '100%',
    height: s(120),
  },
  footerRule: {
    height: s(7),
    backgroundColor: HOME_COLORS.creamRule,
    marginTop: s(6),
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: s(12),
  },
  footerHeart: {
    width: s(20),
    height: s(20),
    marginRight: s(6),
  },
  footerText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.4,
    color: HOME_COLORS.muted,
  },
});

export default MoreToExplore;
