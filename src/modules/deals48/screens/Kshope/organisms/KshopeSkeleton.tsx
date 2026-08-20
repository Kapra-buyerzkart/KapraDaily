import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CARD_W, GUTTER } from '../styles';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const TILES = [0, 1, 2, 3];

const KshopeSkeleton = () => (
  <View style={styles.wrap}>
    <View style={styles.banner} />
    <View style={styles.label} />
    <View style={styles.row}>
      {TILES.map(i => (
        <View key={i} style={styles.tile} />
      ))}
    </View>
    <View style={styles.label} />
    <View style={styles.block} />
  </View>
);

export default React.memo(KshopeSkeleton);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.lg,
  },
  banner: {
    width: CARD_W,
    height: hp('21%'),
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.well,
  },
  label: {
    width: wp('34%'),
    height: 10,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.well,
    marginTop: CART_SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: CART_SPACING.md,
  },
  tile: {
    flex: 1,
    height: wp('17%'),
    borderRadius: CART_RADIUS.productCard,
    backgroundColor: CART_COLORS.well,
  },
  block: {
    width: CARD_W,
    height: hp('24%'),
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.well,
  },
});
