import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HOME_ART } from '../assets';
import { BRANDS } from '../content';
import { PillButton, SectionTitle } from '../parts';
import { HOME_COLORS, s } from '../theme';

type PressHandlers = {
  onShopNow?: () => void;
  onViewAll?: () => void;
  onPressBrand?: (id: string) => void;
};

export const BestForYou: React.FC<PressHandlers> = ({
  onShopNow,
  onViewAll,
}) => (
  <View style={styles.wrap}>
    <SectionTitle text="The Best" accent="For you" style={styles.title} />

    <View style={styles.bannerWrap}>
      <Image
        source={HOME_ART.bannerEarbuds}
        resizeMode="cover"
        style={styles.banner}
      />
      <PillButton
        label="Shop Now"
        onPress={onShopNow}
        style={styles.bannerCta}
      />
    </View>

    <PillButton
      label="View All"
      filled={false}
      width={405}
      onPress={onViewAll}
      style={styles.viewAll}
    />
  </View>
);

export const BrandsSpotlight: React.FC<PressHandlers> = ({ onPressBrand }) => (
  <View style={styles.wrap}>
    <SectionTitle text="Brands In Spotlight" style={styles.title} />
    <View style={styles.brandRow}>
      {BRANDS.map(brand => (
        <TouchableOpacity
          key={brand.id}
          activeOpacity={0.9}
          onPress={() => onPressBrand?.(brand.id)}
          style={styles.brandTile}
        >
          <Image
            source={brand.image}
            resizeMode="contain"
            style={styles.brandImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export const TopDeals: React.FC<PressHandlers> = ({ onShopNow }) => (
  <View style={styles.wrap}>
    <SectionTitle text="Top Deals For You" style={styles.title} />

    <View style={styles.bannerWrap}>
      <Image
        source={HOME_ART.bannerTopDeals}
        resizeMode="cover"
        style={styles.banner}
      />
      <PillButton
        label="Shop Now"
        onPress={onShopNow}
        style={styles.bannerCta}
      />
    </View>

    <View style={styles.tileRow}>
      <Image
        source={HOME_ART.dealTile1}
        resizeMode="contain"
        style={styles.dealTile}
      />
      <Image
        source={HOME_ART.dealTile2}
        resizeMode="contain"
        style={styles.dealTile}
      />
    </View>
  </View>
);

export const MoreDeals: React.FC = () => (
  <View style={styles.wrap}>
    <SectionTitle text="More Deals You’ll Love" style={styles.title} />
    <Image
      source={HOME_ART.bannerMoreDeals}
      resizeMode="cover"
      style={styles.wideBanner}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: s(17),
    marginTop: s(22),
  },
  bannerWrap: {
    marginTop: s(14),
    paddingHorizontal: s(17),
  },
  banner: {
    width: '100%',
    height: s(184),
    borderRadius: s(11),
  },
  bannerCta: {
    position: 'absolute',
    left: s(32),
    bottom: s(14),
  },
  viewAll: {
    alignSelf: 'center',
    marginTop: s(23),
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(8),
    marginTop: s(14),
  },
  brandTile: {
    width: s(91),
    height: s(87),
    borderRadius: s(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.tileBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandImage: {
    width: '86%',
    height: '60%',
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(12),
    paddingHorizontal: s(8),
  },
  dealTile: {
    width: s(210),
    height: s(104),
  },
  wideBanner: {
    width: '100%',
    height: s(99),
    marginTop: s(14),
  },
});

export { styles as promoStyles };
