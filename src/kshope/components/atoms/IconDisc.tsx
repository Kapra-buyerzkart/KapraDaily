import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { UI_COLORS, UI_RADIUS } from '../../theme/tokens';

const TONES: Record<string, string> = {
  brand: UI_COLORS.primaryTint,
  success: UI_COLORS.successTint,
  neutral: UI_COLORS.well,
  pink: UI_COLORS.pinkTint,
  danger: UI_COLORS.dangerTint,
  token: UI_COLORS.tokenTint,
};

export interface IconDiscProps {
  size?: number;
  tone?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const IconDisc: React.FC<IconDiscProps> = ({
  size = 34,
  tone = 'brand',
  radius,
  style,
  children,
}) => (
  <View
    style={[
      styles.disc,
      {
        width: size,
        height: size,
        borderRadius: radius ?? UI_RADIUS.icon,
        backgroundColor: TONES[tone] || tone,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(IconDisc);

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
