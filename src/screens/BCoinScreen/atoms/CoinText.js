import React from 'react';
import { Text } from 'react-native';
import { CART_TYPE, MAX_FONT_SCALE } from '@/styles/cartTheme';

import { PALETTE } from '../theme';

const TONES = {
  primary: PALETTE.textPrimary,
  secondary: PALETTE.textSecondary,
  muted: PALETTE.textMuted,
  faint: PALETTE.textFaint,
  brand: PALETTE.orange,
  gold: PALETTE.goldDeep,
  violet: PALETTE.violet,
  credit: PALETTE.credit,
  debit: PALETTE.debit,
  onDark: PALETTE.surface,
  disabled: PALETTE.disabledText,
};

const CoinText = ({
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

export default React.memo(CoinText);
