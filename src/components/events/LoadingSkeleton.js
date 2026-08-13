import React from 'react';
import { View, StyleSheet } from 'react-native';
import Shimmer from './Shimmer';

const PILL_WIDTHS = [72, 104, 60];

const CardSkeleton = () => (
  <View style={styles.card}>
    <Shimmer style={styles.image} />
    <View style={styles.body}>
      <Shimmer style={[styles.line, styles.title]} />
      <View style={styles.pillsRow}>
        {PILL_WIDTHS.map((width, index) => (
          <Shimmer key={index} style={[styles.line, styles.pill, { width }]} />
        ))}
      </View>
    </View>
  </View>
);

const LoadingSkeleton = ({ variant = 'card', count = 3 }) => {
  if (variant === 'hero') {
    return (
      <View style={styles.wrapper}>
        <Shimmer style={styles.hero} />
      </View>
    );
  }

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 18,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  image: {
    width: '100%',
    height: 170,
  },
  body: {
    padding: 12,
  },
  line: {
    borderRadius: 10,
  },
  title: {
    height: 16,
    width: '65%',
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    height: 32,
  },
});

export default React.memo(LoadingSkeleton);
