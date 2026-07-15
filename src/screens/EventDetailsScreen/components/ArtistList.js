import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { getVoucherImageSource } from '@/components/events/imageUtils';
import CONFIG from '@/globals/config';
import styles from '../styles';
import { PLACEHOLDER_HERO } from '../constants';

// API artists expose `artistImage` (often an absolute URL) which
// getVoucherImageSource doesn't handle. Use it directly when absolute,
// otherwise fall back to the shared resolver.
const resolveArtistImage = artist => {
  const uri = artist?.artistImage;
  if (typeof uri === 'string' && uri) {
    return /^https?:\/\//i.test(uri) ? { uri } : { uri: CONFIG.image_base_url + uri };
  }
  return getVoucherImageSource(artist);
};

const ArtistList = ({ artists }) => {
  if (!artists?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Artist</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artistList}
      >
        {artists.map((artist, index) => {
          const name = artist?.artistName || artist?.name || 'Artist';
          const role =
            artist?.specialization || artist?.role || artist?.type;
          return (
            <View
              key={artist?.eventArtistId ?? artist?.id ?? name ?? index}
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
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default React.memo(ArtistList);
