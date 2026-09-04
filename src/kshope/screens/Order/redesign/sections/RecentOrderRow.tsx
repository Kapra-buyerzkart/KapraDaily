import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FallbackImage from '../../../../components/FallbackImage';
import { HOME_FONTS } from '../../../Home/redesign/theme';
import type { OrderListItem } from '../../../../types/order';
import {
  formatAmount,
  formatOrderDate,
  formatOrderNumber,
  itemCountLabel,
  lineItemImage,
  parseItems,
  primaryItem,
  statusBucket,
} from '../data/selectors';
import { ORDER_COLORS, fs, s } from './theme';

type Props = {
  order: OrderListItem;
  onPress: () => void;
};

const RecentOrderRow: React.FC<Props> = ({ order, onPress }) => {
  const item = primaryItem(order);
  const bucket = statusBucket(order);
  const cancelled = bucket === 'cancelled';
  const chipLabel = cancelled ? 'Cancelled' : 'Delivered';
  const placedOn = formatOrderDate(order.orderDate);

  return (
    <TouchableOpacity
      testID="recent-order-row"
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.row}
    >
      <FallbackImage
        source={lineItemImage(item) as any}
        style={styles.thumb}
        resizeMode="contain"
      />

      <View style={styles.body}>
        <Text style={styles.orderNo} numberOfLines={1}>
          {`Order ${formatOrderNumber(order.orderNumber)}`}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {placedOn
            ? `${placedOn}  •  ${itemCountLabel(parseItems(order).length)}`
            : itemCountLabel(parseItems(order).length)}
        </Text>
        <Text style={styles.name} numberOfLines={1}>
          {item?.productName}
        </Text>
        <Text style={styles.price} numberOfLines={1}>
          {formatAmount(order.grandTotal)}
        </Text>
      </View>

      <View style={styles.tail}>
        {bucket === 'active' ? null : (
          <View
            style={[
              styles.chip,
              cancelled ? styles.chipCancelled : styles.chipDelivered,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                cancelled ? styles.chipTextCancelled : styles.chipTextDelivered,
              ]}
            >
              {chipLabel}
            </Text>
          </View>
        )}
        <Text style={styles.viewDetails}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    paddingVertical: s(14),
  },
  thumb: {
    width: s(78),
    height: s(78),
    borderRadius: s(8),
    backgroundColor: ORDER_COLORS.thumbBg,
  },
  body: { flex: 1, marginHorizontal: s(12) },
  orderNo: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(13),
    color: ORDER_COLORS.ink,
  },
  meta: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: ORDER_COLORS.inkMuted,
    marginTop: s(4),
  },
  name: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(12),
    color: ORDER_COLORS.ink,
    marginTop: s(6),
  },
  price: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(12),
    color: ORDER_COLORS.ink,
    marginTop: s(6),
  },
  tail: { alignItems: 'flex-end', justifyContent: 'space-between' },
  chip: {
    paddingHorizontal: s(10),
    paddingVertical: s(5),
    borderRadius: s(5),
  },
  chipDelivered: { backgroundColor: ORDER_COLORS.deliveredBg },
  chipCancelled: { backgroundColor: ORDER_COLORS.cancelledBg },
  chipText: { fontFamily: HOME_FONTS.medium, fontSize: fs(11) },
  chipTextDelivered: { color: ORDER_COLORS.deliveredInk },
  chipTextCancelled: { color: ORDER_COLORS.cancelledInk },
  viewDetails: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: ORDER_COLORS.ink,
    textDecorationLine: 'underline',
  },
});

export default RecentOrderRow;
