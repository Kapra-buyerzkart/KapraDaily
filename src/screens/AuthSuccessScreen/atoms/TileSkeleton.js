import React from 'react';
import { StyleSheet, View } from 'react-native';

import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';

import LandingText from './LandingText';
import { PALETTE, SPACING } from '../theme';

const TileSkeleton = ({ label, caption }) => (
  <View style={styles.fill}>
    <ShimmerPlaceholder style={styles.shimmer} />

    <View style={styles.copy}>
      <LandingText variant="labelStrong" tone="muted" numberOfLines={1}>
        {label}
      </LandingText>
      {caption ? (
        <LandingText
          variant="micro"
          tone="faint"
          numberOfLines={1}
          style={styles.caption}
        >
          {caption}
        </LandingText>
      ) : null}
    </View>
  </View>
);

export default React.memo(TileSkeleton);

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.well,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  copy: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  caption: {
    marginTop: 2,
  },
});
