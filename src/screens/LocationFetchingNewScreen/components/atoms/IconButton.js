import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { ICON_BUTTON_SIZE, ICON_GLYPH_SIZE } from '../../constants';
import { COLORS, RADIUS, hitSlopTo } from '../../theme';

const IconButton = ({ source, onPress, tintColor, style, ...rest }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    hitSlop={hitSlopTo(ICON_BUTTON_SIZE)}
    activeOpacity={0.8}
    {...rest}
  >
    <Image source={source} style={styles.glyph} tintColor={tintColor} />
  </TouchableOpacity>
);

export default React.memo(IconButton);

const styles = StyleSheet.create({
  button: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    backgroundColor: COLORS.surface,
    marginLeft: 10,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  glyph: {
    width: ICON_GLYPH_SIZE,
    height: ICON_GLYPH_SIZE,
    resizeMode: 'contain',
  },
});
