import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinText } from '../atoms';
import { COIN_ICON, TOKEN_ICON } from '../constants';
import { GUTTER, PALETTE, RADIUS, SHADOW } from '../theme';

const TRACK_PADDING = 4;
const SPRING = { damping: 18, stiffness: 190, mass: 0.6 };

const SEGMENTS = [
  { id: 'bcoin', label: 'UD Coin', icon: COIN_ICON, iconStyle: 'coin' },
  { id: 'btoken', label: 'UD Token', icon: TOKEN_ICON, iconStyle: 'token' },
];

const WalletSegments = ({ selected, onChange }) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(selected === 'btoken' ? 1 : 0);

  const segmentWidth = trackWidth
    ? (trackWidth - TRACK_PADDING * 2) / SEGMENTS.length
    : 0;

  useEffect(() => {
    progress.value = withSpring(selected === 'btoken' ? 1 : 0, SPRING);
  }, [progress, selected]);

  const indicatorStyle = useAnimatedStyle(
    () => ({ transform: [{ translateX: progress.value * segmentWidth }] }),
    [segmentWidth],
  );

  const handleLayout = useCallback(
    event => setTrackWidth(event.nativeEvent.layout.width),
    [],
  );

  return (
    <View style={styles.track} onLayout={handleLayout}>
      {segmentWidth > 0 && (
        <Animated.View
          style={[styles.indicator, { width: segmentWidth }, indicatorStyle]}
        />
      )}

      {SEGMENTS.map(segment => {
        const isActive = selected === segment.id;
        return (
          <Pressable
            key={segment.id}
            style={styles.segment}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(segment.id)}
          >
            <Image
              source={segment.icon}
              style={[
                segment.iconStyle === 'coin'
                  ? styles.coinIcon
                  : styles.tokenIcon,
                !isActive && styles.iconIdle,
              ]}
            />
            <CoinText
              variant="labelStrong"
              tone={isActive ? 'primary' : 'muted'}
            >
              {segment.label}
            </CoinText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    marginHorizontal: GUTTER,
    marginTop: CART_SPACING.lg,
    padding: TRACK_PADDING,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.surface,
    ...SHADOW.card,
  },
  indicator: {
    position: 'absolute',
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.selectedTint,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 10,
  },
  coinIcon: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  tokenIcon: {
    width: 22,
    height: 15,
    resizeMode: 'contain',
  },
  iconIdle: {
    opacity: 0.4,
  },
});

export default React.memo(WalletSegments);
