import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { entrance } from '@/styles/motion';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import Divider from '../atoms/Divider';
import StatusPill from '../atoms/StatusPill';
import ThumbStack from '../atoms/ThumbStack';
import OrderActionRow from '../molecules/OrderActionRow';
import { COLORS, SPACING, wp } from '../theme';
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
  const live = isLiveOrder(status);

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
      label: live ? 'Track order' : 'View details',
      icon: live ? 'navigate-outline' : 'receipt-outline',
      variant: 'ghost',
      onPress: open,
    },
  ];

  return (
    <Animated.View entering={entering}>
      <Surface style={styles.card}>
        <Pressable
          onPress={open}
          style={({ pressed }) => [styles.body, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Order ${orderLabelOf(order)}, ${
            status.label
          }, ${formatMoney(
            order?.grandTotal ?? order?.price ?? order?.totalAmount,
          )}`}
        >
          <View style={styles.header}>
            <StatusPill status={status} />
            <OrderText variant="micro" tone="faint" style={styles.date}>
              {formatOrderDate(order?.orderDate || order?.date || order?.time)}
            </OrderText>
          </View>

          <View style={styles.summary}>
            <ThumbStack images={images} total={itemCount} />

            <View style={styles.meta}>
              <OrderText variant="bodyStrong" numberOfLines={1}>
                {orderLabelOf(order)}
              </OrderText>
              <View style={styles.metaRow}>
                <OrderText variant="caption" tone="muted">
                  {formatItemCount(itemCount)}
                </OrderText>
                <View style={styles.dot} />
                <Ionicons
                  name="location-outline"
                  size={wp('3.2%')}
                  color={COLORS.textFaint}
                />
                <OrderText
                  variant="caption"
                  tone="muted"
                  numberOfLines={1}
                  style={styles.address}
                >
                  {order?.addressType || 'Home'}
                </OrderText>
              </View>
            </View>

            <OrderText variant="priceLarge" style={styles.price}>
              {formatMoney(
                order?.grandTotal ?? order?.price ?? order?.totalAmount,
              )}
            </OrderText>
          </View>
        </Pressable>

        <Divider />

        <OrderActionRow actions={actions} style={styles.actions} />
      </Surface>
    </Animated.View>
  );
};

export default React.memo(OrderCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  body: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  date: {
    flexShrink: 1,
    textAlign: 'right',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  meta: {
    flex: 1,
    marginLeft: SPACING.md,
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginLeft: 2,
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textFaint,
    marginHorizontal: SPACING.xs + 2,
  },
  price: {
    marginLeft: SPACING.sm,
  },
  actions: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
});
