import React from 'react';
import { StyleSheet, View } from 'react-native';

import LandingText from './LandingText';
import { PALETTE, SPACING } from '../theme';

const TileFallback = ({ label, caption }) => (
  <View style={styles.fill}>
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

export default React.memo(TileFallback);

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.well,
  },
  copy: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  caption: {
    marginTop: 2,
  },
});
