import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HOME_ART } from '../assets';
import { RecCard } from '../content';
import {
  DiscountBadge,
  SectionTitle,
  StrikePrice,
  imageSource,
} from '../parts';
import {
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

const ArrowRight: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <Svg width={s(size)} height={s(size * 0.73)} viewBox="0 0 22 16" fill="none">
    <Path
      d="M1 8.00004H21M12.25 15L21 8.00004L12.25 1.00004"
      stroke={HOME_COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HeartSmall: React.FC = () => (
  <Svg width={s(16)} height={s(14)} viewBox="0 0 14 12" fill="none">
    <Path
      d="M13.6613 2.45916C13.4441 1.97793 13.1309 1.54184 12.7392 1.17532C12.3472 0.807695 11.8851 0.51555 11.3779 0.31477C10.852 0.105731 10.288 -0.0012594 9.71847 1.11852e-05C8.91954 1.11852e-05 8.14005 0.209334 7.46266 0.60472C7.3006 0.699 7.14666 0.802563 7.00082 0.914939C6.85498 0.802563 6.70104 0.699 6.53898 0.60472C5.86159 0.209334 5.0821 1.11852e-05 4.28317 1.11852e-05C3.71362 -0.0012594 3.14965 0.105731 2.62371 0.31477C2.11491 0.51555 1.65442 0.807695 1.2624 1.17532C0.870729 1.54184 0.557527 1.97793 0.340362 2.45916C0.114559 2.95949 0 3.49103 0 4.03789C0 4.55354 0.111323 5.09084 0.332273 5.63855C0.517301 6.09646 0.782452 6.57139 1.12129 7.05064C1.65792 7.80891 2.39605 8.59972 3.3129 9.40095C4.83184 10.7284 6.33594 11.6449 6.39975 11.6821L6.7873 11.9167C6.91427 11.9932 7.08574 11.9932 7.21271 11.9167L7.60026 11.6821C7.66407 11.6438 9.16709 10.7284 10.6871 9.40095C11.604 8.59972 12.3421 7.80891 12.8787 7.05064C13.2176 6.57139 13.4838 6.09646 13.6677 5.63855C13.8887 5.09084 14 4.55354 14 4.03789C14 3.49103 13.8854 2.95949 13.6613 2.45916Z"
      fill="none"
      stroke={HOME_COLORS.muted}
      strokeWidth={1.1}
    />
  </Svg>
);

type Props = {
  items: RecCard[];
  onPressCard?: (item: RecCard) => void;
  onSeeAll?: () => void;
};

const Recommended: React.FC<Props> = ({ items, onPressCard, onSeeAll }) => (
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
            <View style={styles.cardTop}>
              {item.discount ? (
                <DiscountBadge
                  label={item.discount}
                  style={styles.badge}
                  textStyle={styles.badgeText}
                />
              ) : null}
              <View style={styles.heart}>
                <HeartSmall />
              </View>
              <Image
                source={imageSource(item.image)}
                resizeMode="contain"
                style={styles.cardImage}
              />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.subtitle ? `${item.name} ${item.subtitle}` : item.name}
              </Text>
              <Text style={styles.cardPrice} numberOfLines={1}>
                {item.price}
              </Text>
              {item.mrp ? (
                <StrikePrice
                  value={item.mrp}
                  size={9}
                  color={HOME_COLORS.strike}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.panelRule} />

      <View style={styles.footerRow}>
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
    borderRadius: RADIUS.md,
    backgroundColor: HOME_COLORS.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.recCardBorder,
    overflow: 'hidden',
  },
  cardTop: {
    height: CARD_W * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: SPACE.xs,
    left: SPACE.xs,
    minHeight: s(15),
    minWidth: s(40),
    paddingHorizontal: s(5),
    borderRadius: s(5),
    zIndex: 2,
  },
  badgeText: {
    fontSize: fs(8),
    lineHeight: fs(8) * 1.3,
    fontFamily: HOME_FONTS.semiBold,
  },
  heart: {
    position: 'absolute',
    top: SPACE.xs,
    right: SPACE.xs,
    zIndex: 2,
  },
  cardImage: {
    width: '72%',
    height: '72%',
  },
  cardBody: {
    paddingHorizontal: SPACE.sm,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  cardName: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.45,
    color: HOME_COLORS.black,
    minHeight: fs(10) * 1.45 * 2,
  },
  cardPrice: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(13),
    lineHeight: fs(13) * 1.35,
    color: HOME_COLORS.black,
    marginTop: SPACE.xxs,
    minHeight: fs(13) * 1.35,
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
});

export default Recommended;
