import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import IconDisc from '../atoms/IconDisc';
import { COLORS, GUTTER, RADIUS, SPACING, TOUCH_MIN, wp } from '../theme';

const OrdersEmptyState = ({
  icon = 'bag-handle-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => (
  <View style={styles.wrap}>
    <IconDisc size={wp('20%')} tone="neutral" radius={wp('10%')}>
      <Ionicons name={icon} size={wp('8.4%')} color={COLORS.textSecondary} />
    </IconDisc>

    <OrderText variant="heading" style={styles.title}>
      {title}
    </OrderText>
    <OrderText variant="body" tone="muted" style={styles.message}>
      {message}
    </OrderText>

    {!!onAction && (
      <AnimatedPressable
        style={styles.action}
        onPress={onAction}
        accessibilityRole="button"
      >
        <OrderText variant="labelStrong" tone="onDark">
          {actionLabel}
        </OrderText>
      </AnimatedPressable>
    )}
  </View>
);

export default React.memo(OrdersEmptyState);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.xxxl,
  },
  title: {
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  message: {
    marginTop: SPACING.xs + 2,
    textAlign: 'center',
    maxWidth: wp('72%'),
  },
  action: {
    minHeight: TOUCH_MIN,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
    marginTop: SPACING.xl,
  },
});
