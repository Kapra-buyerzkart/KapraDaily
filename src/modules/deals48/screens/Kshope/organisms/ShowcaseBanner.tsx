import React, { useCallback } from 'react';
import { View, ImageBackground, FlatList, StyleSheet } from 'react-native';
import MediaTile from '../molecules/MediaTile';
import { CARD_W, GUTTER, SCREEN_W, styles as shared } from '../styles';
import { getImageSource } from '../useKshopeScreen';
import { CART_RADIUS, CART_SPACING, hp } from '@/styles/cartTheme';

const TILE_W = (CARD_W - CART_SPACING.md) / 2;

interface ShowcaseBannerProps {
  banner: any;
  items: any[];
  onPress: (item: any) => void;
}

const ShowcaseBanner: React.FC<ShowcaseBannerProps> = ({
  banner,
  items,
  onPress,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <MediaTile
        source={item.imageUrl || item.ImageUrl}
        onPress={() => onPress(item)}
        style={styles.tile}
        resizeMode="contain"
        a11y="Showcase product"
      />
    ),
    [onPress],
  );

  return (
    <View style={shared.section}>
      <ImageBackground
        source={getImageSource(banner.imageUrl || banner.ImageUrl)}
        style={styles.stage}
        imageStyle={styles.stageImage}
        resizeMode="cover"
      >
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, i) =>
            item.bannerId?.toString() || item.id?.toString() || i.toString()
          }
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
        />
      </ImageBackground>
    </View>
  );
};

export default React.memo(ShowcaseBanner);

const styles = StyleSheet.create({
  stage: {
    width: SCREEN_W,
    height: hp('58%'),
    justifyContent: 'flex-end',
  },
  stageImage: {
    width: SCREEN_W,
  },
  grid: {
    paddingHorizontal: GUTTER,
    paddingBottom: hp('4%'),
    gap: CART_SPACING.md,
  },
  row: {
    gap: CART_SPACING.md,
  },
  tile: {
    width: TILE_W,
    height: hp('11%'),
    borderRadius: CART_RADIUS.productCard,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
});
