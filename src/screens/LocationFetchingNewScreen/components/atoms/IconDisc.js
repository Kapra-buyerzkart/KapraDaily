import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ICON_BUTTON_SIZE } from '../../constants';
import { COLORS, RADIUS } from '../../theme';

const IconDisc = ({ source, tintColor = COLORS.brand, size = 15 }) => (
  <View style={styles.disc}>
    <Image
      source={source}
      tintColor={tintColor}
      style={[styles.glyph, { width: size, height: size }]}
    />
  </View>
);

export default React.memo(IconDisc);

const styles = StyleSheet.create({
  disc: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    backgroundColor: COLORS.surface,
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
    resizeMode: 'contain',
  },
});
