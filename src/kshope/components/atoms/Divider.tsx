import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { UI_COLORS, UI_SPACING } from '../../theme/tokens';

export interface DividerProps {
  inset?: number;
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({ inset = 0, dashed = false, style }) => (
  <View
    style={[
      dashed ? styles.dashed : styles.solid,
      inset ? { marginHorizontal: inset } : null,
      style,
    ]}
  />
);

export default React.memo(Divider);

const styles = StyleSheet.create({
  solid: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: UI_COLORS.borderStrong,
  },
  dashed: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: UI_COLORS.borderStrong,
    marginVertical: UI_SPACING.xs,
  },
});
