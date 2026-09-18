import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  onExplore: () => void;
};

export const CartEmptyLuxury: React.FC<Props> = ({ onExplore }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="bag-handle-outline" size={s(44)} color={CART_COLORS.goldMetallic} />
      </View>

      <Text style={styles.title}>Your Cart is Empty</Text>
      <Text style={styles.subtitle}>
        Discover our curated collection of handcrafted gold, diamond, and bridal jewellery.
      </Text>

      <TouchableOpacity
        testID="cart-empty-explore-btn"
        activeOpacity={0.88}
        onPress={onExplore}
        style={styles.exploreBtn}
      >
        <Text style={styles.exploreBtnText}>Explore Jewellery</Text>
        <Ionicons name="arrow-forward" size={s(16)} color={CART_COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(32),
    backgroundColor: CART_COLORS.background,
  },
  iconCircle: {
    width: s(84),
    height: s(84),
    borderRadius: s(42),
    backgroundColor: CART_COLORS.bannerBg,
    borderWidth: 1,
    borderColor: CART_COLORS.bannerBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(20),
  },
  title: {
    fontFamily: CART_FONTS.serifBold,
    fontSize: fs(24),
    color: CART_COLORS.textDark,
    textAlign: 'center',
    marginBottom: s(8),
  },
  subtitle: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(13),
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: fs(18),
    marginBottom: s(26),
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    backgroundColor: CART_COLORS.darkEmerald,
    borderRadius: s(10),
    paddingVertical: s(13),
    paddingHorizontal: s(26),
  },
  exploreBtnText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(14),
    color: CART_COLORS.white,
  },
});
