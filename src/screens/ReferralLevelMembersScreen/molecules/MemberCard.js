import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import Surface from '@/screens/cart/components/atoms/Surface';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import Divider from '@/screens/cart/components/atoms/Divider';
import Badge from '@/screens/cart/components/atoms/Badge';
import { CART_COLORS, CART_RADIUS, CART_SPACING, wp } from '@/styles/cartTheme';
import { formatBT } from '@/screens/MyAffilateScreen/utils';
import { formatDate, initialOf } from '../utils';

const MemberCard = ({ member }) => {
  const {
    custName,
    phoneNo,
    joinedAt,
    referralCode,
    btEarnedForYou,
    ordersThatEarnedYou,
  } = member;

  const earning = btEarnedForYou ?? 0;
  const hasEarned = earning > 0;
  const orders = ordersThatEarnedYou ?? 0;

  return (
    <Surface style={styles.card}>
      <View style={styles.row}>
        <IconDisc
          size={wp('11%')}
          radius={CART_RADIUS.pill}
          tone={hasEarned ? 'brand' : 'neutral'}
        >
          <CartText
            variant="captionStrong"
            tone={hasEarned ? 'brand' : 'muted'}
          >
            {initialOf(custName)}
          </CartText>
        </IconDisc>

        <View style={styles.copy}>
          <CartText variant="labelStrong" numberOfLines={1}>
            {custName || 'User'}
          </CartText>
          <CartText variant="caption" tone="muted" numberOfLines={1}>
            {phoneNo || referralCode || 'Member'}
          </CartText>
        </View>

        <View style={styles.metrics}>
          <CartText variant="price" tone={hasEarned ? 'success' : 'faint'}>
            {formatBT(earning)}
            <CartText variant="caption" tone="muted">
              {' UD'}
            </CartText>
          </CartText>
          <CartText variant="micro" tone="muted">
            earned for you
          </CartText>
        </View>
      </View>

      <Divider />

      <View style={styles.footer}>
        <Badge
          tone={orders > 0 ? 'success' : 'neutral'}
          label={`${orders} ${orders === 1 ? 'order' : 'orders'}`}
          icon={
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={wp('3.4%')}
              color={orders > 0 ? CART_COLORS.successDeep : CART_COLORS.textMuted}
            />
          }
        />

        {!!joinedAt && (
          <View style={styles.joined}>
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={wp('3.6%')}
              color={CART_COLORS.textFaint}
            />
            <CartText variant="micro" tone="muted">
              Joined {formatDate(joinedAt)}
            </CartText>
          </View>
        )}
      </View>
    </Surface>
  );
};

export default React.memo(MemberCard);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.md,
    gap: CART_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  metrics: {
    alignItems: 'flex-end',
    gap: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CART_SPACING.sm,
  },
  joined: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
});
