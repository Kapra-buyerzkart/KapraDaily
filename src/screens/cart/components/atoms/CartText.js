import React from 'react';
import { Text } from 'react-native';
import {
  CART_COLORS,
  CART_TYPE,
  MAX_FONT_SCALE,
} from '../../../../styles/cartTheme';

const TONES = {
  primary: CART_COLORS.textPrimary,
  secondary: CART_COLORS.textSecondary,
  muted: CART_COLORS.textMuted,
  faint: CART_COLORS.textFaint,
  brand: CART_COLORS.primary,
  success: CART_COLORS.successDeep,
  danger: CART_COLORS.danger,
  onDark: CART_COLORS.onPrimary,
  pink: CART_COLORS.pink,
};

const CartText = ({
  variant = 'body',
  tone = 'primary',
  style,
  children,
  ...rest
}) => (
  <Text
    maxFontSizeMultiplier={MAX_FONT_SCALE}
    {...rest}
    style={[
      CART_TYPE[variant] || CART_TYPE.body,
      { color: TONES[tone] || tone },
      style,
    ]}
  >
    {children}
  </Text>
);

export default React.memo(CartText);
