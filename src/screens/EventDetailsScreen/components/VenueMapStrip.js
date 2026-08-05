import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import images from '@/assets/images';
import { openExternalUrl } from '@/utils/safeUrl';
import styles from '../styles';

const VenueMapStrip = ({ venue, city }) => {
  const query = [venue, city].filter(Boolean).join(', ');

  const openMaps = useCallback(() => {
    if (!query) return;
    openExternalUrl(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query,
      )}`,
    );
  }, [query]);

  if (!query) return null;

  return (
    <AnimatedPressable
      onPress={openMaps}
      style={styles.mapStrip}
      accessibilityRole="button"
      accessibilityLabel={`Open ${query} in maps`}
    >
      <Image
        source={images.maplocationnbanner}
        style={styles.mapImage}
        resizeMode="contain"
      />
      <View style={styles.mapLabel}>
        <Text style={styles.mapLabelText}>Find your way{'\n'}to the venue</Text>
      </View>
    </AnimatedPressable>
  );
};

export default React.memo(VenueMapStrip);
