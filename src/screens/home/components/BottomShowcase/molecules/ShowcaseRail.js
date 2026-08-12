import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { SPACE, ACCENT } from '@/styles/homeTheme';
import ShowcaseCard from './ShowcaseCard';
import {
  CARD_GAP,
  CARD_SNAP,
  PANEL_PAD,
  PROGRESS_HEIGHT,
  PROGRESS_WIDTH,
  ACCENT_SOFT,
} from '../tokens';

const keyFor = (item, index) => (item?.bannerId || item?.id || index).toString();

const ShowcaseRail = ({ items, onItemPress }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX],
  );

  const handleLayout = useCallback(event => {
    setViewportWidth(event.nativeEvent.layout.width);
  }, []);

  const handleContentSize = useCallback(width => {
    setContentWidth(width);
  }, []);

  const maxScroll = Math.max(contentWidth - viewportWidth, 0);
  const trackWidth = PROGRESS_WIDTH;
  const thumbWidth = viewportWidth
    ? Math.max(
        trackWidth * Math.min(viewportWidth / (contentWidth || 1), 1),
        trackWidth * 0.3,
      )
    : trackWidth;

  const thumbShift = useMemo(
    () =>
      scrollX.interpolate({
        inputRange: [0, maxScroll || 1],
        outputRange: [0, trackWidth - thumbWidth],
        extrapolate: 'clamp',
      }),
    [scrollX, maxScroll, trackWidth, thumbWidth],
  );

  return (
    <View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_SNAP}
        snapToAlignment="start"
        contentContainerStyle={styles.content}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSize}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {items.map((item, index) => (
          <ShowcaseCard
            key={keyFor(item, index)}
            item={item}
            index={index}
            onPress={() => onItemPress(item)}
          />
        ))}
      </Animated.ScrollView>

      {maxScroll > 0 && (
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.thumb,
              { width: thumbWidth, transform: [{ translateX: thumbShift }] },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: PANEL_PAD,
    paddingVertical: SPACE.sm,
    gap: CARD_GAP,
  },
  track: {
    alignSelf: 'center',
    width: PROGRESS_WIDTH,
    height: PROGRESS_HEIGHT,
    borderRadius: PROGRESS_HEIGHT / 2,
    backgroundColor: ACCENT_SOFT,
    marginTop: SPACE.sm,
    overflow: 'hidden',
  },
  thumb: {
    height: PROGRESS_HEIGHT,
    borderRadius: PROGRESS_HEIGHT / 2,
    backgroundColor: ACCENT.primary,
  },
});

export default React.memo(ShowcaseRail);
