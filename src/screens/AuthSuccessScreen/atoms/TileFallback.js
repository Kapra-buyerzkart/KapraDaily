import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import LandingText from './LandingText';
import { FALLBACK_LOGO_RATIO, PALETTE, SPACING, wp } from '../theme';

const FALLBACK_LOGO = require('../../../assets/images/udendeal.png');

const LOGO_WIDTH = wp('26%');

const TileFallback = ({ label, caption }) => (
  <View style={styles.fill}>
    <Image source={FALLBACK_LOGO} style={styles.logo} resizeMode="contain" />

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
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_WIDTH / FALLBACK_LOGO_RATIO,
    marginBottom: SPACING.sm,
  },
  copy: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  caption: {
    marginTop: 2,
  },
});
