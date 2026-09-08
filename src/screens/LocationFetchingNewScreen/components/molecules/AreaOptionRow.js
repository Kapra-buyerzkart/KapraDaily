import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { BEACON_ICON_NAME } from '../../constants';
import { COLORS, RADIUS, SPACING } from '../../theme';
import { LocText } from '../atoms';

const AreaOptionRow = ({ item, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.row, isSelected && styles.rowSelected]}
    onPress={() => onPress(item)}
    activeOpacity={0.85}
  >
    <View style={[styles.pin, isSelected && styles.pinSelected]}>
      <Ionicons name={BEACON_ICON_NAME} size={16} color={COLORS.brand} />
    </View>

    <LocText
      variant="bodyStrong"
      tone={isSelected ? 'primary' : 'secondary'}
      numberOfLines={2}
      style={styles.label}
    >
      {item?.areaName}
    </LocText>

    <View style={[styles.radio, isSelected && styles.radioSelected]}>
      {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
    </View>
  </TouchableOpacity>
);

export default React.memo(AreaOptionRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: COLORS.canvas,
  },
  rowSelected: {
    backgroundColor: COLORS.brandTint,
    borderColor: COLORS.brand,
  },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandTint,
  },
  pinSelected: {
    backgroundColor: COLORS.canvas,
  },
  label: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLORS.brand,
    backgroundColor: COLORS.brand,
  },
});
