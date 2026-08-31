import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HOME_ART } from '../assets';
import { RECENTLY_VIEWED } from '../content';
import { SectionTitle, StrikePrice } from '../parts';
import { HOME_COLORS, HOME_FONTS, fs, s } from '../theme';

const ArrowSmall: React.FC = () => (
  <Svg width={s(12)} height={s(9)} viewBox="0 0 22 16" fill="none">
    <Path
      d="M1 8.00004H21M12.25 15L21 8.00004L12.25 1.00004"
      stroke={HOME_COLORS.white}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

type Props = {
  onSeeAll?: () => void;
  onPressBanner?: () => void;
};

const RecentlyViewed: React.FC<Props> = ({ onSeeAll, onPressBanner }) => (
  <View style={styles.wrap}>
    <View style={styles.titleRow}>
      <SectionTitle text="Recently Viewed" />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onSeeAll}
        style={styles.arrowButton}
      >
        <ArrowSmall />
      </TouchableOpacity>
    </View>

    <Image
      source={HOME_ART.recentProductsRow}
      resizeMode="contain"
      style={styles.productsRow}
    />

    <View style={styles.metaRow}>
      {RECENTLY_VIEWED.map(item => (
        <View key={item.id} style={styles.metaCell}>
          <View style={styles.priceLine}>
            <Text style={styles.price} numberOfLines={1}>
              {item.price}
            </Text>
            <StrikePrice value={item.mrp} size={7} />
          </View>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>

    <TouchableOpacity activeOpacity={0.9} onPress={onPressBanner}>
      <Image
        source={HOME_ART.bannerIphone17}
        resizeMode="cover"
        style={styles.banner}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(17),
    marginTop: s(24),
  },
  arrowButton: {
    width: s(24),
    height: s(18),
    borderRadius: s(7),
    backgroundColor: HOME_COLORS.cocoa,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsRow: {
    width: '100%',
    height: s(80),
    marginTop: s(14),
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(10),
    marginTop: s(6),
  },
  metaCell: {
    width: s(82),
    alignItems: 'flex-start',
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(7),
    lineHeight: fs(7) * 1.4,
    color: HOME_COLORS.black,
    marginRight: s(4),
  },
  label: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.35,
    color: HOME_COLORS.black,
    marginTop: s(2),
  },
  banner: {
    width: s(402),
    height: s(182),
    borderRadius: s(11),
    alignSelf: 'center',
    marginTop: s(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.tileBorder,
  },
});

export default RecentlyViewed;
