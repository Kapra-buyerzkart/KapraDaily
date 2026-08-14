import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { COLORS, RADIUS } from '../../theme';
import { SkeletonLine } from '../atoms';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const PLACEHOLDER_COUNT = 6;

const SkeletonCard = () => (
  <View style={styles.card}>
    <SkeletonLine style={styles.image} />
    <View style={styles.body}>
      <SkeletonLine style={styles.title} />
      <SkeletonLine style={styles.desc} />
    </View>
  </View>
);

const VoucherGridSkeleton = ({ count = PLACEHOLDER_COUNT }) => (
  <View style={styles.container}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.skeletonSurface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.skeletonBorder,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 0,
  },
  body: {
    padding: 10,
  },
  title: {
    height: 14,
    width: '75%',
    borderRadius: RADIUS.sm,
  },
  desc: {
    height: 11,
    width: '50%',
    marginTop: 8,
    borderRadius: RADIUS.sm,
  },
});

export default React.memo(VoucherGridSkeleton);
