import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { PagerDots } from '../atoms';
import MediaTile from '../molecules/MediaTile';
import { CARD_W, GUTTER, styles as shared } from '../styles';
import { CART_SPACING, hp } from '@/styles/cartTheme';

const SNAP = CARD_W + CART_SPACING.md;

interface BannerRailProps {
  banners: any[];
  index?: number;
  onIndexChange?: (index: number) => void;
  onPress: (banner: any) => void;
  keyPrefix: string;
  compact?: boolean;
}

const BannerRail: React.FC<BannerRailProps> = ({
  banners,
  index,
  onIndexChange,
  onPress,
  keyPrefix,
  compact = false,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <MediaTile
        source={item.imageUrl || item.ImageUrl}
        onPress={() => onPress(item)}
        style={[styles.card, compact && styles.cardCompact]}
        a11y="Offer banner"
      />
    ),
    [onPress, compact],
  );

  return (
    <View style={shared.section}>
      <FlatList
        data={banners}
        renderItem={renderItem}
        keyExtractor={(_, i) => `${keyPrefix}_${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={compact ? undefined : SNAP}
        decelerationRate={compact ? 'normal' : 'fast'}
        contentContainerStyle={styles.content}
        onMomentumScrollEnd={
          onIndexChange
            ? e =>
                onIndexChange(
                  Math.round(e.nativeEvent.contentOffset.x / SNAP),
                )
            : undefined
        }
      />
      {onIndexChange && typeof index === 'number' && (
        <PagerDots count={banners.length} index={index} />
      )}
    </View>
  );
};

export default React.memo(BannerRail);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.md,
  },
  card: {
    width: CARD_W,
    height: hp('19%'),
  },
  cardCompact: {
    width: CARD_W / 2 - CART_SPACING.sm,
    height: hp('14%'),
  },
});
