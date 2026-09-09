import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getLocalityLine, getStatePinLine } from '@/utils/addressFormat';

import { ADDRESS_PIN_SIZE, BEACON_ICON_NAME } from '../../constants';
import { COLORS, RADIUS, SHADOW, SPACING, WINDOW_WIDTH } from '../../theme';
import { LocText } from '../atoms';

const PIN_GLYPH_SIZE = Math.round(ADDRESS_PIN_SIZE * 0.52);

const AddressSummary = ({ geocodeResult }) => (
  <View style={styles.card}>
    <View style={styles.pin}>
      <Ionicons
        name={BEACON_ICON_NAME}
        size={PIN_GLYPH_SIZE}
        color={COLORS.brand}
      />
    </View>

    <View style={styles.wrap}>
      <LocText variant="micro" tone="brand" style={styles.eyebrow}>
        Your location
      </LocText>
      <LocText
        variant="title"
        tone="primary"
        numberOfLines={2}
        style={styles.locality}
      >
        {getLocalityLine(geocodeResult)}
      </LocText>
      <LocText variant="caption" tone="muted" style={styles.statePin}>
        {getStatePinLine(geocodeResult)}
      </LocText>
    </View>
  </View>
);

export default React.memo(AddressSummary);

const styles = StyleSheet.create({
  card: {
    // width: WINDOW_WIDTH * 0.86,
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  pin: {
    width: ADDRESS_PIN_SIZE,
    height: ADDRESS_PIN_SIZE,
    borderRadius: ADDRESS_PIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandTint,
  },
  wrap: {
    alignItems: 'center',
  },
  eyebrow: {
    marginTop: SPACING.lg,
    letterSpacing: 1.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  locality: {
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  statePin: {
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
