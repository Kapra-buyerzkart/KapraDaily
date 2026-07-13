import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import { getVoucherImageSource } from './imageUtils';
import AnimatedPressable from '@/components/AnimatedPressable';

const GiftCard = ({ voucher, quote, quoteLoading, onPress }) => {
  if (!voucher) return null;

  const coinLabel = quoteLoading
    ? '...'
    : quote?.coinsApplied ?? quote?.udcoinsRequired ?? 0;

  return (
    <AnimatedPressable
      style={styles.card}
      entering={FadeInUp}
      onPress={onPress}
    >
      <Image
        source={getVoucherImageSource(voucher)}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.footer}>
        <View style={styles.pillsRow}>
          <View style={styles.pricePill}>
            <Text style={styles.pillText}>
              From ₹{voucher?.denomination ?? 0}
            </Text>
          </View>
          <View style={styles.coinPill}>
            <Image
              source={require('../../assets/icons/udcoin.png')}
              style={styles.coinIcon}
              resizeMode="contain"
            />
            <Text style={styles.pillText}>{coinLabel}</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  image: {
    width: '100%',
    height: 180,
  },
  footer: {
    padding: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pricePill: {
    borderWidth: 1.5,
    borderColor: '#6E34C0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6E34C0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  coinIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Gilroy-Bold',
  },
});

export default GiftCard;
