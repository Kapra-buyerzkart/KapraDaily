import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { HOME_FONTS, s, fs } from '../theme';

const TICKER_ITEMS = [
  'Certified 100% BIS Hallmarked Jewellery',
  'Free Insured Express Delivery across India',
  '15-Day Easy Returns & Exchange',
  'Lifetime Exchange & Buyback Guarantee',
  '100% Certified Natural Diamonds',
];

const MarqueeTicker: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, index) => (
          <View key={index} style={styles.tickerGroup}>
            <View style={styles.dot} />
            <Text style={styles.tickerText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082B22',
    paddingVertical: s(9),
    marginVertical: s(12),
  },
  scrollContent: {
    paddingHorizontal: s(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(18),
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4AF37',
    marginRight: s(8),
  },
  tickerText: {
    fontSize: fs(10),
    fontFamily: HOME_FONTS.medium,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default MarqueeTicker;
