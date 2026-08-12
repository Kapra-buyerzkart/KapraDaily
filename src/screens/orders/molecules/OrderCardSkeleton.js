import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { HAIRLINE, RADIUS, SPACE, SURFACE, GUTTER } from '@/styles/homeTheme';

const Bar = ({ w, h = 12, style }) => (
  <ShimmerPlaceholder style={[styles.bar, { width: w, height: h }, style]} />
);

const OrderCardSkeleton = () => (
  <View style={styles.card}>
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

    <View style={styles.actions}>
      <Bar w={'48%'} h={38} style={styles.action} />
      <Bar w={'48%'} h={38} style={styles.action} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.md,
    padding: SPACE.base,
    borderRadius: RADIUS.lg,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    marginTop: SPACE.base,
    justifyContent: 'flex-start',
  },
  bar: {
    borderRadius: RADIUS.xxs,
  },
  pill: {
    borderRadius: RADIUS.pill,
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
    marginLeft: SPACE.md,
    justifyContent: 'center',
  },
  gap: {
    marginTop: SPACE.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACE.base,
  },
  action: {
    borderRadius: RADIUS.sm,
  },
});

export default React.memo(OrderCardSkeleton);
