import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import Surface from '../atoms/Surface';
import Divider from '../atoms/Divider';
import { RADIUS, SPACING, wp } from '../theme';

const Bar = ({ w, h = 12, style }) => (
  <ShimmerPlaceholder style={[styles.bar, { width: w, height: h }, style]} />
);

const OrderCardSkeleton = () => (
  <Surface style={styles.card}>
    <View style={styles.pad}>
      <View style={styles.row}>
        <Bar w={wp('30%')} h={20} style={styles.pill} />
        <Bar w={wp('18%')} h={12} />
      </View>

      <View style={[styles.row, styles.body]}>
        <View style={styles.thumbs}>
          <ShimmerPlaceholder style={styles.thumb} />
          <ShimmerPlaceholder style={[styles.thumb, styles.thumbOverlap]} />
          <ShimmerPlaceholder style={[styles.thumb, styles.thumbOverlap]} />
        </View>
        <View style={styles.meta}>
          <Bar w={wp('22%')} h={13} />
          <Bar w={wp('30%')} h={11} style={styles.gap} />
        </View>
      </View>
    </View>

    <Divider />

    <View style={[styles.pad, styles.actions]}>
      <Bar w={'48%'} h={38} style={styles.action} />
      <Bar w={'48%'} h={38} style={styles.action} />
    </View>
  </Surface>
);

export default React.memo(OrderCardSkeleton);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  pad: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    borderRadius: RADIUS.xs,
  },
  pill: {
    borderRadius: RADIUS.pill,
  },
  body: {
    marginTop: SPACING.lg,
    justifyContent: 'flex-start',
  },
  thumbs: {
    flexDirection: 'row',
  },
  thumb: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: RADIUS.sm,
  },
  thumbOverlap: {
    marginLeft: -wp('5.4%'),
  },
  meta: {
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  gap: {
    marginTop: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  action: {
    borderRadius: RADIUS.button,
  },
});
