import React from 'react';
import { Text } from 'react-native';
import { COLORS, TYPE, MAX_FONT_SCALE } from '../theme';

const TONES = {
  primary: COLORS.textPrimary,
  secondary: COLORS.textSecondary,
  muted: COLORS.textMuted,
  faint: COLORS.textFaint,
  brand: COLORS.primary,
  success: COLORS.success,
  danger: COLORS.danger,
  info: COLORS.info,
  warn: COLORS.warn,
  onDark: COLORS.onDark,
};

const OrderText = ({
  variant = 'body',
  tone = 'primary',
  style,
  children,
  ...rest
}) => (
  <Text
    maxFontSizeMultiplier={MAX_FONT_SCALE}
    {...rest}
    style={[TYPE[variant] || TYPE.body, { color: TONES[tone] || tone }, style]}
  >
    {children}
  </Text>
);

export default React.memo(OrderText);
