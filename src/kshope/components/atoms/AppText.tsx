import React from 'react';
import { Text, TextProps } from 'react-native';
import {
  UI_COLORS,
  UI_TYPE,
  UITypeVariant,
  MAX_FONT_SCALE,
} from '../../theme/tokens';

const TONES = {
  primary: UI_COLORS.textPrimary,
  secondary: UI_COLORS.textSecondary,
  muted: UI_COLORS.textMuted,
  faint: UI_COLORS.textFaint,
  brand: UI_COLORS.primary,
  success: UI_COLORS.successDeep,
  token: UI_COLORS.token,
  danger: UI_COLORS.danger,
  onDark: UI_COLORS.onPrimary,
  pink: UI_COLORS.pink,
};

export type AppTextTone = keyof typeof TONES;

export interface AppTextProps extends TextProps {
  variant?: UITypeVariant;
  tone?: AppTextTone | string;
}

const AppText: React.FC<AppTextProps> = ({
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
      UI_TYPE[variant] || UI_TYPE.body,
      { color: TONES[tone as AppTextTone] || tone },
      style,
    ]}
  >
    {children}
  </Text>
);

export default React.memo(AppText);
