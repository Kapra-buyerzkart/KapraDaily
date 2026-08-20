import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { PressableScale } from '../atoms';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  hp,
  wp,
} from '@/styles/cartTheme';
import { getImageSource } from '../useKshopeScreen';

interface BrandTileProps {
  item: any;
  onPress: () => void;
}

const BrandTile: React.FC<BrandTileProps> = ({ item, onPress }) => (
  <PressableScale
    to={0.96}
    onPress={onPress}
    style={styles.card}
    contentStyle={styles.content}
    accessibilityRole="button"
    accessibilityLabel={item.brandName || 'Brand'}
  >
    <Image
      source={getImageSource(
        item.brandImage ||
          item.imageUrl ||
          item.ImageUrl ||
          item.image ||
          item.logo,
      )}
      style={styles.logo}
      resizeMode="contain"
    />
  </PressableScale>
);

export default React.memo(BrandTile);

const styles = StyleSheet.create({
  card: {
    width: wp('26%'),
    height: hp('10%'),
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
    ...CART_ELEVATION.card,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '68%',
    height: '58%',
  },
});
