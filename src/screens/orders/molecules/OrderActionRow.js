import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import { COLORS, RADIUS, SPACING, TOUCH_MIN, wp } from '../theme';

const Action = ({ label, icon, variant, disabled, onPress, style }) => {
  const solid = variant === 'primary';
  const fg = disabled ? COLORS.textFaint : solid ? COLORS.onDark : COLORS.ink;

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        styles.action,
        solid ? styles.solid : styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {!!icon && <Ionicons name={icon} size={wp('3.8%')} color={fg} />}
      <OrderText variant="captionStrong" tone={fg} numberOfLines={1}>
        {label}
      </OrderText>
    </AnimatedPressable>
  );
};

const OrderActionRow = ({ actions = [], style }) => {
  const visible = actions.filter(Boolean);
  if (!visible.length) return null;

  return (
    <View style={[styles.row, style]}>
      {visible.map(action => (
        <Action key={action.label} {...action} />
      ))}
    </View>
  );
};

export default React.memo(OrderActionRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  action: {
    flex: 1,
    minHeight: TOUCH_MIN - 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    borderRadius: RADIUS.button,
    paddingHorizontal: SPACING.sm,
  },
  solid: {
    backgroundColor: COLORS.ink,
  },
  ghost: {
    backgroundColor: COLORS.well,
  },
  disabled: {
    opacity: 0.45,
  },
});
