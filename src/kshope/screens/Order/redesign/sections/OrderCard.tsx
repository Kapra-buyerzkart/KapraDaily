import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '../../../../theme/fonts';
import { pt } from '../../../../theme/tokens';
import type { OrderListItem } from '../../../../types/order';
import {
  formatAmountCurrency,
  formatItemCount,
  formatOrderDateCard,
  formatOrderId,
  getDeliveryInfo,
  getOrderStatusType,
  lineItemImage,
  parseItems,
  primaryItem,
} from '../data/selectors';
import { ORDER_COLORS } from './theme';

interface OrderCardProps {
  order: OrderListItem;
  onPress: () => void;
  onTrack?: () => void;
  onRate?: () => void;
  onInvoice?: () => void;
  onReorder?: () => void;
}

const DEFAULT_IMAGES = {
  ring: require('../../../../assets/images/orders/ring.jpg'),
  pendant: require('../../../../assets/images/orders/pendant.jpg'),
  earrings: require('../../../../assets/images/orders/earrings.jpg'),
  bangle: require('../../../../assets/images/orders/bangle.jpg'),
};

const getFallbackImage = (name?: string) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('ring')) return DEFAULT_IMAGES.ring;
  if (lower.includes('pendant') || lower.includes('chain') || lower.includes('neck')) {
    return DEFAULT_IMAGES.pendant;
  }
  if (lower.includes('ear') || lower.includes('drop')) {
    return DEFAULT_IMAGES.earrings;
  }
  return DEFAULT_IMAGES.bangle;
};

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onTrack,
  onRate,
  onInvoice,
  onReorder,
}) => {
  const item = primaryItem(order);
  const items = parseItems(order);
  const itemCount = items.length || 1;
  const statusType = getOrderStatusType(order);
  const delivery = getDeliveryInfo(order);

  // Status configuration
  const getBadgeConfig = () => {
    switch (statusType) {
      case 'processing':
        return {
          label: order.orderStatusText || 'Processing',
          bg: ORDER_COLORS.processingBg,
          color: ORDER_COLORS.processingInk,
          icon: <Ionicons name="time-outline" size={12} color={ORDER_COLORS.processingInk} />,
        };
      case 'shipped':
        return {
          label: order.orderStatusText || 'Shipped',
          bg: ORDER_COLORS.shippedBg,
          color: ORDER_COLORS.shippedInk,
          icon: (
            <MaterialCommunityIcons
              name="truck-outline"
              size={13}
              color={ORDER_COLORS.shippedInk}
            />
          ),
        };
      case 'delivered':
        return {
          label: order.orderStatusText || 'Delivered',
          bg: ORDER_COLORS.deliveredBg,
          color: ORDER_COLORS.deliveredInk,
          icon: <Ionicons name="checkmark" size={13} color={ORDER_COLORS.deliveredInk} />,
        };
      case 'cancelled':
      default:
        return {
          label: order.orderStatusText || 'Cancelled',
          bg: ORDER_COLORS.cancelledBg,
          color: ORDER_COLORS.cancelledInk,
          icon: (
            <Ionicons
              name="close-circle-outline"
              size={13}
              color={ORDER_COLORS.cancelledInk}
            />
          ),
        };
    }
  };

  const badgeConfig = getBadgeConfig();
  const imageSource = lineItemImage(item) || getFallbackImage(item?.productName);
  const price = formatAmountCurrency(order.grandTotal ?? order.totalAmount ?? item?.price ?? 0);
  const orderIdText = formatOrderId(order.orderNumber || order.orderId);
  const dateAndItemsText = `${formatOrderDateCard(order.orderDate)} | ${formatItemCount(itemCount)}`;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.card}
      testID={`order-card-${order.orderId}`}
    >
      {/* ─── Top section: Thumbnail, Info & Status ─── */}
      <View style={styles.topRow}>
        {/* Thumbnail */}
        <View style={styles.imageContainer}>
          <Image
            source={imageSource as any}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Product details */}
        <View style={styles.infoContainer}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item?.productName || 'Diamond Jewelry'}
          </Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {orderIdText}
          </Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {dateAndItemsText}
          </Text>
        </View>

        {/* Status badge & Delivery info */}
        <View style={styles.statusContainer}>
          <View style={[styles.badge, { backgroundColor: badgeConfig.bg }]}>
            {badgeConfig.icon}
            <Text style={[styles.badgeText, { color: badgeConfig.color }]}>
              {badgeConfig.label}
            </Text>
          </View>

          <View style={styles.deliveryRow}>
            <View style={styles.deliveryTextWrap}>
              <Text style={styles.deliveryLabel}>{delivery.label}</Text>
              <Text style={styles.deliveryDate} numberOfLines={1}>
                {delivery.date}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={15}
              color="#A0A0A0"
              style={styles.chevron}
            />
          </View>
        </View>
      </View>

      {/* ─── Bottom section: Price & Contextual Actions ─── */}
      {statusType === 'delivered' ? (
        <View style={styles.deliveredBottomSection}>
          <Text style={styles.priceText}>{price}</Text>

          <View style={styles.deliveredActionsRow}>
            <TouchableOpacity
              style={styles.rateButton}
              activeOpacity={0.85}
              onPress={onRate || onPress}
            >
              <Ionicons name="star" size={12} color="#D4AF37" />
              <Text style={styles.rateButtonText}>Rate Product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              activeOpacity={0.85}
              onPress={onInvoice || onPress}
            >
              <Ionicons
                name="document-text-outline"
                size={13}
                color={ORDER_COLORS.ink}
              />
              <Text style={styles.outlineButtonText}>Invoice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              activeOpacity={0.85}
              onPress={onReorder || onPress}
            >
              <Text style={styles.outlineButtonText}>Reorder</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>{price}</Text>

          {statusType === 'processing' || statusType === 'shipped' ? (
            <TouchableOpacity
              style={styles.trackButton}
              activeOpacity={0.85}
              onPress={onTrack || onPress}
            >
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={15}
                color="#FFFFFF"
              />
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 74,
    height: 74,
    borderRadius: 14,
    backgroundColor: '#F5F0E8',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDE5D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
    justifyContent: 'center',
  },
  productTitle: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(13.5),
    lineHeight: pt(18),
    color: ORDER_COLORS.ink,
  },
  metaText: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(10.5),
    lineHeight: pt(15),
    color: ORDER_COLORS.inkMuted,
    marginTop: 3,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(10),
    lineHeight: pt(14),
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  deliveryTextWrap: {
    alignItems: 'flex-end',
  },
  deliveryLabel: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(8.5),
    lineHeight: pt(12),
    color: '#8C8C8C',
  },
  deliveryDate: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(10.5),
    lineHeight: pt(15),
    color: ORDER_COLORS.ink,
    marginTop: 1,
  },
  chevron: {
    marginLeft: 4,
    marginTop: 6,
  },

  /* ── Bottom row for Processing / Shipped / Cancelled ── */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 4,
  },
  priceText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(17),
    lineHeight: pt(22),
    color: ORDER_COLORS.ink,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ORDER_COLORS.darkGreen,
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
  },
  trackButtonText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: '#FFFFFF',
  },
  viewDetailsText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(12),
    color: '#333333',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  /* ── Bottom section for Delivered ── */
  deliveredBottomSection: {
    marginTop: 14,
    paddingTop: 4,
  },
  deliveredActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ORDER_COLORS.darkGreen,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
  },
  rateButtonText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11),
    color: '#FFFFFF',
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
  },
  outlineButtonText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11),
    color: ORDER_COLORS.ink,
  },
});

export default OrderCard;
