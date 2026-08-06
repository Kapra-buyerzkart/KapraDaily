import React, { useCallback, useState } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, {
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { getVoucherImageSource } from '@/components/events/imageUtils';
import { getStaggerDelay } from '@/utils/staggerDelay';
import CONFIG from '@/globals/config';
import styles from '../styles';
import { PLACEHOLDER_HERO } from '../constants';

const resolveArtistImage = artist => {
  const uri = artist?.artistImage;
  if (typeof uri === 'string' && uri) {
    return /^https?:\/\//i.test(uri)
      ? { uri }
      : { uri: CONFIG.image_base_url + uri };
  }
  return getVoucherImageSource(artist);
};

const ProgressSegment = ({ index, scrollX, pageWidth }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: Math.round(scrollX.value / pageWidth) === index ? 1 : 0,
  }));

  return (
    <View style={styles.artistProgressSegment}>
      <Animated.View style={[styles.artistProgressFill, animatedStyle]} />
    </View>
  );
};

const ArtistList = ({ artists }) => {
  const scrollX = useSharedValue(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollX.value = e.contentOffset.x;
  });

  const handleLayout = useCallback(
    e => setViewportWidth(e.nativeEvent.layout.width),
    [],
  );
  const handleContentSizeChange = useCallback(w => setContentWidth(w), []);

  if (!artists?.length) return null;

  const pages = viewportWidth > 0 ? Math.ceil(contentWidth / viewportWidth) : 0;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Artists</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artistList}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
      >
        {artists.map((artist, index) => {
          const name = artist?.artistName || artist?.name || 'Artist';
          const role = artist?.specialization || artist?.role || artist?.type;
          return (
            <Animated.View
              key={artist?.eventArtistId ?? artist?.id ?? name ?? index}
              entering={FadeInRight.delay(getStaggerDelay(index)).duration(350)}
              style={styles.artistCard}
            >
              <Image
                source={resolveArtistImage(artist) || PLACEHOLDER_HERO}
                defaultSource={PLACEHOLDER_HERO}
                style={styles.artistImage}
              />
              <Text style={styles.artistName} numberOfLines={2}>
                {name}
              </Text>
              {!!role && (
                <Text style={styles.artistRole} numberOfLines={1}>
                  {role}
                </Text>
              )}
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {pages > 1 && (
        <View style={styles.artistProgressTrack} pointerEvents="none">
          {Array.from({ length: pages }, (_, i) => (
            <ProgressSegment
              key={i}
              index={i}
              scrollX={scrollX}
              pageWidth={viewportWidth}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default React.memo(ArtistList);
