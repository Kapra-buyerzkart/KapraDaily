import React from 'react';
import { Text } from 'react-native';

import { MAX_FONT_SCALE } from '@/styles/cartTheme';

import { PALETTE, TYPE } from '../theme';

const TONES = {
  primary: PALETTE.textPrimary,
  muted: PALETTE.textMuted,
  faint: PALETTE.textFaint,
  brand: PALETTE.brand,
  onDark: PALETTE.onDark,
};

const LandingText = ({
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

export default React.memo(LandingText);
