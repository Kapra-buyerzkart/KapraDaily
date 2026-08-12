import React from 'react';
import { Text } from 'react-native';

import { COLORS, MAX_FONT_SCALE, TYPE } from '../../theme';

const TONES = {
  primary: COLORS.textPrimary,
  secondary: COLORS.textSecondary,
  muted: COLORS.textMuted,
  faint: COLORS.textFaint,
  brand: COLORS.primary,
  danger: COLORS.danger,
  onDark: COLORS.onDark,
};

const AddrText = ({
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

export default React.memo(AddrText);
