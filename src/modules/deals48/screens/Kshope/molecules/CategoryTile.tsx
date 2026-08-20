import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { PressableScale, ShopText } from '../atoms';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  wp,
} from '@/styles/cartTheme';
import { getImageSource } from '../useKshopeScreen';

const WELL = wp('17%');

interface CategoryTileProps {
  item: any;
  onPress: () => void;
}

const CategoryTile: React.FC<CategoryTileProps> = ({ item, onPress }) => {
  const label = item.catName || item.name;

  return (
    <PressableScale
      to={0.94}
      style={styles.tile}
      contentStyle={styles.content}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Image
        source={getImageSource(item.imageUrl || item.image)}
        style={styles.well}
        resizeMode="contain"
      />
      <ShopText
        variant="micro"
        tone="secondary"
        numberOfLines={2}
        style={styles.label}
      >
        {label}
      </ShopText>
    </PressableScale>
  );
};

export default React.memo(CategoryTile);

const styles = StyleSheet.create({
  tile: {
    width: WELL,
  },
  content: {
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  well: {
    width: WELL,
    height: WELL,
    borderRadius: CART_RADIUS.productCard,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
  },
  label: {
    height: CART_TYPE.micro.lineHeight * 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
