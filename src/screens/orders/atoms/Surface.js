import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, GUTTER, RADIUS, SHADOW } from '../theme';

const CAPS = {
  single: () => styles.capSingle,
  top: () => styles.capTop,
  middle: () => styles.capMiddle,
  bottom: () => styles.capBottom,
};

const Surface = ({
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
      (CAPS[position] || CAPS.single)(),
      elevated && SHADOW.card,
      style,
    ]}
  >
    {children}
  </View>
);

export default React.memo(Surface);

const styles = StyleSheet.create({
  shell: {
    backgroundColor: COLORS.surface,
  },
  inset: {
    marginHorizontal: GUTTER,
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
