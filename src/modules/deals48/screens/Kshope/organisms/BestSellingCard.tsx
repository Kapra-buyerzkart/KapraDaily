import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PressableScale, SectionLabel, ShopText, Surface } from '../atoms';
import { styles as shared } from '../styles';
import { getImageSource } from '../useKshopeScreen';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const ARROW = wp('9.5%');

interface BestSellingCardProps {
  items: any[];
  index: number;
  onIndexChange: (index: number) => void;
}

const NavButton = ({
  name,
  onPress,
  label,
}: {
  name: string;
  onPress: () => void;
  label: string;
}) => (
  <PressableScale
    to={0.9}
    onPress={onPress}
    style={styles.arrow}
    contentStyle={styles.arrowContent}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Ionicons name={name} size={wp('4.6%')} color={CART_COLORS.textPrimary} />
  </PressableScale>
);

const BestSellingCard: React.FC<BestSellingCardProps> = ({
  items,
  index,
  onIndexChange,
}) => {
  const current = items[index];
  if (!current) return null;

  const previous = index > 0 ? items[index - 1] : null;
  const next = index < items.length - 1 ? items[index + 1] : null;

  return (
    <View style={shared.section}>
      <SectionLabel>Best selling</SectionLabel>

      <Surface style={styles.card}>
        <View style={styles.stage}>
          {previous && (
            <Image
              source={getImageSource(previous.imageUrl || previous.image)}
              style={[styles.peek, styles.peekLeft]}
              resizeMode="contain"
            />
          )}
          {next && (
            <Image
              source={getImageSource(next.imageUrl || next.image)}
              style={[styles.peek, styles.peekRight]}
              resizeMode="contain"
            />
          )}

          <Image
            source={getImageSource(current.imageUrl || current.image)}
            style={styles.hero}
            resizeMode="contain"
          />

          <View style={styles.controls} pointerEvents="box-none">
            {previous ? (
              <NavButton
                name="chevron-back"
                label="Previous product"
                onPress={() => onIndexChange(index - 1)}
              />
            ) : (
              <View style={styles.arrowSpacer} />
            )}
            {next ? (
              <NavButton
                name="chevron-forward"
                label="Next product"
                onPress={() => onIndexChange(index + 1)}
              />
            ) : (
              <View style={styles.arrowSpacer} />
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.copy}>
            <ShopText variant="heading" numberOfLines={2}>
              {current.brand || current.prName || 'Product'}
            </ShopText>
            <ShopText variant="micro" tone="muted" style={styles.counter}>
              {index + 1} of {items.length}
            </ShopText>
          </View>

          <View style={styles.price}>
            <ShopText variant="priceLarge">
              ₹{current.specialPrice || current.price || '0'}
            </ShopText>
            <ShopText variant="caption" tone="faint" style={styles.mrp}>
              MRP ₹{current.unitPrice || current.originalPrice || '0'}
            </ShopText>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default React.memo(BestSellingCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.lg,
    gap: CART_SPACING.lg,
  },
  stage: {
    height: hp('26%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CART_RADIUS.productCard,
    backgroundColor: CART_COLORS.well,
    overflow: 'hidden',
  },
  hero: {
    width: '66%',
    height: '82%',
  },
  peek: {
    position: 'absolute',
    width: wp('34%'),
    height: '62%',
    opacity: 0.18,
  },
  peekLeft: {
    left: -wp('12%'),
  },
  peekRight: {
    right: -wp('12%'),
  },
  controls: {
    position: 'absolute',
    left: CART_SPACING.md,
    right: CART_SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrow: {
    width: ARROW,
    height: ARROW,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
  },
  arrowContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowSpacer: {
    width: ARROW,
    height: ARROW,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
  },
  counter: {
    marginTop: 2,
  },
  price: {
    alignItems: 'flex-end',
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
});
