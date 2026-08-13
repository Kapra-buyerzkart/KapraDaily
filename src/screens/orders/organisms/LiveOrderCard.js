import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import IconDisc from '../atoms/IconDisc';
import LivePulse from '../atoms/LivePulse';
import ThumbStack from '../atoms/ThumbStack';
import ProgressRail from '../molecules/ProgressRail';
import { COLORS, RADIUS, SPACING, wp, hp } from '../theme';
import { resolveOrderStatus } from '../tokens/orderStatus';
import {
  formatItemCount,
  formatMoney,
  orderLabelOf,
  productImagesOf,
} from '../tokens/format';

const HEADLINE = {
  pending: 'Confirming your payment',
  placed: 'Order placed',
  accepted: 'Store is preparing your order',
  packed: 'Packed and awaiting pickup',
  onTheWay: 'Arriving soon',
};

const LiveOrderCard = ({ order, onOpen }) => {
  const status = useMemo(() => resolveOrderStatus(order), [order]);
  const images = useMemo(() => productImagesOf(order), [order]);
  const itemCount = order?.totalOrderItems ?? images.length;
  const open = useCallback(() => onOpen?.(order), [onOpen, order]);

  const eta = order?.expectedDeliveryText || order?.deliverySlotText;

  return (
    <Surface style={styles.card}>
      <Pressable
        onPress={open}
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Live order ${orderLabelOf(order)}, ${
          status.label
        }`}
      >
        <View style={styles.topRow}>
          <View style={[styles.liveTag, { backgroundColor: status.tone.bg }]}>
            <LivePulse color={status.tone.fg} size={6} />
            <OrderText
              variant="microStrong"
              tone={status.tone.fg}
              style={styles.liveText}
            >
              LIVE
            </OrderText>
          </View>
          <OrderText
            variant="micro"
            tone="muted"
            numberOfLines={1}
            style={styles.orderNumber}
          >
            {orderLabelOf(order)}
          </OrderText>
        </View>

        <View style={styles.headlineRow}>
          <ThumbStack images={images} total={itemCount} size={wp('11.5%')} />

          <View style={styles.headlineText}>
            <OrderText variant="heading" numberOfLines={2}>
              {HEADLINE[status.key] || status.label}
            </OrderText>
            <OrderText variant="caption" tone="muted" style={styles.sub}>
              {`${formatItemCount(itemCount)} · ${formatMoney(
                order?.grandTotal ?? order?.price ?? order?.totalAmount,
              )}`}
            </OrderText>
          </View>

          <IconDisc size={wp('9%')} tone="neutral" radius={wp('4.5%')}>
            <Ionicons
              name="arrow-forward"
              size={wp('4.2%')}
              color={COLORS.textPrimary}
            />
          </IconDisc>
        </View>

        <ProgressRail step={status.step} tone={status.tone} />
      </Pressable>

      {eta ? (
        <View style={[styles.etaStrip, { backgroundColor: status.tone.bg }]}>
          <Ionicons
            name="time-outline"
            size={wp('3.8%')}
            color={status.tone.fg}
          />
          <OrderText variant="captionStrong" tone={status.tone.fg}>
            {eta}
          </OrderText>
        </View>
      ) : null}
    </Surface>
  );
};

export default React.memo(LiveOrderCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  body: {
    padding: SPACING.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  liveText: {
    letterSpacing: 1.1,
  },
  orderNumber: {
    flexShrink: 1,
    textAlign: 'right',
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  headlineText: {
    flex: 1,
    marginLeft: SPACING.md,
    gap: 2,
  },
  sub: {
    marginTop: 1,
  },
  etaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: hp('1.1%'),
    borderBottomLeftRadius: RADIUS.card,
    borderBottomRightRadius: RADIUS.card,
  },
});
