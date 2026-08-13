import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedPressable from '@/components/AnimatedPressable';
import CachedImage from '@/components/CachedImage';
import { CART_SPACING } from '@/styles/cartTheme';
import { DealText, OfferSeal } from '../atoms';
import {
  DEFAULTS,
  HERO_HEIGHT,
  HERO_RADIUS,
  HERO_SCRIM,
  PEACH,
} from '../tokens';

const DealsHero = ({ source, eyebrow, title, offer, onPress }) => (
  <AnimatedPressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${title}, ${DEFAULTS.offerLead} ${offer} ${DEFAULTS.offerTrail}`}
    style={styles.hero}
  >
    <CachedImage source={source} style={styles.art} resizeMode="cover" />

    <LinearGradient {...HERO_SCRIM} style={StyleSheet.absoluteFill} />

    <View style={styles.copy}>
      <DealText variant="script" tone="onDark" numberOfLines={1}>
        {eyebrow}
      </DealText>
      <DealText variant="display" tone="onDark" numberOfLines={2}>
        {title}
      </DealText>
    </View>

    <OfferSeal
      tone="hero"
      lead={DEFAULTS.offerLead}
      value={offer}
      trail={DEFAULTS.offerTrail}
      style={styles.seal}
    />
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  hero: {
    height: HERO_HEIGHT,
    borderRadius: HERO_RADIUS,
    backgroundColor: PEACH.washSoft,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  art: {
    ...StyleSheet.absoluteFillObject,
  },
  copy: {
    padding: CART_SPACING.lg,
    paddingRight: CART_SPACING.xxxl,
    gap: 2,
  },
  seal: {
    position: 'absolute',
    top: CART_SPACING.md,
    right: CART_SPACING.md,
  },
});

export default React.memo(DealsHero);
