import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FallbackImage from '../../../../components/FallbackImage';
import { HOME_FONTS } from '../../../Home/redesign/theme';
import type { OrderListItem } from '../../../../types/order';
import {
  formatOrderNumber,
  lineItemImage,
  primaryItem,
  trackerStep,
} from '../data/selectors';
import OrderTracker from './OrderTracker';
import DetailsPill from './DetailsPill';
import { ORDER_COLORS, fs, s } from './theme';

type Props = {
  order: OrderListItem;
  onPress: () => void;
};

const ActiveOrderHero: React.FC<Props> = ({ order, onPress }) => {
  const item = primaryItem(order);

  return (
    <View style={styles.wrap} testID="order-hero">
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
          <Text style={styles.orderNo} numberOfLines={1}>
            {`Order ${formatOrderNumber(order.orderNumber)}`}
          </Text>
        </View>
        <DetailsPill testID="order-hero-details" onPress={onPress} />
      </View>
      <OrderTracker step={trackerStep(order)} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: s(16), paddingTop: s(18) },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: s(70),
    height: s(70),
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
  orderNo: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: ORDER_COLORS.inkMuted,
    marginTop: s(3),
  },
});

export default ActiveOrderHero;
