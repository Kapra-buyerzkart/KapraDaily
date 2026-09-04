import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FallbackImage from '../../../../components/FallbackImage';
import { HOME_FONTS } from '../../../Home/redesign/theme';
import type { OrderListItem } from '../../../../types/order';
import {
  formatAmount,
  formatOrderDate,
  formatOrderNumber,
  lineItemImage,
  primaryItem,
} from '../data/selectors';
import DetailsPill from './DetailsPill';
import { ORDER_COLORS, fs, s } from './theme';

type Props = {
  order: OrderListItem;
  onPress: () => void;
};

const OrderCard: React.FC<Props> = ({ order, onPress }) => {
  const item = primaryItem(order);
  const placedOn = formatOrderDate(order.orderDate);

  return (
    <View style={styles.card} testID="order-card">
      {placedOn ? (
        <Text style={styles.placedOn}>{`Order Placed on, ${placedOn}`}</Text>
      ) : null}

      <View style={styles.row}>
        <FallbackImage
          source={lineItemImage(item) as any}
          style={styles.thumb}
          resizeMode="contain"
        />
        <View style={styles.body}>
          <Text style={styles.status} numberOfLines={1}>
            {order.orderStatusText}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {item?.productName}
          </Text>
        </View>
        <DetailsPill testID="order-card-details" onPress={onPress} />
      </View>

      <View style={styles.totals}>
        <View style={styles.totalsCol}>
          <Text style={styles.totalsLabel}>Order ID :</Text>
          <Text style={styles.totalsValue} numberOfLines={1}>
            {formatOrderNumber(order.orderNumber)}
          </Text>
        </View>
        <View style={[styles.totalsCol, styles.totalsColRight]}>
          <Text style={styles.totalsLabel}>Total Amount :</Text>
          <Text style={styles.totalsAmount} numberOfLines={1}>
            {formatAmount(order.grandTotal)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        testID="order-card-view-more"
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.viewMore}
      >
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: s(16),
    marginTop: s(18),
    padding: s(14),
    borderRadius: s(10),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: ORDER_COLORS.cardBorder,
    backgroundColor: ORDER_COLORS.page,
  },
  placedOn: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(14),
    color: ORDER_COLORS.ink,
    marginBottom: s(12),
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: s(62),
    height: s(62),
    borderRadius: s(8),
    backgroundColor: ORDER_COLORS.thumbBg,
  },
  body: { flex: 1, marginHorizontal: s(12) },
  status: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(12),
    color: ORDER_COLORS.accent,
  },
  name: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(13),
    color: ORDER_COLORS.ink,
    marginTop: s(3),
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(16),
  },
  totalsCol: { flex: 1 },
  totalsColRight: { alignItems: 'flex-end' },
  totalsLabel: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: ORDER_COLORS.ink,
  },
  totalsValue: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: ORDER_COLORS.ink,
    marginTop: s(4),
  },
  totalsAmount: {
    fontFamily: HOME_FONTS.bold,
    fontSize: fs(15),
    color: ORDER_COLORS.ink,
    marginTop: s(4),
  },
  viewMore: {
    alignSelf: 'center',
    marginTop: s(16),
    paddingHorizontal: s(24),
    paddingVertical: s(9),
    borderRadius: s(6),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: ORDER_COLORS.accent,
  },
  viewMoreText: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(12),
    color: ORDER_COLORS.accent,
  },
});

export default OrderCard;
