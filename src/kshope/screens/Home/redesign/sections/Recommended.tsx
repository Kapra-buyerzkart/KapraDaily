import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HOME_ART } from '../assets';
import { RecCard } from '../content';
import { SectionTitle, ProductImage } from '../parts';
import {
  GUTTER,
  HOME_COLORS,
  RADIUS,
  SECTION_GAP,
  SPACE,
  TITLE_GAP,
  colWidth,
  SCREEN_WIDTH,
  s,
} from '../theme';

type Props = {
  items: RecCard[];
  footerImage?: { uri: string } | number | null;
  onPressCard?: (item: RecCard) => void;
  onSeeAll?: () => void;
};

const Recommended: React.FC<Props> = ({
  items,
  footerImage,
  onPressCard,
  onSeeAll,
}) => (
  <View style={styles.wrap}>
    <SectionTitle text="Recommended" accent="For you" style={styles.title} />

    <View style={styles.panel}>
      {/* <TouchableOpacity
        activeOpacity={0.85}
        onPress={onSeeAll}
        style={styles.arrowButton}
      >
        <ArrowRight />
      </TouchableOpacity> */}

      <View style={styles.grid}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => onPressCard?.(item)}
            style={styles.card}
          >
            <ProductImage
              source={item.image}
              resizeMode="cover"
              style={styles.cardImage}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.panelRule} />

      <View style={styles.footerRow}>
        {footerImage ? (
          <Image
            source={footerImage}
            resizeMode="contain"
            style={styles.footerBanner}
          />
        ) : (
          <>
            <Image
              source={HOME_ART.recFooterLeft}
              resizeMode="contain"
              style={styles.footerArt}
            />
            <Image
              source={HOME_ART.recFooterRight}
              resizeMode="contain"
              style={styles.footerArt}
            />
          </>
        )}
      </View>
    </View>
  </View>
);

const PANEL_PAD = SPACE.md;
const CARD_GUTTER = SPACE.sm;
const CARD_W = colWidth(3, CARD_GUTTER, GUTTER + PANEL_PAD);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: GUTTER,
    marginTop: SECTION_GAP,
  },
  panel: {
    marginTop: TITLE_GAP,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
    // marginHorizontal: GUTTER,
    // borderRadius: RADIUS.lg,
    backgroundColor: HOME_COLORS.peach,
    // paddingTop: SPACE.lg,
    paddingBottom: SPACE.lg,
  },
  arrowButton: {
    position: 'absolute',
    top: SPACE.lg,
    right: PANEL_PAD,
    width: s(41),
    height: s(28),
    borderRadius: RADIUS.sm,
    backgroundColor: HOME_COLORS.cocoa,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: PANEL_PAD,
    marginTop: s(28) + SPACE.md,
    // columnGap: CARD_GUTTER,
    rowGap: SPACE.md,
  },
  card: {
    width: CARD_W,
    height: CARD_W * 0.9,
    borderRadius: RADIUS.md,
    backgroundColor: HOME_COLORS.white,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  panelRule: {
    height: s(2),
    backgroundColor: HOME_COLORS.peachRule,
    marginTop: SPACE.xxs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACE.lg,
  },
  footerArt: {
    width: '48%',
    height: s(77),
  },
  footerBanner: {
    width: '100%',
    height: s(77),
  },
});

export default Recommended;
