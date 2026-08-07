import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { FONTS } from '@/styles/typography';

import { COIN_ICON, TOKEN_ICON } from '../constants';
import { PALETTE, RADIUS, SHADOW } from '../theme';

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
                segment.iconStyle === 'coin' ? styles.coinIcon : styles.tokenIcon,
                !isActive && styles.iconIdle,
              ]}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '92%',
    marginTop: 18,
    padding: TRACK_PADDING,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.canvas,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  indicator: {
    position: 'absolute',
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.surface,
    ...SHADOW.card,
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
    opacity: 0.45,
  },
  label: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 13.5,
    color: PALETTE.textMuted,
  },
  labelActive: {
    color: PALETTE.textPrimary,
  },
});

export default React.memo(WalletSegments);
