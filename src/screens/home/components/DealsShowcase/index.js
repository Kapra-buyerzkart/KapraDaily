import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SPACE } from '@/styles/homeTheme';
import { CART_SPACING } from '@/styles/cartTheme';
import { DealsHero, SeeMoreBar, TrustStrip } from './molecules';
import { DealTileRow } from './organisms';
import {
  DEFAULTS,
  MAX_TILES,
  PANEL_INSET,
  PANEL_PAD,
  PANEL_RADIUS,
  PANEL_SURFACE,
  PEACH,
} from './tokens';

const offerOf = (source, fallback) =>
  source?.offerText || source?.OfferText || source?.discount || fallback;

const DealsShowcase = ({ banner, products, onBannerPress, onSeeAll }) => {
  const items = useMemo(() => (products || []).slice(0, MAX_TILES), [products]);

  const heroOffer = offerOf(banner, DEFAULTS.offer);

  const offerFor = useCallback(item => offerOf(item, heroOffer), [heroOffer]);

  const openCollection = useCallback(() => {
    if (onSeeAll) onSeeAll();
    else onBannerPress?.(banner);
  }, [onSeeAll, onBannerPress, banner]);

  if (!banner || items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <LinearGradient {...PANEL_SURFACE} style={styles.panel}>
        <DealsHero
          source={banner.uri}
          eyebrow={banner.subTitle || banner.SubTitle || DEFAULTS.eyebrow}
          title={banner.title || banner.Title || DEFAULTS.title}
          offer={heroOffer}
          onPress={openCollection}
        />

        <TrustStrip />

        <DealTileRow
          items={items}
          offerFor={offerFor}
          onItemPress={onBannerPress}
        />

        <SeeMoreBar label={DEFAULTS.cta} onPress={openCollection} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: SPACE.lg,
    paddingHorizontal: PANEL_INSET,
  },
  panel: {
    borderRadius: PANEL_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PEACH.edge,
    padding: PANEL_PAD,
    gap: CART_SPACING.md,
    overflow: 'hidden',
  },
});

export default React.memo(DealsShowcase);
