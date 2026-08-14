import React from 'react';
import { Text } from 'react-native';

import { COLORS, TYPE } from '../../theme';

const TONES = {
  primary: COLORS.textPrimary,
  muted: COLORS.textMuted,
  accent: COLORS.accent,
};

const TicketText = ({
  variant = 'body',
  tone = 'primary',
  style,
  children,
  ...rest
}) => (
  <Text
    {...rest}
    style={[TYPE[variant] || TYPE.body, { color: TONES[tone] || tone }, style]}
  >
    {children}
  </Text>
);

export default React.memo(TicketText);
