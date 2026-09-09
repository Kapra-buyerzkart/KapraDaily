import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CLOSE_ICON } from '../../constants';
import { COLORS, RADIUS, SPACING } from '../../theme';
import { IconButton, LocText } from '../atoms';

const SheetHeader = ({ title, onClose }) => (
  <View style={styles.header}>
    <LocText
      variant="title"
      tone="primary"
      numberOfLines={1}
      style={styles.title}
    >
      {title}
    </LocText>
    {!!onClose && (
      <IconButton
        source={CLOSE_ICON}
        onPress={onClose}
        tintColor={COLORS.brandDeep}
        style={styles.close}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
    )}
  </View>
);

export default React.memo(SheetHeader);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    flexShrink: 1,
    marginRight: SPACING.md,
  },
  close: {
    marginLeft: 0,
    backgroundColor: COLORS.brandTint,
    borderRadius: RADIUS.pill,
    shadowOpacity: 0,
    elevation: 0,
  },
});
