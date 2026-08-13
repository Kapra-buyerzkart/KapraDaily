import React from 'react';
import { View, StyleSheet, PixelRatio } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { HeadingBones, TabBone } from '../molecules';
import { GUTTER, SPACING } from '../tokens';
import ProductRailSkeleton from './ProductRailSkeleton';

const RULE = PixelRatio.roundToNearestPixel(1.5);
const TAB_BLEED = PixelRatio.roundToNearestPixel(RULE + 1);
const TAB_WIDTHS = [wp('24%'), wp('30%'), wp('26%'), wp('34%')];
const RULE_TINT = 'rgba(242,80,0,0.28)';

const ExploreSkeleton = () => (
  <View style={styles.section}>
    <HeadingBones subtitle />

    <View style={styles.tabBar}>
      <View style={styles.tabRule} pointerEvents="none" />
      <View style={styles.tabRow}>
        {TAB_WIDTHS.map((tabWidth, i) => (
          <TabBone key={i} width={tabWidth} />
        ))}
      </View>
    </View>

    <View style={styles.panel}>
      <ProductRailSkeleton />
    </View>
  </View>
);

export default React.memo(ExploreSkeleton);

const styles = StyleSheet.create({
  section: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.md,
  },
  tabBar: {
    justifyContent: 'flex-end',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: GUTTER,
    paddingBottom: TAB_BLEED,
    gap: SPACING.xs + 2,
    overflow: 'hidden',
  },
  tabRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: TAB_BLEED,
    height: RULE,
    backgroundColor: RULE_TINT,
  },
  panel: {
    paddingTop: SPACING.md,
  },
});
