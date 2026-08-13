import React from 'react';
import { View, StatusBar, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Shimmer from '@/components/events/Shimmer';
import images from '@/assets/images';
import { getHeaderPaddingTop } from '@/utils/headerLayout';
import screenStyles, { HERO_HEIGHT, HERO_CARD_OVERLAP } from '../styles';

const ARTIST_KEYS = ['a', 'b', 'c', 'd'];
const ACCORDION_KEYS = ['details', 'terms'];

const EventDetailsSkeleton = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={screenStyles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Image
        source={images.bookingtabbg}
        style={screenStyles.bgImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        {}
        <View
          style={[styles.topBar, { paddingTop: getHeaderPaddingTop(insets) }]}
        >
          <Shimmer style={styles.topBarButton} />
          <Shimmer style={styles.topBarLogo} />
          <Shimmer style={styles.topBarButton} />
        </View>

        {}
        <Shimmer style={styles.hero} />

        {}
        <View style={styles.card}>
          <Shimmer style={[styles.line, styles.title]} />
          <Shimmer style={[styles.line, styles.tagline]} />
          <Shimmer style={styles.pill} />
          <Shimmer style={styles.factStrip} />
          <Shimmer style={styles.mapStrip} />
        </View>

        {}
        <View style={styles.section}>
          <Shimmer style={[styles.line, styles.sectionTitle]} />
          <Shimmer style={styles.banner} />
        </View>

        {}
        <View style={styles.section}>
          <Shimmer style={[styles.line, styles.sectionTitle]} />
          <View style={styles.row}>
            {ARTIST_KEYS.map(key => (
              <View key={key} style={styles.artistCard}>
                <Shimmer style={styles.artistImage} />
                <Shimmer style={[styles.line, styles.artistName]} />
              </View>
            ))}
          </View>
        </View>

        {}
        {ACCORDION_KEYS.map(key => (
          <Shimmer key={key} style={styles.accordion} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topBarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  topBarLogo: {
    width: 104,
    height: 26,
    borderRadius: 8,
  },
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  card: {
    marginHorizontal: 14,
    marginTop: -HERO_CARD_OVERLAP,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(12,6,22,0.92)',
    padding: 16,
  },
  line: {
    borderRadius: 8,
  },
  title: {
    height: 26,
    width: '80%',
    marginBottom: 10,
  },
  tagline: {
    height: 14,
    width: '55%',
  },
  pill: {
    width: 84,
    height: 26,
    borderRadius: 999,
    marginTop: 12,
  },
  factStrip: {
    height: 62,
    borderRadius: 14,
    marginTop: 14,
  },
  mapStrip: {
    height: 84,
    borderRadius: 14,
    marginTop: 12,
  },
  banner: {
    height: 66,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    height: 16,
    width: 130,
    marginBottom: 12,
  },
  artistCard: {
    width: 104,
    marginRight: 12,
  },
  artistImage: {
    width: 104,
    height: 104,
    borderRadius: 16,
    marginBottom: 10,
  },
  artistName: {
    height: 14,
    width: 80,
  },
  accordion: {
    marginHorizontal: 20,
    marginTop: 14,
    height: 72,
    borderRadius: 18,
  },
});

export default React.memo(EventDetailsSkeleton);
