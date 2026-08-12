import React from 'react';
import { View, StyleSheet } from 'react-native';
import FieldLabel from '../atoms/FieldLabel';
import GenderChip from '../atoms/GenderChip';
import { GENDER_OPTIONS } from '../constants';
import { CART_SPACING } from '@/styles/cartTheme';

const GenderField = ({ value, onChange }) => (
  <View>
    <FieldLabel optional>Gender</FieldLabel>

    <View style={styles.row} accessibilityRole="radiogroup">
      {GENDER_OPTIONS.map(item => (
        <GenderChip
          key={item}
          label={item}
          selected={value === item}
          onPress={() => onChange(item)}
        />
      ))}
    </View>
  </View>
);

export default React.memo(GenderField);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: CART_SPACING.sm,
  },
});
