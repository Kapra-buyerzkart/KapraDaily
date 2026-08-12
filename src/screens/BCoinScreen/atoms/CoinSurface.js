import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GUTTER, PALETTE, RADIUS, SHADOW } from '../theme';

const CoinSurface = ({
  as: Container = View,
  position = 'single',
  elevated = true,
  inset = true,
  bordered = false,
  style,
  children,
  ...rest
}) => (
  <Container
    {...rest}
    style={[
      styles.shell,
      inset && styles.inset,
      CAPS[position] || CAPS.single,
      bordered && styles.bordered,
      elevated && SHADOW.card,
      style,
    ]}
  >
    {children}
  </Container>
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
  capSingle: {
    borderRadius: RADIUS.card,
  },
  capTop: {
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
  },
  capMiddle: {},
  capBottom: {
    borderBottomLeftRadius: RADIUS.card,
    borderBottomRightRadius: RADIUS.card,
  },
});

const CAPS = {
  single: styles.capSingle,
  top: styles.capTop,
  middle: styles.capMiddle,
  bottom: styles.capBottom,
};
