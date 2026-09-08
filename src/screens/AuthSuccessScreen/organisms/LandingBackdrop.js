import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BACKDROP, PALETTE } from '../theme';

const LandingBackdrop = ({ source }) => {
  const [hasFailed, setHasFailed] = useState(false);

  const handleError = useCallback(() => setHasFailed(true), []);

  return (
    <View style={styles.layer} pointerEvents="none">
      <View style={[styles.wash, { height: BACKDROP.washHeight }]}>
        {BACKDROP.wash.map(band => (
          <View
            key={band.key}
            style={[
              styles.band,
              { backgroundColor: band.color, opacity: band.opacity },
            ]}
          />
        ))}
      </View>

      {BACKDROP.orbs.map(({ key, size, color, opacity, ...position }) => (
        <View
          key={key}
          style={[
            styles.orb,
            position,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity,
            },
          ]}
        />
      ))}

      <View style={[styles.glow, { height: BACKDROP.glowHeight }]}>
        {BACKDROP.glow.map(band => (
          <View
            key={band.key}
            style={[
              styles.band,
              { backgroundColor: band.color, opacity: band.opacity },
            ]}
          />
        ))}
      </View>

      {source && !hasFailed ? (
        <Image
          source={source}
          style={styles.artwork}
          resizeMode="cover"
          fadeDuration={0}
          onError={handleError}
        />
      ) : null}
    </View>
  );
};

export default React.memo(LandingBackdrop);

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: PALETTE.canvas,
    overflow: 'hidden',
  },
  wash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  glow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column-reverse',
  },
  band: {
    flex: 1,
    width: '100%',
  },
  orb: {
    position: 'absolute',
  },
  artwork: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
