import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { HAIRLINE, RADIUS, SPACE, SURFACE, GUTTER } from '@/styles/homeTheme';

const Bar = ({ w, h = 12, style }) => (
  <ShimmerPlaceholder style={[styles.bar, { width: w, height: h }, style]} />
);

const Heading = () => <Bar w={wp('34%')} h={18} style={styles.heading} />;

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const TrackingSkeleton = () => (
  <View style={styles.wrap}>
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <View style={styles.heroCopy}>
          <Bar w={wp('26%')} h={18} style={styles.pill} />
          <Bar w={wp('44%')} h={20} style={styles.gapLg} />
          <Bar w={wp('56%')} h={12} style={styles.gap} />
        </View>
        <ShimmerPlaceholder style={styles.heroChip} />
      </View>

      <Bar w={wp('38%')} h={11} style={styles.gapLg} />

      <View style={styles.stepper}>
        {[0, 1, 2, 3].map(step => (
          <View key={step} style={styles.step}>
            <ShimmerPlaceholder style={styles.stepDot} />
            {step < 3 && <Bar w={'100%'} h={3} style={styles.stepRail} />}
          </View>
        ))}
      </View>
      <View style={styles.stepLabels}>
        {[0, 1, 2, 3].map(step => (
          <Bar key={step} w={wp('14%')} h={9} />
        ))}
      </View>
    </View>

    <Heading />
    <Card>
      {[0, 1].map(item => (
        <View key={item} style={[styles.itemRow, item > 0 && styles.divided]}>
          <ShimmerPlaceholder style={styles.thumb} />
          <View style={styles.itemCopy}>
            <Bar w={wp('46%')} h={13} />
            <Bar w={wp('24%')} h={11} style={styles.gap} />
          </View>
          <Bar w={wp('14%')} h={13} />
        </View>
      ))}
      <View style={styles.totalRow}>
        <Bar w={wp('22%')} h={14} />
        <Bar w={wp('18%')} h={16} />
      </View>
    </Card>

    <Heading />
    <Card>
      {[0, 1].map(stop => (
        <View key={stop} style={styles.stopRow}>
          <ShimmerPlaceholder style={styles.stopChip} />
          <View style={styles.itemCopy}>
            <Bar w={wp('30%')} h={12} />
            <Bar w={wp('52%')} h={11} style={styles.gap} />
          </View>
        </View>
      ))}
    </Card>

    <Heading />
    <Card style={styles.rowCard}>
      <View style={styles.itemCopy}>
        <Bar w={wp('34%')} h={13} />
        <Bar w={wp('22%')} h={11} style={styles.gap} />
      </View>
      <Bar w={wp('20%')} h={18} style={styles.pill} />
    </Card>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    paddingTop: SPACE.md,
  },
  bar: {
    borderRadius: RADIUS.xxs,
  },
  pill: {
    borderRadius: RADIUS.pill,
  },
  gap: {
    marginTop: SPACE.sm,
  },
  gapLg: {
    marginTop: SPACE.md,
  },

  hero: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.md,
    padding: SPACE.base,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: SURFACE.base,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroCopy: {
    flex: 1,
    marginRight: SPACE.md,
  },
  heroChip: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: RADIUS.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.lg,
  },
  step: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
  },
  stepRail: {
    flex: 1,
    marginHorizontal: SPACE.xs,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACE.sm,
  },

  heading: {
    marginHorizontal: GUTTER + SPACE.xs,
    marginTop: SPACE.sm,
    marginBottom: SPACE.md,
  },
  card: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.md,
    padding: SPACE.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: SURFACE.base,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divided: {
    marginTop: SPACE.base,
    paddingTop: SPACE.base,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
  },
  thumb: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: RADIUS.sm,
  },
  itemCopy: {
    flex: 1,
    marginLeft: SPACE.md,
    marginRight: SPACE.md,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.base,
    paddingTop: SPACE.base,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACE.sm,
  },
  stopChip: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: RADIUS.sm,
  },
});

export default React.memo(TrackingSkeleton);
