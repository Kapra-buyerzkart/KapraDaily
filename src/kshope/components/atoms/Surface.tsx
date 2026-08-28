import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_GUTTER,
  UI_RADIUS,
} from '../../theme/tokens';

export interface SurfaceProps extends ViewProps {
  position?: 'single' | 'top' | 'middle' | 'bottom';
  elevated?: boolean;
  inset?: boolean;
}

const Surface: React.FC<SurfaceProps> = ({
  position = 'single',
  elevated = true,
  inset = true,
  style,
  children,
  ...rest
}) => (
  <View
    {...rest}
    style={[
      styles.shell,
      inset && styles.inset,
      styles[position],
      elevated && UI_ELEVATION.card,
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(Surface);

const styles = StyleSheet.create({
  shell: {
    backgroundColor: UI_COLORS.card,
  },
  inset: {
    marginHorizontal: UI_GUTTER,
  },
  single: {
    borderRadius: UI_RADIUS.card,
  },
  top: {
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
  },
  middle: {},
  bottom: {
    borderBottomLeftRadius: UI_RADIUS.card,
    borderBottomRightRadius: UI_RADIUS.card,
  },
});
