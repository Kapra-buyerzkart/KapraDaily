import React from 'react';
import { View, StatusBar, Image, StyleSheet } from 'react-native';
import Shimmer from '@/components/events/Shimmer';
import images from '@/assets/images';
import screenStyles, { HERO_HEIGHT } from '../styles';

const ARTIST_KEYS = ['a', 'b', 'c', 'd'];
const ACCORDION_KEYS = ['about', 'terms', 'faq'];

// Loading placeholder that mirrors the EventDetailsScreen layout (hero ->
// claim banner -> summary card -> more to know -> artists -> accordions) so the
// shimmer reads as "the content that's coming" instead of a blank spinner.
const EventDetailsSkeleton = () => {
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
        {/* Hero */}
        <Shimmer style={styles.hero} />

        {/* Claim banner */}
        <Shimmer style={styles.banner} />

        {/* Summary card */}
        <View style={styles.card}>
          <Shimmer style={[styles.line, styles.title]} />
          <View style={styles.row}>
            <Shimmer style={styles.pill} />
            <Shimmer style={[styles.line, styles.organizer]} />
          </View>
          <Shimmer style={[styles.line, styles.price]} />
          {[0, 1].map(i => (
            <View key={i} style={styles.infoRow}>
              <Shimmer style={styles.infoIcon} />
              <View style={styles.infoTextGroup}>
                <Shimmer style={[styles.line, styles.infoPrimary]} />
                <Shimmer style={[styles.line, styles.infoSecondary]} />
              </View>
            </View>
          ))}
        </View>

        {/* More to know */}
        <View style={styles.section}>
          <Shimmer style={[styles.line, styles.sectionTitle]} />
          <Shimmer style={[styles.line, styles.metaRow]} />
          <Shimmer style={[styles.line, styles.metaRow]} />
        </View>

        {/* Artists */}
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

        {/* Accordions */}
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
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  banner: {
    marginHorizontal: 20,
    marginTop: 16,
    height: 64,
    borderRadius: 16,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 18,
  },
  line: {
    borderRadius: 8,
  },
  title: {
    height: 22,
    width: '75%',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    width: 72,
    height: 24,
    borderRadius: 999,
    marginRight: 10,
  },
  organizer: {
    height: 14,
    width: 110,
  },
  price: {
    height: 18,
    width: 140,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    marginRight: 12,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoPrimary: {
    height: 14,
    width: '55%',
    marginBottom: 6,
  },
  infoSecondary: {
    height: 12,
    width: '35%',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    height: 18,
    width: 130,
    marginBottom: 16,
  },
  metaRow: {
    height: 14,
    width: '60%',
    marginBottom: 14,
  },
  artistCard: {
    width: 84,
    marginRight: 12,
  },
  artistImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    marginBottom: 8,
  },
  artistName: {
    height: 12,
    width: 64,
  },
  accordion: {
    marginHorizontal: 20,
    marginTop: 16,
    height: 56,
    borderRadius: 16,
  },
});

export default React.memo(EventDetailsSkeleton);
