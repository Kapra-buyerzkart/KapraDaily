import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CLOSE_ICON } from '../../constants';
import { COLORS, RADIUS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../theme';
import { IconButton, LocText } from '../atoms';

const SheetHeader = ({ title, onClose }) => (
  <View style={styles.header}>
    <LocText variant="heading" tone="onBrand">
      {title}
    </LocText>
    <IconButton source={CLOSE_ICON} onPress={onClose} />
  </View>
);

export default React.memo(SheetHeader);

const styles = StyleSheet.create({
  header: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT * 0.07,
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: COLORS.brand,
    borderTopRightRadius: RADIUS.card,
    borderTopLeftRadius: RADIUS.card,
  },
});
