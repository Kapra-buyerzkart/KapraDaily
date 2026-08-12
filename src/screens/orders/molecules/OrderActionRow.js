import React from 'react';
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
  TOUCH_MIN,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';

const Action = ({ label, icon, variant, disabled, onPress, style }) => {
  const primary = variant === 'primary';
  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={[
        styles.action,
        primary ? styles.primary : styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
    >
      {!!icon && (
        <Ionicons
          name={icon}
          size={wp('3.9%')}
          color={primary ? INK.onDark : INK.base}
          style={styles.icon}
        />
      )}
      <Text
        style={[styles.label, primary ? styles.primaryText : styles.ghostText]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const OrderActionRow = ({ actions = [], style }) => {
  const visible = actions.filter(Boolean);
  if (!visible.length) return null;

  return (
    <View style={[styles.row, style]}>
      {visible.map((action, index) => (
        <Action
          key={action.label}
          {...action}
          style={index > 0 && styles.spaced}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: SPACE.base,
  },
  action: {
    flex: 1,
    minHeight: TOUCH_MIN - 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.sm,
  },
  spaced: {
    marginLeft: SPACE.sm + 2,
  },
  primary: {
    backgroundColor: INK.strong,
  },
  ghost: {
    backgroundColor: SURFACE.sunken,
    borderWidth: 1,
    borderColor: HAIRLINE,
  },
  disabled: {
    opacity: 0.45,
  },
  icon: {
    marginRight: SPACE.xs + 2,
  },
  label: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.2,
  },
  primaryText: {
    color: INK.onDark,
  },
  ghostText: {
    color: INK.base,
  },
});

export default React.memo(OrderActionRow);
