import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SPACE } from '@/styles/homeTheme';
import { CollectionFooter, ShowcaseHeader } from './molecules';
import { ShowcaseMosaic } from './organisms';
import {
  DEFAULTS,
  MAX_TILES,
  PANEL_EDGE,
  PANEL_INSET,
  PANEL_PAD,
  PANEL_RADIUS,
  PANEL_SURFACE,
} from './tokens';

const BottomShowcase = ({ banner, products, onBannerPress, onSeeAll }) => {
  const items = useMemo(() => (products || []).slice(0, MAX_TILES), [products]);

  const title = useMemo(
    () => banner?.title || banner?.Title || DEFAULTS.title,
    [banner],
  );

  const openCollection = useCallback(() => {
    if (onSeeAll) onSeeAll();
    else onBannerPress(banner);
  }, [onSeeAll, onBannerPress, banner]);

  if (!banner || items.length === 0) return null;

  const subtitle = banner.subTitle || banner.SubTitle || DEFAULTS.subtitle;
  const hidden = (products?.length || 0) - items.length;

  return (
    <View style={styles.wrap}>
      <ShowcaseHeader
        eyebrow={DEFAULTS.eyebrow}
        title={title}
        subtitle={subtitle}
        ctaLabel={DEFAULTS.cta}
        onPress={openCollection}
      />

      <View style={styles.mosaic}>
        <ShowcaseMosaic items={items} onItemPress={onBannerPress} />
      </View>

      <CollectionFooter
        label={DEFAULTS.footer}
        meta={hidden > 0 ? `+${hidden} more inside` : null}
        onPress={openCollection}
      />
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
    borderColor: PANEL_EDGE,
    padding: PANEL_PAD,
    overflow: 'hidden',
  },
  mosaic: {
    marginTop: PANEL_PAD,
    marginBottom: PANEL_PAD + 4,
  },
});

export default React.memo(BottomShowcase);
