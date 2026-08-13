import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import Divider from '../atoms/Divider';
import OrderItemRow from '../molecules/OrderItemRow';
import BillBreakdown from '../molecules/BillBreakdown';
import { COLORS, RADIUS, SPACING, hp, wp } from '../theme';
import { formatMoney } from '../tokens/format';

const OrderItemsCard = ({ items = [], orderStatus, onReturn, bill, total }) => {
  const [expanded, setExpanded] = useState(false);
  const savings = bill?.totalSavings ?? 0;

  return (
    <Surface style={styles.card}>
      <View style={styles.body}>
        {items.map((item, index) => (
          <View key={item?.orderItemId ?? item?.productId ?? index}>
            {index > 0 && <Divider />}
            <OrderItemRow
              item={item}
              orderStatus={orderStatus}
              onReturn={onReturn}
            />
          </View>
        ))}

        <Divider style={styles.rule} />

        <View style={styles.totalRow}>
          <OrderText variant="bodyStrong">Order total</OrderText>
          <OrderText variant="priceLarge">{formatMoney(total)}</OrderText>
        </View>

        {!!bill && (
          <AnimatedPressable
            style={styles.toggle}
            onPress={() => setExpanded(value => !value)}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel={
              expanded ? 'Hide bill details' : 'View bill details'
            }
          >
            <OrderText variant="captionStrong" tone="secondary">
              {expanded ? 'Hide bill details' : 'View bill details'}
            </OrderText>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={wp('3.4%')}
              color={COLORS.textSecondary}
            />
          </AnimatedPressable>
        )}

        {expanded && <BillBreakdown bill={bill} />}
      </View>

      {savings > 0 && (
        <View style={styles.savings}>
          <MaterialCommunityIcons
            name="check-decagram"
            size={wp('4%')}
            color={COLORS.success}
          />
          <OrderText variant="captionStrong" tone="success">
            You saved {formatMoney(savings)} on this order
          </OrderText>
        </View>
      )}
    </Surface>
  );
};

export default React.memo(OrderItemsCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  body: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  rule: {
    marginTop: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs + 2,
    backgroundColor: COLORS.well,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    backgroundColor: COLORS.successTint,
    paddingHorizontal: SPACING.lg,
    paddingVertical: hp('1.1%'),
    borderBottomLeftRadius: RADIUS.card,
    borderBottomRightRadius: RADIUS.card,
  },
});
