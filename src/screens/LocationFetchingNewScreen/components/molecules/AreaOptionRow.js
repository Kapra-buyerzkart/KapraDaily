import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ICON_GLYPH_SIZE, TICK_ICON } from '../../constants';
import { COLORS, RADIUS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../theme';
import { LocText } from '../atoms';

const AreaOptionRow = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={styles.row}
    onPress={() => onPress(item)}
    activeOpacity={0.8}
  >
    <LocText variant="bodyStrong" tone="brand">
      {item?.areaName}
    </LocText>
    {isSelected && (
      <View>
        <Image
          tintColor={COLORS.brandSoft}
          source={TICK_ICON}
          style={styles.tick}
        />
      </View>
    )}
  </TouchableOpacity>
);

export default React.memo(AreaOptionRow);

const styles = StyleSheet.create({
  row: {
    width: WINDOW_WIDTH * 0.9,
    height: WINDOW_HEIGHT * 0.05,
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.brandTint,
    marginTop: 10,
    borderRadius: RADIUS.xs,
  },
  tick: {
    height: ICON_GLYPH_SIZE,
    width: ICON_GLYPH_SIZE,
    resizeMode: 'contain',
  },
});
