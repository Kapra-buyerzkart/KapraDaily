import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import { entrance } from '@/styles/motion';
import StatusPill from '../atoms/StatusPill';
import ThumbStack from '../atoms/ThumbStack';
import OrderActionRow from '../molecules/OrderActionRow';
import { resolveOrderStatus, isLiveOrder } from '../tokens/orderStatus';
import {
  formatItemCount,
  formatMoney,
  formatOrderDate,
  orderLabelOf,
  productImagesOf,
} from '../tokens/format';

const STAGGER_LIMIT = 6;

const OrderCard = ({
  order,
  index = 0,
  onOpen,
  onReorder,
  reorderDisabled,
}) => {
  const entering = useMemo(
    () => (index < STAGGER_LIMIT ? entrance(index) : undefined),
    [index],
  );
  const status = useMemo(() => resolveOrderStatus(order), [order]);
  const images = useMemo(() => productImagesOf(order), [order]);
  const itemCount = order?.totalOrderItems ?? images.length;

  const open = useCallback(() => onOpen?.(order), [onOpen, order]);
  const reorder = useCallback(() => onReorder?.(order), [onReorder, order]);

  const actions = [
    order?.canReorder && {
      label: 'Reorder',
      icon: 'refresh',
      variant: 'primary',
      disabled: reorderDisabled,
      onPress: reorder,
    },
    {
      label: isLiveOrder(status) ? 'Track order' : 'View details',
      icon: isLiveOrder(status) ? 'navigate-outline' : 'receipt-outline',
      variant: order?.canReorder ? 'ghost' : 'primary',
      onPress: open,
    },
  ];

  return (
    <AnimatedPressable
      style={styles.card}
      entering={entering}
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`Order ${orderLabelOf(order)}, ${
        status.label
      }, ${formatMoney(
        order?.grandTotal ?? order?.price ?? order?.totalAmount,
      )}`}
    >
      <View style={styles.header}>
        <StatusPill status={status} />
        <Text style={styles.date} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {formatOrderDate(order?.orderDate || order?.date || order?.time)}
        </Text>
      </View>

      <View style={styles.body}>
        <ThumbStack images={images} total={itemCount} />

        <View style={styles.meta}>
          <Text
            style={styles.orderNumber}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {orderLabelOf(order)}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={styles.metaText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {formatItemCount(itemCount)}
            </Text>
            <View style={styles.dot} />
            <Ionicons
              name="location-outline"
              size={wp('3.2%')}
              color={INK.faint}
            />
            <Text
              style={[styles.metaText, styles.address]}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {order?.addressType || 'Home'}
            </Text>
          </View>
        </View>

        <Text style={styles.price} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {formatMoney(order?.grandTotal ?? order?.price ?? order?.totalAmount)}
        </Text>
      </View>

      <OrderActionRow actions={actions} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.md,
    padding: SPACE.base,
    borderRadius: RADIUS.lg,
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
    flexShrink: 1,
    textAlign: 'right',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.base,
  },
  meta: {
    flex: 1,
    marginLeft: SPACE.md,
  },
  orderNumber: {
    ...TYPE.body,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  metaText: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },
  address: {
    marginLeft: 2,
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: INK.faint,
    marginHorizontal: SPACE.xs + 2,
  },
  price: {
    ...TYPE.heading,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    marginLeft: SPACE.sm,
    letterSpacing: -0.4,
  },
});

export default React.memo(OrderCard);
