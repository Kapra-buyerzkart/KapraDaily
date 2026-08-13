import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { CART_SPACING } from '@/styles/cartTheme';
import { ArrowDisc, ShowcaseText, TileFrame, TileStage } from '../atoms';
import { CAPTION_HEIGHT } from '../tokens';

const MosaicTile = ({ item, index, height, onPress }) => {
  const caption = item?.title || item?.Title;

  const handlePress = useCallback(() => onPress?.(item), [onPress, item]);

  return (
    <TileFrame
      height={height}
      delayIndex={index}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={caption || 'Featured collection item'}
    >
      <TileStage source={item?.uri} index={index} />

      <View style={styles.caption}>
        <ShowcaseText
          variant="labelStrong"
          numberOfLines={2}
          style={styles.label}
        >
          {caption}
        </ShowcaseText>
        <ArrowDisc tone="tint" />
      </View>
    </TileFrame>
  );
};

const styles = StyleSheet.create({
  caption: {
    height: CAPTION_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.md,
  },
  label: {
    flex: 1,
    letterSpacing: -0.2,
  },
});

export default React.memo(MosaicTile);
