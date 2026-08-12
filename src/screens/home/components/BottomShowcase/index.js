import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SPACE } from '@/styles/homeTheme';
import ShowcaseHeader from './molecules/ShowcaseHeader';
import ShowcaseRail from './molecules/ShowcaseRail';
import {
  DEFAULTS,
  PANEL,
  PANEL_EDGE,
  PANEL_INSET,
  PANEL_PAD,
  PANEL_RADIUS,
} from './tokens';

const BottomShowcase = ({ banner, products, onBannerPress, onSeeAll }) => {
  const items = useMemo(() => (products || []).slice(0, 8), [products]);

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

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={PANEL.colors}
        locations={PANEL.locations}
        start={PANEL.start}
        end={PANEL.end}
        style={styles.panel}
      >
        <View style={styles.headerWrap}>
          <ShowcaseHeader
            eyebrow={DEFAULTS.eyebrow}
            title={title}
            subtitle={subtitle}
            ctaLabel={DEFAULTS.cta}
            onPress={openCollection}
          />
        </View>

        <ShowcaseRail items={items} onItemPress={onBannerPress} />
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
    borderColor: PANEL_EDGE,
    paddingTop: PANEL_PAD,
    paddingBottom: PANEL_PAD,
    overflow: 'hidden',
  },
  headerWrap: {
    paddingHorizontal: PANEL_PAD,
  },
});

export default React.memo(BottomShowcase);
