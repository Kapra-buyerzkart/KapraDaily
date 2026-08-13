import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import Surface from '../atoms/Surface';
import Divider from '../atoms/Divider';
import { GUTTER, RADIUS, SPACING, wp } from '../theme';

const STEPS = [0, 1, 2];
const ROWS = [0, 1];

const Bar = ({ w, h = 12, style }) => (
  <ShimmerPlaceholder style={[styles.bar, { width: w, height: h }, style]} />
);

const Heading = () => <Bar w={wp('34%')} h={18} style={styles.heading} />;

const TrackingSkeleton = () => (
  <View style={styles.wrap}>
    <Surface style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Bar w={wp('26%')} h={18} style={styles.pill} />
          <Bar w={wp('44%')} h={20} style={styles.gapLg} />
          <Bar w={wp('56%')} h={12} style={styles.gap} />
        </View>
        <ShimmerPlaceholder style={styles.disc} />
      </View>

      <Bar w={wp('38%')} h={11} style={styles.gapLg} />

      <Divider style={styles.rule} />

      {STEPS.map(step => (
        <View key={step} style={styles.step}>
          <ShimmerPlaceholder style={styles.node} />
          <View style={styles.stepCopy}>
            <Bar w={wp('34%')} h={13} />
            <Bar w={wp('50%')} h={10} style={styles.gap} />
          </View>
        </View>
      ))}
    </Surface>

    <Heading />
    <Surface style={styles.card}>
      {ROWS.map(row => (
        <View key={row}>
          {row > 0 && <Divider />}
          <View style={styles.itemRow}>
            <ShimmerPlaceholder style={styles.thumb} />
            <View style={styles.itemCopy}>
              <Bar w={wp('46%')} h={13} />
              <Bar w={wp('24%')} h={11} style={styles.gap} />
            </View>
            <Bar w={wp('14%')} h={13} />
          </View>
        </View>
      ))}

      <Divider style={styles.rule} />

      <View style={styles.totalRow}>
        <Bar w={wp('22%')} h={14} />
        <Bar w={wp('18%')} h={16} />
      </View>
    </Surface>

    <Heading />
    <Surface style={styles.card}>
      {ROWS.map(stop => (
        <View key={stop} style={styles.stopRow}>
          <ShimmerPlaceholder style={styles.stopDisc} />
          <View style={styles.itemCopy}>
            <Bar w={wp('30%')} h={12} />
            <Bar w={wp('52%')} h={11} style={styles.gap} />
          </View>
        </View>
      ))}
    </Surface>

    <Heading />
    <Surface style={[styles.card, styles.rowCard]}>
      <ShimmerPlaceholder style={styles.stopDisc} />
      <View style={styles.itemCopy}>
        <Bar w={wp('34%')} h={13} />
        <Bar w={wp('22%')} h={11} style={styles.gap} />
      </View>
      <Bar w={wp('20%')} h={18} style={styles.pill} />
    </Surface>
  </View>
);

export default React.memo(TrackingSkeleton);

const styles = StyleSheet.create({
  wrap: {
    paddingTop: SPACING.md,
  },
  bar: {
    borderRadius: RADIUS.xs,
  },
  pill: {
    borderRadius: RADIUS.pill,
  },
  gap: {
    marginTop: SPACING.sm,
  },
  gapLg: {
    marginTop: SPACING.md,
  },
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    marginRight: SPACING.md,
  },
  disc: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: RADIUS.icon,
  },
  rule: {
    marginVertical: SPACING.lg,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  node: {
    width: wp('6.4%'),
    height: wp('6.4%'),
    borderRadius: wp('3.2%'),
  },
  stepCopy: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  heading: {
    marginHorizontal: GUTTER + SPACING.xs,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  itemCopy: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  thumb: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: RADIUS.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  stopDisc: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: RADIUS.sm,
  },
});
