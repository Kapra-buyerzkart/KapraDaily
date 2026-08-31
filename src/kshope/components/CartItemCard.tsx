import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText, Surface, Badge, PriceBlock } from './atoms';
import FallbackImage from './FallbackImage';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  hitSlopTo,
  wp,
} from '../theme/tokens';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  quantity: number;
  image: string;
}

interface CartItemCardProps {
  item: CartItem;
  embedded?: boolean;
  onDelete?: (id: string) => void;
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
}

const hasDiscount = (discount: string) =>
  !!discount && parseFloat(discount) > 0;

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  embedded = false,
  onDelete,
  onIncrement,
  onDecrement,
}) => {
  const isLastUnit = item.quantity <= 1;

  const content = (
    <View style={styles.row}>
      <View style={styles.imageWrap}>
        <FallbackImage
          source={
            item.image
              ? { uri: item.image }
              : require('../assets/images/logos/noimage.png')
          }
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <AppText variant="label" numberOfLines={2} style={styles.title}>
            {item.title}
          </AppText>
          <TouchableOpacity
            onPress={() => onDelete?.(item.id)}
            hitSlop={hitSlopTo(wp('5%'))}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.title} from cart`}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={wp('4.6%')}
              color={UI_COLORS.textFaint}
            />
          </TouchableOpacity>
        </View>

        {hasDiscount(item.discount) && (
          <Badge
            tone="success"
            label={`${item.discount} OFF`}
            style={styles.badge}
          />
        )}

        <View style={styles.priceQtyRow}>
          <PriceBlock
            price={item.price.toFixed(2)}
            mrp={item.originalPrice ? item.originalPrice.toFixed(2) : null}
            align="flex-start"
          />

          <View style={styles.stepper}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onDecrement?.(item.id)}
              accessibilityRole="button"
              accessibilityLabel={
                isLastUnit
                  ? `Remove ${item.title} from cart`
                  : `Decrease ${item.title} quantity`
              }
            >
              <LinearGradient
                colors={[UI_COLORS.primary, UI_COLORS.primarySoft]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.qtyBtn}
              >
                <MaterialCommunityIcons
                  name={isLastUnit ? 'trash-can-outline' : 'minus'}
                  size={wp('4%')}
                  color={UI_COLORS.onPrimary}
                />
              </LinearGradient>
            </TouchableOpacity>

            <AppText variant="labelStrong" style={styles.qtyText}>
              {String(item.quantity).padStart(2, '0')}
            </AppText>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onIncrement?.(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Increase ${item.title} quantity`}
            >
              <LinearGradient
                colors={[UI_COLORS.primary, UI_COLORS.primarySoft]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.qtyBtn}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={wp('4%')}
                  color={UI_COLORS.onPrimary}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (embedded) {
    return <View style={styles.embeddedRow}>{content}</View>;
  }

  return (
    <Surface inset={false} style={styles.card}>
      {content}
    </Surface>
  );
};

export default React.memo(CartItemCard);

const styles = StyleSheet.create({
  card: {
    padding: UI_SPACING.md,
    marginBottom: UI_SPACING.md,
  },
  embeddedRow: {
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: UI_SPACING.md,
  },
  imageWrap: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: UI_RADIUS.productCard,
    backgroundColor: UI_COLORS.well,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '86%',
    height: '86%',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: UI_SPACING.sm,
  },
  title: {
    flex: 1,
  },
  badge: {
    marginTop: UI_SPACING.xs + 2,
  },
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: UI_SPACING.sm,
    marginTop: UI_SPACING.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: UI_RADIUS.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    paddingHorizontal: UI_SPACING.md,
    minWidth: wp('11%'),
    textAlign: 'center',
  },
});
