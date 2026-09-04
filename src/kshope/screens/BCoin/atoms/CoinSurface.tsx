import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { GUTTER, PALETTE, RADIUS, SHADOW } from '../theme';

export interface CoinSurfaceProps extends ViewProps {
  position?: 'single' | 'top' | 'middle' | 'bottom';
  elevated?: boolean;
  inset?: boolean;
  bordered?: boolean;
}

const CoinSurface: React.FC<CoinSurfaceProps> = ({
  position = 'single',
  elevated = true,
  inset = true,
  bordered = false,
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
      bordered && styles.bordered,
      elevated && SHADOW.card,
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(CoinSurface);

const styles = StyleSheet.create({
  shell: {
    backgroundColor: PALETTE.surface,
  },
  inset: {
    marginHorizontal: GUTTER,
  },
  bordered: {
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  single: {
    borderRadius: RADIUS.card,
  },
  top: {
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
  },
  middle: {},
  bottom: {
    borderBottomLeftRadius: RADIUS.card,
    borderBottomRightRadius: RADIUS.card,
  },
});
