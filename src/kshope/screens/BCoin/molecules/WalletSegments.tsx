import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '../../../components/atoms';
import { COIN_ICON, TOKEN_GLYPH } from '../constants';
import { GUTTER, PALETTE, RADIUS, SHADOW, SPACING } from '../theme';

const TRACK_PADDING = 4;
const SPRING = { damping: 18, stiffness: 190, mass: 0.6 };

export type WalletSegmentId = 'bcoin' | 'btoken';

const GLYPH_SIZE = 17;

const SEGMENTS: {
  id: WalletSegmentId;
  label: string;
  image?: any;
  glyph?: string;
}[] = [
  { id: 'bcoin', label: 'UD Coin', image: COIN_ICON },
  { id: 'btoken', label: 'UD Token', glyph: TOKEN_GLYPH },
];

interface WalletSegmentsProps {
  selected: WalletSegmentId;
  onChange: (id: WalletSegmentId) => void;
}

const WalletSegments: React.FC<WalletSegmentsProps> = ({
  selected,
  onChange,
}) => {
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
    (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width),
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
            {segment.image ? (
              <Image
                source={segment.image}
                style={[styles.icon, !isActive && styles.iconIdle]}
              />
            ) : (
              <MaterialCommunityIcons
                name={segment.glyph as string}
                size={GLYPH_SIZE}
                color={PALETTE.token}
                style={!isActive ? styles.iconIdle : undefined}
              />
            )}
            <AppText
              variant="labelStrong"
              tone={isActive ? 'primary' : 'muted'}
            >
              {segment.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default React.memo(WalletSegments);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    marginHorizontal: GUTTER,
    marginTop: SPACING.lg,
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
  icon: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  iconIdle: {
    opacity: 0.4,
  },
});
