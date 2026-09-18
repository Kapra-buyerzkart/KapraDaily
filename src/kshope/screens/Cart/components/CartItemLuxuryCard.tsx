import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';
import { resolveImageSource } from '../../Home/redesign/data/mappers';

const NO_IMAGE = require('../../../assets/images/logos/noimage.png');

export type CartItemData = {
  cartItemId: number | string;
  productId: number | string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  specialPrice?: number;
  mrp?: number;
  [key: string]: any;
};

type Props = {
  item: CartItemData;
  onIncrement: (item: CartItemData) => void;
  onDecrement: (item: CartItemData) => void;
  onDelete: (item: CartItemData) => void;
  onDetails: (item: CartItemData) => void;
};

export const formatCartItemSpecs = (item: any): string => {
  const parts: string[] = [];

  const purity =
    item.purity ||
    item.goldPurity ||
    item.metalPurity ||
    (item.goldType ? `${item.goldType} Gold` : '');
  if (purity) parts.push(purity);

  const stoneOrWeight = item.diamondWeight
    ? `${item.diamondWeight} ct`
    : item.stoneWeight
    ? `${item.stoneWeight} ct`
    : item.weight
    ? `${item.weight}g`
    : item.gemstone || item.stone || '';
  if (stoneOrWeight) parts.push(stoneOrWeight);

  const size = item.size
    ? `Size ${item.size}`
    : item.ringSize
    ? `Size ${item.ringSize}`
    : '';
  if (size) parts.push(size);

  if (parts.length > 0) {
    return parts.join(' • ');
  }

  if (item.categoryName || item.catName) {
    return `${item.categoryName || item.catName}`;
  }

  return '';
};

export const CartItemLuxuryCard: React.FC<Props> = ({
  item,
  onIncrement,
  onDecrement,
  onDelete,
  onDetails,
}) => {
  const sellingPrice = Number(item.specialPrice || item.unitPrice || 0);
  const mrpPrice = Number(item.mrp || item.unitPrice || sellingPrice);
  const hasDiscount = mrpPrice > sellingPrice;
  const savingsAmount = mrpPrice - sellingPrice;
  const discountPercent =
    hasDiscount && mrpPrice > 0
      ? Math.round((savingsAmount / mrpPrice) * 100)
      : 0;

  const specsText = formatCartItemSpecs(item);

  const rawImage =
    item.productImage ||
    item.featuredImage ||
    item.imageUrl ||
    item.imagePath ||
    item.image ||
    item.raw?.featuredImage ||
    item.raw?.productImage;
  const imageSource = resolveImageSource(rawImage) || NO_IMAGE;

  return (
    <View style={styles.wrapper} testID={`cart-item-${item.cartItemId}`}>
      {/* 1. Main White Product Card */}
      <View style={styles.card}>
        <View style={styles.infoCol}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => onDetails(item)}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.productName || item.prName || item.name || 'Jewellery'}
            </Text>
          </TouchableOpacity>

          {!!specsText && (
            <Text style={styles.specsText} numberOfLines={1}>
              {specsText}
            </Text>
          )}

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={styles.sellingPrice}>
              ₹{sellingPrice.toLocaleString('en-IN')}
            </Text>
            {hasDiscount && (
              <Text style={styles.mrpPrice}>
                ₹{mrpPrice.toLocaleString('en-IN')}
              </Text>
            )}
          </View>

          {/* Savings Badge */}
          {hasDiscount && (
            <Text style={styles.savingsTag}>
              • You save ₹{savingsAmount.toLocaleString('en-IN')} (
              {discountPercent}% OFF)
            </Text>
          )}

          {/* Quantity Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              testID={`cart-item-dec-${item.cartItemId}`}
              activeOpacity={0.7}
              onPress={() => onDecrement(item)}
              style={styles.stepperBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.stepperSymbol}>—</Text>
            </TouchableOpacity>

            <Text style={styles.stepperQty}>{item.quantity || 1}</Text>

            <TouchableOpacity
              testID={`cart-item-inc-${item.cartItemId}`}
              activeOpacity={0.7}
              onPress={() => onIncrement(item)}
              style={styles.stepperBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Product Image with Dark Green Border */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onDetails(item)}
          style={styles.imageContainer}
        >
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* 2. Actions Outside the Card (Remove on left, Details on right) */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          testID={`cart-item-remove-${item.cartItemId}`}
          activeOpacity={0.7}
          onPress={() => onDelete(item)}
          style={styles.removeAction}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons
            name="trash-outline"
            size={s(15)}
            color={CART_COLORS.textMuted}
          />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID={`cart-item-details-${item.cartItemId}`}
          activeOpacity={0.7}
          onPress={() => onDetails(item)}
          style={styles.detailsAction}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.detailsText}>Details</Text>
          <Ionicons name="chevron-forward" size={s(14)} color="#0D7A58" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: s(16),
    marginBottom: s(18),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CART_COLORS.card,
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    padding: s(14),
  },
  infoCol: {
    flex: 1,
    paddingRight: s(10),
    justifyContent: 'center',
  },
  productTitle: {
    fontFamily: CART_FONTS.serifSemiBold,
    fontSize: fs(15.5),
    color: CART_COLORS.textDark,
    lineHeight: fs(19),
  },
  specsText: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10.5),
    color: CART_COLORS.textMuted,
    marginTop: s(4),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: s(8),
    marginTop: s(8),
  },
  sellingPrice: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(16),
    color: CART_COLORS.textDark,
  },
  mrpPrice: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12),
    color: CART_COLORS.strike,
    textDecorationLine: 'line-through',
  },
  savingsTag: {
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(10.5),
    color: '#0D7A58',
    marginTop: s(3),
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(84),
    height: s(28),
    borderRadius: s(6),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: CART_COLORS.white,
    marginTop: s(10),
    paddingHorizontal: s(8),
  },
  stepperBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSymbol: {
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(13),
    color: CART_COLORS.textDark,
  },
  stepperQty: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(12),
    color: CART_COLORS.textDark,
  },
  imageContainer: {
    width: s(105),
    height: s(95),
    borderRadius: s(12),
    borderWidth: 1.5,
    borderColor: '#2D554D',
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(6),
    marginTop: s(10),
  },
  removeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  removeText: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12),
    color: CART_COLORS.textMuted,
  },
  detailsAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  detailsText: {
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(12),
    color: '#0D7A58',
  },
});
