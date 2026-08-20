import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { PressableScale, ShopText } from '../atoms';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
} from '@/styles/cartTheme';
import { getImageSource } from '../useKshopeScreen';

const THUMB = wp('7%');

interface AccessorizeTabProps {
  item: any;
  active: boolean;
  onPress: () => void;
}

const AccessorizeTab: React.FC<AccessorizeTabProps> = ({
  item,
  active,
  onPress,
}) => {
  const title =
    item.tabName ||
    item.TabName ||
    item.catName ||
    item.CatName ||
    item.name ||
    item.Name;
  const image =
    item.tabImageUrl ||
    item.TabImageUrl ||
    item.imageUrl ||
    item.ImageUrl ||
    item.image ||
    item.Image;

  return (
    <PressableScale
      to={0.96}
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
      contentStyle={styles.content}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={title}
    >
      <Image
        source={getImageSource(image)}
        style={styles.thumb}
        resizeMode="cover"
      />
      <ShopText
        variant={active ? 'labelStrong' : 'label'}
        tone={active ? 'onDark' : 'muted'}
        numberOfLines={1}
      >
        {title}
      </ShopText>
    </PressableScale>
  );
};

export default React.memo(AccessorizeTab);

const styles = StyleSheet.create({
  tab: {
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
  },
  tabActive: {
    backgroundColor: CART_COLORS.primary,
    borderColor: CART_COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingLeft: CART_SPACING.sm - 2,
    paddingRight: CART_SPACING.lg,
    paddingVertical: CART_SPACING.sm - 2,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.well,
  },
});
