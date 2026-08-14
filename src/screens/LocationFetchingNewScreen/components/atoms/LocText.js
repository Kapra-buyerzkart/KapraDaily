import React from 'react';
import { Text } from 'react-native';

import { COLORS, MAX_FONT_SCALE, TYPE } from '../../theme';

const TONES = {
  primary: COLORS.textPrimary,
  secondary: COLORS.textSecondary,
  muted: COLORS.textMuted,
  brand: COLORS.brand,
  brandDeep: COLORS.brandDeep,
  onBrand: COLORS.onBrand,
};

const LocText = ({
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

export default React.memo(LocText);
