import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import LivePulse from '../atoms/LivePulse';
import ThumbStack from '../atoms/ThumbStack';
import ProgressRail from '../molecules/ProgressRail';
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
    <AnimatedPressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`Live order ${orderLabelOf(order)}, ${status.label}`}
      style={styles.shell}
    >
      <View style={[styles.card, { borderColor: status.tone.border }]}>
        <LinearGradient
          colors={[status.tone.bg, SURFACE.base]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.topRow}>
          <View style={styles.liveTag}>
            <LivePulse color={status.tone.fg} />
            <Text
              style={[styles.liveText, { color: status.tone.fg }]}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              LIVE
            </Text>
          </View>
          <Text
            style={styles.orderNumber}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {orderLabelOf(order)}
          </Text>
        </View>

        <View style={styles.headlineRow}>
          <ThumbStack images={images} total={itemCount} size={wp('11.5%')} />
          <View style={styles.headlineText}>
            <Text
              style={styles.headline}
              numberOfLines={2}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {HEADLINE[status.key] || status.label}
            </Text>
            <Text style={styles.sub} maxFontSizeMultiplier={MAX_FONT_SCALE}>
              {eta
                ? eta
                : `${formatItemCount(itemCount)} · ${formatMoney(
                    order?.grandTotal ?? order?.price ?? order?.totalAmount,
                  )}`}
            </Text>
          </View>
          <View style={[styles.chevron, { backgroundColor: status.tone.fg }]}>
            <Ionicons
              name="arrow-forward"
              size={wp('4.2%')}
              color={INK.onDark}
            />
          </View>
        </View>

        <ProgressRail step={status.step} tone={status.tone} />
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: GUTTER,
    marginBottom: SPACE.base,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACE.base,
    backgroundColor: SURFACE.base,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  liveText: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.heavy,
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  orderNumber: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    flexShrink: 1,
    marginLeft: SPACE.sm,
    textAlign: 'right',
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.md,
  },
  headlineText: {
    flex: 1,
    marginLeft: SPACE.md,
  },
  headline: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.4,
  },
  sub: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: 2,
  },
  chevron: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACE.sm,
  },
});

export default React.memo(LiveOrderCard);
