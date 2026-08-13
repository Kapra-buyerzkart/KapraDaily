import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import IconDisc from '../atoms/IconDisc';
import { COLORS, RADIUS, SPACING, wp } from '../theme';
import { formatMoney } from '../tokens/format';

const DISC = wp('9%');

const PaymentSummaryCard = ({ label, amount, badge }) => (
  <Surface style={styles.card}>
    <IconDisc size={DISC} tone="neutral" radius={RADIUS.sm}>
      <Ionicons
        name={label === 'Cash on delivery' ? 'cash-outline' : 'card-outline'}
        size={DISC * 0.5}
        color={COLORS.textSecondary}
      />
    </IconDisc>

    <View style={styles.copy}>
      <OrderText variant="bodyStrong" numberOfLines={1} ellipsizeMode="tail">
        {label}
      </OrderText>
      <OrderText variant="caption" tone="muted" style={styles.caption}>
        Amount payable
      </OrderText>
    </View>

    <View style={styles.amountBlock}>
      <OrderText variant="priceLarge">{formatMoney(amount)}</OrderText>
      {!!badge && (
        <View style={styles.badge}>
          <Ionicons
            name="checkmark-circle"
            size={wp('3.2%')}
            color={COLORS.success}
          />
          <OrderText variant="micro" tone="success" numberOfLines={1}>
            {badge}
          </OrderText>
        </View>
      )}
    </View>
  </Surface>
);

export default React.memo(PaymentSummaryCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  caption: {
    marginTop: 2,
  },
  amountBlock: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-end',
    backgroundColor: COLORS.successTint,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: SPACING.xs,
  },
});
