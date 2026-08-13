import React from 'react';
import { Text } from 'react-native';
import { FONTS } from '@/styles/typography';
import { CART_COLORS, CART_TYPE, MAX_FONT_SCALE } from '@/styles/cartTheme';
import { PEACH } from '../tokens';

const VARIANTS = {
  script: {
    ...CART_TYPE.heading,
    fontFamily: FONTS.script.regular,
  },
  display: {
    ...CART_TYPE.display,
    letterSpacing: -0.6,
  },
  tileTitle: {
    ...CART_TYPE.labelStrong,
    letterSpacing: -0.2,
  },
  tileCaption: CART_TYPE.caption,
  chip: CART_TYPE.captionStrong,
  sealLead: CART_TYPE.micro,
  sealValue: {
    ...CART_TYPE.heading,
    letterSpacing: -0.4,
  },
  cta: CART_TYPE.cta,
};

const TONES = {
  deep: PEACH.deep,
  ink: PEACH.ink,
  muted: 'rgba(122,46,11,0.68)',
  onSeal: CART_COLORS.onPrimary,
  onDark: CART_COLORS.onPrimary,
};

const DealText = ({
  variant = 'tileCaption',
  tone = 'ink',
  style,
  children,
  ...rest
}) => (
  <Text
    maxFontSizeMultiplier={MAX_FONT_SCALE}
    {...rest}
    style={[
      VARIANTS[variant] || VARIANTS.tileCaption,
      { color: TONES[tone] || tone },
      style,
    ]}
  >
    {children}
  </Text>
);

export default React.memo(DealText);
