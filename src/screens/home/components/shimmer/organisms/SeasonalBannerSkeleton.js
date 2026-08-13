import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BannerBone, HeadingBones } from '../molecules';
import { GUTTER, SPACING } from '../tokens';

const BANNERS = [0, 1];

const SeasonalBannerSkeleton = () => (
  <View style={styles.section}>
    <HeadingBones eyebrow={false} titleWidth={wp('40%')} />
    <View style={styles.row}>
      {BANNERS.map(i => (
        <BannerBone key={i} width={wp('74.88%')} style={styles.banner} />
      ))}
    </View>
  </View>
);

export default React.memo(SeasonalBannerSkeleton);

const styles = StyleSheet.create({
  section: {
    paddingVertical: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: GUTTER,
    overflow: 'hidden',
  },
  banner: {
    marginRight: wp('5%'),
  },
});
