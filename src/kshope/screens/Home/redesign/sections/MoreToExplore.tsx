import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
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

const withViewBox = (xml: string) => {
  const tag = xml.match(/<svg[^>]*>/i)?.[0];
  if (!tag || /viewBox=/i.test(tag)) {
    return xml;
  }
  const num = (attr: string) =>
    parseFloat(tag.match(new RegExp(`${attr}="([\\d.]+)`, 'i'))?.[1] ?? '');
  const w = num('width');
  const h = num('height');
  if (!w || !h) {
    return xml;
  }
  return xml.replace(tag, tag.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`));
};

const svgCache = new Map<string, string>();

const useRemoteSvg = (uri?: string) => {
  const [xml, setXml] = useState<string | null>(() =>
    uri ? svgCache.get(uri) ?? null : null,
  );

  useEffect(() => {
    if (!uri || svgCache.has(uri)) {
      setXml(uri ? svgCache.get(uri) ?? null : null);
      return;
    }
    let alive = true;
    fetch(uri)
      .then(res => (res.ok ? res.text() : Promise.reject(res.status)))
      .then(text => {
        const normalized = withViewBox(text);
        svgCache.set(uri, normalized);
        if (alive) setXml(normalized);
      })
      .catch(() => {
        if (alive) setXml(null);
      });
    return () => {
      alive = false;
    };
  }, [uri]);

  return xml;
};

const ExploreIcon: React.FC<{ image: any }> = ({ image }) => {
  const uri = typeof image === 'object' && image ? image.uri : undefined;
  const isSvg =
    typeof uri === 'string' && uri.toLowerCase().split('?')[0].endsWith('.svg');
  const xml = useRemoteSvg(isSvg ? uri : undefined);

  return (
    <View style={styles.iconBox}>
      {isSvg ? (
        xml ? (
          <SvgXml
            xml={xml}
            width={SVG_SIZE}
            height={SVG_SIZE}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : null
      ) : (
        <Image
          source={imageSource(image)}
          resizeMode="contain"
          style={styles.icon}
        />
      )}
    </View>
  );
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
        <ExploreIcon image={item.image} />
        <Text style={styles.label} numberOfLines={1}>
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const MoreToExplore: React.FC<Props> = ({ rowOne, rowTwo, onPressTile }) => (
  <View style={styles.wrap}>
    {rowOne.length + rowTwo.length > 0 ? (
      <>
        <SectionTitle text="More To" accent="Explore" style={styles.title} />

        {rowOne.length > 0 ? (
          <ExploreRow items={rowOne} onPressTile={onPressTile} />
        ) : null}
        {rowTwo.length > 0 ? (
          <ExploreRow items={rowTwo} onPressTile={onPressTile} />
        ) : null}
      </>
    ) : null}

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
const ICON_SIZE = s(52);
const SVG_SIZE = s(36);

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
    width: ICON_SIZE,
    height: ICON_SIZE,
    resizeMode: 'contain',
  },
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: s(140),
    marginBottom: 20,
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
