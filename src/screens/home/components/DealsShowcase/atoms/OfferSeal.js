import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_ELEVATION } from '@/styles/cartTheme';
import DealText from './DealText';
import { PEACH, SEAL_HERO, SEAL_TILE } from '../tokens';

const TONES = {
  hero: { bg: PEACH.sealHero, size: SEAL_HERO },
  tile: { bg: PEACH.seal, size: SEAL_TILE },
};

const OfferSeal = ({ lead, value, trail, tone = 'tile', style }) => {
  const palette = TONES[tone] || TONES.tile;
  const scale = palette.size / SEAL_HERO;

  return (
    <View
      style={[
        styles.seal,
        {
          width: palette.size,
          height: palette.size,
          borderRadius: palette.size / 2,
          backgroundColor: palette.bg,
        },
        style,
      ]}
    >
      {lead ? (
        <DealText variant="sealLead" tone="onSeal" numberOfLines={1}>
          {lead}
        </DealText>
      ) : null}

      <DealText
        variant="sealValue"
        tone="onSeal"
        numberOfLines={1}
        style={{ fontSize: 26 * scale, lineHeight: 30 * scale }}
      >
        {value}
      </DealText>

      {trail ? (
        <DealText variant="sealLead" tone="onSeal" numberOfLines={1}>
          {trail}
        </DealText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  seal: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    ...CART_ELEVATION.raised,
  },
});

export default React.memo(OfferSeal);
