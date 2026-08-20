import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { PagerDots } from '../atoms';
import MediaTile from '../molecules/MediaTile';
import { CARD_W, GUTTER } from '../styles';
import { CART_SPACING, hp } from '@/styles/cartTheme';

const SNAP = CARD_W + CART_SPACING.md;

interface BannerCarouselProps {
  listRef: any;
  banners: any[];
  index: number;
  onIndexChange: (index: number) => void;
  onPress: (banner: any) => void;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  listRef,
  banners,
  index,
  onIndexChange,
  onPress,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <MediaTile
        source={item.imageUrl || item.ImageUrl}
        onPress={() => onPress(item)}
        style={styles.slide}
        a11y="Offer banner"
      />
    ),
    [onPress],
  );

  return (
    <View>
      <FlatList
        ref={listRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={(_, i) => `top_${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP}
        decelerationRate="fast"
        disableIntervalMomentum
        getItemLayout={(_, i) => ({
          length: SNAP,
          offset: SNAP * i,
          index: i,
        })}
        contentContainerStyle={styles.content}
        onMomentumScrollEnd={e =>
          onIndexChange(Math.round(e.nativeEvent.contentOffset.x / SNAP))
        }
      />
      <PagerDots count={banners.length} index={index} />
    </View>
  );
};

export default React.memo(BannerCarousel);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.md,
  },
  slide: {
    width: CARD_W,
    height: hp('21%'),
  },
});
