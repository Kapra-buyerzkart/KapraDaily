import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Shimmer from '@/components/events/Shimmer';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const PLACEHOLDER_COUNT = 6;

const SkeletonCard = () => (
  <View style={styles.card}>
    <Shimmer style={styles.image} />
    <View style={styles.body}>
      <Shimmer style={[styles.line, styles.title]} />
      <Shimmer style={[styles.line, styles.desc]} />
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
  },
  body: {
    padding: 10,
  },
  line: {
    borderRadius: 6,
  },
  title: {
    height: 14,
    width: '75%',
  },
  desc: {
    height: 11,
    width: '50%',
    marginTop: 8,
  },
});

export default React.memo(VoucherGridSkeleton);
