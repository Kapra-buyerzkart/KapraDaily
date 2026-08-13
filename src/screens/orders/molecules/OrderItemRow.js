import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import appImages from '@/assets/images';
import CONFIG from '@/globals/config';
import OrderText from '../atoms/OrderText';
import { COLORS, RADIUS, SPACING, TOUCH_MIN, wp } from '../theme';
import { formatMoney } from '../tokens/format';

const THUMB = wp('15%');

const NOTE_TONE = {
  success: { bg: COLORS.successTint, fg: 'success' },
  danger: { bg: COLORS.dangerTint, fg: 'danger' },
  warn: { bg: COLORS.warnTint, fg: 'warn' },
  info: { bg: COLORS.infoTint, fg: 'info' },
};

const sourceOf = (image, failed) => {
  if (!image || failed) return appImages.noimage;
  if (typeof image !== 'string') return image;
  return {
    uri: image.startsWith('http') ? image : `${CONFIG.image_base_url}${image}`,
  };
};

const refundToneOf = status => {
  const value = status.toLowerCase();
  if (
    value.includes('approved') ||
    value.includes('completed') ||
    value.includes('refunded')
  )
    return 'success';
  if (value.includes('rejected') || value.includes('denied')) return 'danger';
  return 'info';
};

const noteOf = item => {
  if (item?.returnRefundStatus)
    return {
      label: `Refund: ${item.returnRefundStatus}`,
      tone: refundToneOf(item.returnRefundStatus),
    };
  if (
    item?.returnStatusKey === 'requestrejected' ||
    item?.itemStatusKey === 'requestrejected'
  )
    return { label: 'Return rejected', tone: 'danger' };
  if (item?.isReturned) return { label: 'Returned', tone: 'success' };
  if (item?.returnRequested) return { label: 'Return requested', tone: 'warn' };
  return null;
};

const OrderItemRow = ({ item, orderStatus, onReturn }) => {
  const [failed, setFailed] = useState(false);

  const image =
    item?.image ||
    item?.prImage ||
    item?.productImage ||
    item?.product_image ||
    item?.featuredImage ||
    item?.img ||
    item?.productImg;

  useEffect(() => {
    setFailed(false);
  }, [image]);

  const note = useMemo(() => noteOf(item), [item]);
  const notePalette = note ? NOTE_TONE[note.tone] : null;

  const canReturn =
    orderStatus === 'delivered' &&
    item?.canReturn &&
    !item?.isReturned &&
    !item?.returnRequested;

  const amount =
    item?.lineTotal ??
    item?.netAmount ??
    item?.price ??
    (item?.unitPrice ?? 0) * (item?.quantity ?? 0);

  return (
    <View style={styles.row}>
      <View style={styles.well}>
        <Image
          source={sourceOf(image, failed)}
          style={styles.thumb}
          onError={() => setFailed(true)}
        />
      </View>

      <View style={styles.copy}>
        <OrderText variant="labelStrong" numberOfLines={2} ellipsizeMode="tail">
          {item?.productName}
        </OrderText>
        <OrderText variant="caption" tone="muted" style={styles.qty}>
          Qty {item?.quantity}
        </OrderText>

        {!!note && (
          <View style={[styles.note, { backgroundColor: notePalette.bg }]}>
            <OrderText variant="micro" tone={notePalette.fg} numberOfLines={1}>
              {note.label}
            </OrderText>
          </View>
        )}
      </View>

      <View style={styles.trail}>
        <OrderText variant="price">{formatMoney(amount)}</OrderText>

        {canReturn && (
          <AnimatedPressable
            style={styles.return}
            onPress={() => onReturn?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`Return ${item?.productName}`}
          >
            <OrderText variant="micro" tone="secondary">
              Return
            </OrderText>
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
};

export default React.memo(OrderItemRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  well: {
    width: THUMB,
    height: THUMB,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.well,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB * 0.74,
    height: THUMB * 0.74,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACING.md,
    alignItems: 'flex-start',
  },
  qty: {
    marginTop: 2,
  },
  note: {
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: SPACING.xs + 2,
  },
  trail: {
    alignItems: 'flex-end',
    gap: SPACING.xs + 2,
  },
  return: {
    minHeight: TOUCH_MIN - 18,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.well,
  },
});
