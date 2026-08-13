import { View } from 'react-native';
import React from 'react';
import { styles } from '../../styles';
import { PRIORITY_OPTIONS, priorityOption } from '../../constants';
import FieldLabel from '../atoms/FieldLabel';
import PriorityChip from '../atoms/PriorityChip';
import PriorityHint from '../atoms/PriorityHint';

function PrioritySelector({ value, onChange }) {
  const selected = priorityOption(value);

  return (
    <View style={styles.field}>
      <FieldLabel>Priority</FieldLabel>

      <View style={styles.priorityRow} accessibilityRole="radiogroup">
        {PRIORITY_OPTIONS.map(option => (
          <PriorityChip
            key={option.key}
            option={option}
            selected={value === option.key}
            onPress={() => onChange(option.key)}
          />
        ))}
      </View>

      <PriorityHint tint={selected.tint} hint={selected.hint} />
    </View>
  );
}

export default React.memo(PrioritySelector);
